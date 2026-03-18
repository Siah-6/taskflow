import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.userId, // from JWT
    });

    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
