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

// GET all tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
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
    const { title, description, status, priority } = req.body;

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
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;

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
