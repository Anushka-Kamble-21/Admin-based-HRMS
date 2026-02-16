import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  fetchAttendanceByDate,
  saveAttendance,
  fetchEmployeeMonthlyAttendance
} from "./attendance.controller.js";

const router = express.Router();

router.get("/date/:date", authMiddleware, fetchAttendanceByDate);
router.get(
  "/employee/:id/monthly", authMiddleware,
  fetchEmployeeMonthlyAttendance
);

router.post("/", saveAttendance);

export default router;
