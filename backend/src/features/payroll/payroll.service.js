import Attendance from "../attendance/attendance.model.js";
import Leave from "../leaves/leave.model.js";
import Employee from "../employees/employee.model.js";

/* ---------- helpers ---------- */
const round2 = (num) => Math.round(num * 100) / 100;

const isSunday = (dateStr) => {
  const d = new Date(dateStr);
  return d.getDay() === 0;
};

const getDateRange = (from, to) => {
  const dates = [];
  let current = new Date(from);
  const end = new Date(to);

  while (current <= end) {
    dates.push(new Date(current).toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const countWorkingDays = (from, to) => {
  return getDateRange(from, to).filter(d => !isSunday(d)).length;
};

/* ---------- MAIN CALCULATION ---------- */

export const calculatePayrollSnapshot = async ({
  employeeId,
  month // YYYY-MM
}) => {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new Error("Employee not found");

  const monthlySalary = employee.salary;

  /* ---------- PERIOD ---------- */

  if (!month) throw new Error("Month is required");

  const [year, mon] = month.split("-");
  const periodFrom = `${year}-${mon}-01`;
  const lastDay = new Date(year, mon, 0).getDate();
  const periodTo = `${year}-${mon}-${String(lastDay).padStart(2, "0")}`;

  /* ---------- WORKING DAYS ---------- */

  const workingDays = countWorkingDays(periodFrom, periodTo);
  const perDaySalary = round2(monthlySalary / workingDays);

  /* ---------- ATTENDANCE ---------- */

  const attendance = await Attendance.find({
    employeeId,
    date: { $gte: periodFrom, $lte: periodTo }
  });

  let presentDays = 0;
  let halfDays = 0;
  let wfhDays = 0;
  let lateMarks = 0;

  attendance.forEach(a => {
    if (isSunday(a.date)) return;

    if (a.attendanceStatus === "Present") presentDays++;
    if (a.attendanceStatus === "Half Day") halfDays++;
    if (a.attendanceStatus === "WFH") wfhDays++;
    if (a.punctuality === "Late") lateMarks++;
  });

  /* ---------- LEAVES ---------- */

  const leaves = await Leave.find({
    employeeId,
    status: "Active",
    startDate: { $lte: periodTo },
    endDate: { $gte: periodFrom }
  });

  let unpaidLeaveDays = 0;
  let sandwichDays = 0;

  leaves.forEach(l => {
    unpaidLeaveDays += l.unpaidDays || 0;
    sandwichDays += l.sandwichDays || 0;
  });

  /* ---------- WORKED DAYS ---------- */

  const workedDays =
    presentDays +
    halfDays * 0.5 +
    wfhDays * 0.5;

  const absentDays = workingDays - workedDays;

  /* ---------- EARNED SALARY ---------- */

  const earnedSalary = round2(workedDays * perDaySalary);

  /* ---------- DEDUCTIONS ---------- */

  const deductions = {
    halfDayAmount: round2(halfDays * perDaySalary * 0.5),
    wfhAmount: round2(wfhDays * perDaySalary * 0.5),
    unpaidLeaveAmount: round2(unpaidLeaveDays * perDaySalary),
    sandwichAmount: round2(sandwichDays * perDaySalary ), //leave management already calculate saturday-sunday leave separately
    lateMarkAmount: round2(lateMarks * 100)
  };

  const totalDeduction = round2(
    Object.values(deductions).reduce((a, b) => a + b, 0)
  );

  const netSalary = round2(
    Math.max(earnedSalary - totalDeduction, 0)
  );

  /* ---------- SNAPSHOT ---------- */

  return {
    employeeId,
    employeeName: employee.name,
    department: employee.department,

    periodFrom,
    periodTo,

    monthlySalary,
    perDaySalary,

    workingDays,
    workedDays,

    attendanceSummary: {
      presentDays,
      halfDays,
      wfhDays,
      unpaidLeaveDays,
      sandwichDays,
      lateMarks,
      absentDays
    },

    earnedSalary,

    deductions: {
      ...deductions,
      totalDeduction
    },

    netSalary
  };
};
