import express from "express";
import { createTask, getTasks } from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create a new task
router.post("/", verifyToken, createTask);

// GET tasks for logged-in user
router.get("/", verifyToken, getTasks);

export default router;
