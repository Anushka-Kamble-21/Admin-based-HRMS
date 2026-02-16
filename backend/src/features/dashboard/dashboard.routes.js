import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  getTopStats,
  getTodayAttendance,
  getDepartmentStats,
  getMonthlyAttendance,
  getMonthlySalary
} from "./dashboard.controller.js";

const router = express.Router();

router.get("/top-stats", authMiddleware, getTopStats);
router.get("/today-attendance", authMiddleware, getTodayAttendance);
router.get("/departments", authMiddleware, getDepartmentStats);
router.get("/attendance-monthly", authMiddleware, getMonthlyAttendance);
router.get("/salary-monthly", authMiddleware, getMonthlySalary);

export default router;
