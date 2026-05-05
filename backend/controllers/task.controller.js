import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, project, board, dueDate } = req.body;
    

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Validate project ID if provided
    let projectId = null;
    if (project && project !== "" && project !== "null") {
      if (!mongoose.Types.ObjectId.isValid(project)) {
        return res.status(400).json({ message: "Invalid project ID format" });
      }
      projectId = project;
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "Medium",
      project: projectId,
      board: board || "To Do",
      dueDate: dueDate || null,
      user: req.user.userId, // from JWT
    });


    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// GET all tasks for logged-in user with filtering
export const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      project,
      board,
      search,
      dateFrom,
      dateTo,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Get user email to check collaborator access
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all projects the user has access to
    const accessibleProjects = await Project.find({
      $or: [
        { owner: req.user.userId },
        { collaborators: user.email }
      ]
    }).select('_id');

    const accessibleProjectIds = accessibleProjects.map(p => p._id);

    // If project filter is specified, check if user has access to that project
    if (project && project !== "all") {
      if (!accessibleProjectIds.some(id => id.toString() === project)) {
        return res.status(403).json({ message: "Access denied to this project" });
      }
    }

    // Build filter object - filter by accessible projects
    const filter = { 
      project: { $in: accessibleProjectIds }
    };

    // Add filters - handle arrays for multi-select
    if (status && status !== "all") {
      if (Array.isArray(status)) {
        filter.status = { $in: status };
      } else {
        filter.status = status;
      }
    }

    if (priority && priority !== "all") {
      if (Array.isArray(priority)) {
        filter.priority = { $in: priority };
      } else {
        filter.priority = priority;
      }
    }

    if (project && project !== "all") {
      filter.project = project;
    } else {
      // If no specific project filter, keep the accessible projects filter
      // filter.project already contains { $in: accessibleProjectIds }
    }

    if (board && board !== "all") {
      filter.board = board;
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Date range filtering
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Sort options
    const sortOptions = {};
    const validSortFields = [
      "createdAt",
      "updatedAt",
      "priority",
      "status",
      "title",
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    sortOptions[sortField] = sortDirection;

    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .populate("project", "name");


    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// UPDATE a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, board, dueDate } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    // Find task
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Get user email to check collaborator access
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has access to the task's project
    if (task.project) {
      const project = await Project.findById(task.project);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const isOwner = project.owner.toString() === req.user.userId;
      const isCollaborator = project.collaborators.includes(user.email);

      if (!isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Access denied to this task" });
      }
    } else {
      // If task has no project, only the task owner can modify it
      if (task.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Access denied to this task" });
      }
    }

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      task.status = status;
      // Auto-sync board with status to ensure proper column placement
      task.board = status;
    }
    if (priority !== undefined) task.priority = priority;
    if (board !== undefined) task.board = board;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating task" });
  }
};

// DELETE a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    // Find task
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Get user email to check collaborator access
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has access to the task's project
    if (task.project) {
      const project = await Project.findById(task.project);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const isOwner = project.owner.toString() === req.user.userId;
      const isCollaborator = project.collaborators.includes(user.email);

      if (!isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Access denied to this task" });
      }
    } else {
      // If task has no project, only the task owner can delete it
      if (task.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Access denied to this task" });
      }
    }

    // Delete the task
    await Task.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};
