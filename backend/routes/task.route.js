import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create a new task
router.post("/", verifyToken, createTask);

// GET tasks for logged-in user
router.get("/", verifyToken, getTasks);

// UPDATE a task
router.put("/:id", verifyToken, updateTask);

// DELETE a task
router.delete("/:id", verifyToken, deleteTask);

export default router;
