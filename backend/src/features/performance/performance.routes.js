import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  savePerformance,
  fetchPerformanceByMonth,
  fetchEmployeePerformance
} from "./performance.controller.js";

const router = express.Router();

router.post("/", savePerformance);
router.get("/", authMiddleware, fetchPerformanceByMonth);
router.get("/employee/:id", fetchEmployeePerformance);

export default router;
