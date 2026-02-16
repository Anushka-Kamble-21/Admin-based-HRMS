import mongoose from "mongoose";
import Attendance from "./attendance.model.js";
import Employee from "../employees/employee.model.js";

export const getAttendanceByDate = async (date, company) => {
  if (!company) {
    return Attendance.find({ date });
  }

  const employees = await Employee.find(
    { company },   // FIXED
    { _id: 1 }
  );

  const employeeIds = employees.map(e => e._id);

  return Attendance.find({
    date,
    employeeId: { $in: employeeIds }
  });
};


export const saveAttendanceBulk = async (records) => {
  for (const rec of records) {
    await Attendance.findOneAndUpdate(
      {
        employeeId: new mongoose.Types.ObjectId(rec.employeeId),
        date: rec.date
      },
      {
        $set: {
          employeeId: new mongoose.Types.ObjectId(rec.employeeId),
          date: rec.date,
          loginTime: rec.loginTime === "" ? null : rec.loginTime,
          logoutTime: rec.logoutTime === "" ? null : rec.logoutTime,
          attendanceStatus: rec.attendanceStatus || "Absent",
          punctuality: rec.punctuality || ""
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );
  }
};

export const getMonthlyAttendanceSummary = async (
  employeeId,
  month,
  year
) => {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0)
    .toISOString()
    .slice(0, 10);

  const records = await Attendance.find({
    employeeId,
    date: { $gte: startDate, $lte: endDate }
  });

  const summary = {
    Present: 0,
    Absent: 0,
    "On Leave": 0,
    WFH: 0,
    "Half Day": 0,
    Late: 0
  };

  records.forEach(r => {
    summary[r.attendanceStatus]++;
    if (r.punctuality === "Late") summary.Late++;
  });

  return summary;
};
