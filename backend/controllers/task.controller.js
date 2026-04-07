import Task from "../models/task.model.js";
import mongoose from "mongoose";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, project, board } = req.body;

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

    // Build filter object
    const filter = { user: req.user.userId };

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
    const { title, description, status, priority, board } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    // Find task owned by user
    const task = await Task.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user.userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

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

    // Find task owned by user
    const task = await Task.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user.userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
};
