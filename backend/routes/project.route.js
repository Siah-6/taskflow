import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  addCollaborator,
  removeCollaborator,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// CREATE a new project
router.post("/", verifyToken, createProject);

// GET all projects for the logged-in user
router.get("/", verifyToken, getProjects);

// GET a single project by ID
router.get("/:id", verifyToken, getProject);

// UPDATE a project
router.put("/:id", verifyToken, updateProject);

// DELETE a project
router.delete("/:id", verifyToken, deleteProject);

// ADD member to project
router.post("/:id/members", verifyToken, addMember);

// ADD collaborator to project
router.post("/:id/collaborators", verifyToken, addCollaborator);

// REMOVE collaborator from project
router.delete("/:id/collaborators/:email", verifyToken, removeCollaborator);

export default router;
