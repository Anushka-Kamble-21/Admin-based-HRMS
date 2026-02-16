import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  addEmployee,
  fetchEmployees,
  fetchEmployeeById,
  editEmployee,
  changeEmployeeStatus,
  searchEmployees,
  fetchCompanies
} from "./employee.controller.js";

const router = express.Router();

router.post("/", addEmployee);

router.get("/", authMiddleware, fetchEmployees);

// dynamic companies list
router.get("/companies/list", fetchCompanies);

router.get("/search", searchEmployees);

router.get("/:id", fetchEmployeeById);

router.put("/:id", editEmployee);

router.patch("/:id/status", changeEmployeeStatus);

export default router;
