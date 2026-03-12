import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", verifyToken, getUserProfile);

export default router;
