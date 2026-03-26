import Project from "../models/project.model.js";
import mongoose from "mongoose";

// CREATE a new project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user.userId,
      members: [
        {
          user: req.user.userId,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
      boards: [
        {
          name: "To Do",
          color: "#6B7280",
        },
        {
          name: "In Progress",
          color: "#3B82F6",
        },
        {
          name: "Done",
          color: "#10B981",
        },
      ],
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// GET all projects for the logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.userId }, { "members.user": req.user.userId }],
    })
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// GET a single project by ID
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      $or: [{ owner: req.user.userId }, { "members.user": req.user.userId }],
    })
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

// UPDATE a project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      $or: [
        { owner: req.user.userId },
        {
          "members.user": req.user.userId,
          "members.role": { $in: ["owner", "admin"] },
        },
      ],
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or no permission" });
    }

    // Update fields if provided
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// DELETE a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const project = await Project.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      owner: req.user.userId,
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or no permission" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

// ADD member to project
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role = "member" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    // Find user by email (you'll need to import User model)
    const User = mongoose.model("User");
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      $or: [
        { owner: req.user.userId },
        {
          "members.user": req.user.userId,
          "members.role": { $in: ["owner", "admin"] },
        },
      ],
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or no permission" });
    }

    // Check if user is already a member
    const existingMember = project.members.find(
      (member) => member.user.toString() === userToAdd._id.toString(),
    );

    if (existingMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push({
      user: userToAdd._id,
      role,
      joinedAt: new Date(),
    });

    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};
