import express from "express";
import { createTask } from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTask);

export default router;
