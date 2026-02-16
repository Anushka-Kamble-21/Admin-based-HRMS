import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  fetchProfile,
  editProfile
} from "./profile.controller.js";

const router = express.Router();

router.get("/", authMiddleware, fetchProfile);
router.put("/", authMiddleware, editProfile);

export default router;
