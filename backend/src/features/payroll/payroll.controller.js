import Payroll from "./payroll.model.js";
import { calculatePayrollSnapshot } from "./payroll.service.js";
import Employee from "../employees/employee.model.js";

/* ---------- CALCULATE SNAPSHOT ---------- */
export const calculatePayroll = async (req, res) => {
  try {
    const { employeeId, month } = req.body;

    if (!employeeId || !month) {
      return res.status(400).json({
        message: "employeeId and month are required"
      });
    }

    const snapshot = await calculatePayrollSnapshot({
      employeeId,
      month
    });

    res.json(snapshot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ---------- SAVE PAYROLL ---------- */
export const savePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.create({
      ...req.body,
      status: "PENDING"
    });

    res.status(201).json(payroll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ---------- FETCH PAYROLLS ---------- */
export const getPayrolls = async (req, res) => {
  try {
    const { company } = req.query;

    let filter = {};

    if (company) {
      const employees = await Employee.find(
        { company },
        { _id: 1 }
      );

      const employeeIds = employees.map(e => e._id);

      filter.employeeId = { $in: employeeIds };
    }

    const data = await Payroll.find(filter)
      .populate("employeeId", "name department company")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- MARK PAID ---------- */
export const markPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll)
      return res.status(404).json({ message: "Not found" });

    payroll.status = "PAID";
    payroll.paidAt = new Date();
    await payroll.save();

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
