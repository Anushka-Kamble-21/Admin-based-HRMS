import express from "express";
import {
  calculatePayroll,
  savePayroll,
  getPayrolls,
  markPaid
} from "./payroll.controller.js";

const router = express.Router();

router.post("/calculate", calculatePayroll);
router.post("/", savePayroll);
router.get("/", getPayrolls);
router.patch("/:id/pay", markPaid);

export default router;
