import {
  getAttendanceByDate,
  saveAttendanceBulk, 
  getMonthlyAttendanceSummary
} from "./attendance.service.js";

export const fetchAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { company } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const records = await getAttendanceByDate(date, company);
    res.json(records);
  } catch (err) {
    console.error("FETCH ATTENDANCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


export const saveAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ message: "Records must be an array" });
    }

    await saveAttendanceBulk(records);
    res.json({ message: "Attendance saved successfully" });
  } catch (err) {
    console.error("SAVE ATTENDANCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const fetchEmployeeMonthlyAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "month and year are required" });
    }

    const data = await getMonthlyAttendanceSummary(
      id,
      Number(month),
      Number(year)
    );

    res.json(data);
  } catch (err) {
    console.error("MONTHLY ATTENDANCE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};