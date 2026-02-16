import express from "express";
import {
  getLeaves,
  addLeave,
  editLeave,
  revertLeaveById
} from "./leave.controller.js";

const router = express.Router();

router.get("/", getLeaves);
router.post("/", addLeave);
router.put("/:id", editLeave);
router.patch("/:id/revert", revertLeaveById);

export default router;
