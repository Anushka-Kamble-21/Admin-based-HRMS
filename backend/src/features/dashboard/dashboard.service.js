import Employee from "../employees/employee.model.js";
import Attendance from "../attendance/attendance.model.js";
import Payroll from "../payroll/payroll.model.js";
import Leave from "../leaves/leave.model.js";

/* ---------- TOP STATS ---------- */
export const fetchTopStats = async (company, month) => {
  const empFilter = company ? { company } : {};
  const employees = await Employee.find({ ...empFilter, status: "Active" });

  const employeeIds = employees.map(e => String(e._id));

  const [year, mon] = month.split("-");
  const monthIndex = Number(mon) - 1;

  const payrolls = await Payroll.find({
    employeeId: { $in: employeeIds },
    status: "PAID"
  });

  const paidEmployeeIds = new Set(
    payrolls.filter(p => {
      const d = new Date(p.periodFrom);
      return d.getFullYear() === Number(year) && d.getMonth() === monthIndex;
    }).map(p => String(p.employeeId))
  );

  const today = new Date().toISOString().slice(0,10);

  const leaveFilter = company ? { company } : {};

  const activeLeaves = await Leave.find({
    ...leaveFilter,
    status: "Active",
    startDate: { $lte: today },
    endDate: { $gte: today }
  });


  return {
    totalEmployees: employees.length,
    onLeaveToday: activeLeaves.length,
    salaryStatus: {
      processed: paidEmployeeIds.size,
      pending: employees.length - paidEmployeeIds.size
    }
  };
};

/* ---------- TODAY ATTENDANCE ---------- */
export const fetchTodayAttendance = async (company) => {
  const today = new Date().toISOString().slice(0, 10);

  const records = await Attendance.find({ date: today })
    .populate("employeeId", "company");

  const filtered = company
    ? records.filter(r => r.employeeId?.company === company)
    : records;

  return filtered.reduce(
    (acc, r) => {
      if (r.attendanceStatus === "Present") acc.present++;
      if (r.attendanceStatus === "Absent") acc.absent++;
      if (r.attendanceStatus === "On Leave") acc.onLeave++;
      if (r.punctuality === "Late") acc.late++;
      return acc;
    },
    { present: 0, absent: 0, onLeave: 0, late: 0 }
  );
};

/* ---------- DEPARTMENTS (PER COMPANY) ---------- */
export const fetchDepartmentStats = async (company) => {
  const match = company ? { company, status: "Active" } : { status: "Active" };

  return Employee.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        department: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);
};

/* ---------- MONTHLY ATTENDANCE ---------- */
export const fetchMonthlyAttendance = async (company) => {
  const today = new Date();
  const result = [];

  for (let i = 2; i >= 0; i--) {
    const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

    const records = await Attendance.find({
      date: {
        $gte: start.toISOString().slice(0, 10),
        $lte: end.toISOString().slice(0, 10)
      }
    }).populate("employeeId", "company");

    const filtered = company
      ? records.filter(r => r.employeeId?.company === company)
      : records;

    const total = filtered.length || 1;

    const present = filtered.filter(r => r.attendanceStatus === "Present").length;
    const absent = filtered.filter(r => r.attendanceStatus === "Absent").length;
    const onLeave = filtered.filter(r => r.attendanceStatus === "On Leave").length;

    result.push({
      month: start.toLocaleString("default", { month: "short" }),
      present: Math.round((present / total) * 100),
      absent: Math.round((absent / total) * 100),
      onLeave: Math.round((onLeave / total) * 100)
    });
  }

  return result;
};

/* ---------- MONTHLY SALARY ---------- */
export const fetchMonthlySalary = async (company, month) => {
  const [year, mon] = month.split("-");
  const monthIndex = Number(mon) - 1;

  const payrolls = await Payroll.find({
    periodFrom: {
      $gte: new Date(year, monthIndex, 1),
      $lt: new Date(year, monthIndex + 1, 1)
    }
  }).populate("employeeId", "company");

  const filtered = company
    ? payrolls.filter(p => p.employeeId?.company === company)
    : payrolls;

  return [
    {
      month: new Date(year, monthIndex, 1).toLocaleString("default", { month: "short" }),
      paid: filtered.filter(p => p.status === "PAID").length,
      pending: filtered.filter(p => p.status === "PENDING").length
    }
  ];
};
