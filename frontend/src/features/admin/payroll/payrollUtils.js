// ===== Date Utilities =====

export const getDateRangeArray = (fromDate, toDate) => {
  const dates = [];
  const start = new Date(fromDate);
  const end = new Date(toDate);

  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    dates.push(new Date(d).toISOString().split("T")[0]);
  }

  return dates;
};

export const isWeekend = (dateStr) => {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
};

// ===== Attendance & Leave Calculations =====

export const calculateWorkingDays = (fromDate, toDate) => {
  const dates = getDateRangeArray(fromDate, toDate);
  return dates.filter((date) => !isWeekend(date)).length;
};

export const calculateAttendanceStats = ({
  fromDate,
  toDate,
  attendanceData = [],
  leaveData = [],
}) => {
  const dates = getDateRangeArray(fromDate, toDate).filter(
    (d) => !isWeekend(d)
  );

  let presentDays = 0;
  let paidLeaves = 0;
  let unpaidLeaves = 0;

  dates.forEach((date) => {
    const attendance = attendanceData.find((a) => a.date === date);
    const leave = leaveData.find(
      (l) => date >= l.fromDate && date <= l.toDate
    );

    if (attendance?.status === "Present") {
      presentDays++;
    } else if (leave) {
      if (leave.type === "Paid") paidLeaves++;
      else unpaidLeaves++;
    } else {
      unpaidLeaves++;
    }
  });

  return {
    workingDays: dates.length,
    presentDays,
    paidLeaves,
    unpaidLeaves,
  };
};

// ===== Salary Calculations =====

export const calculatePerDaySalary = (monthlySalary, workingDays) => {
  if (!monthlySalary || !workingDays) return 0;
  return Number((monthlySalary / workingDays).toFixed(2));
};

export const calculateLopAmount = (perDaySalary, unpaidLeaves) => {
  return Number((perDaySalary * unpaidLeaves).toFixed(2));
};

export const calculateNetSalary = ({
  grossSalary,
  lopAmount = 0,
  bonus = 0,
  otherDeductions = 0,
}) => {
  return Number(
    (grossSalary - lopAmount + bonus - otherDeductions).toFixed(2)
  );
};

// ===== AUTO MODE (System Driven) =====

export const calculateAutoSalary = ({
  employee,
  fromDate,
  toDate,
  attendanceData,
  leaveData,
}) => {
  const { workingDays, presentDays, paidLeaves, unpaidLeaves } =
    calculateAttendanceStats({
      fromDate,
      toDate,
      attendanceData,
      leaveData,
    });

  const grossSalary = employee.monthlySalary;
  const perDaySalary = calculatePerDaySalary(grossSalary, workingDays);
  const lopAmount = calculateLopAmount(perDaySalary, unpaidLeaves);
  const netSalary = calculateNetSalary({
    grossSalary,
    lopAmount,
  });

  return {
    employeeId: employee.id,
    mode: "AUTO",
    fromDate,
    toDate,
    workingDays,
    presentDays,
    paidLeaves,
    unpaidLeaves,
    grossSalary,
    perDaySalary,
    lopAmount,
    bonus: 0,
    otherDeductions: 0,
    netSalary,
    status: "Calculated",
  };
};

// ===== MANUAL MODE (Admin Driven) =====

export const calculateManualSalary = ({
  employeeId,
  fromDate,
  toDate,
  workingDays,
  presentDays,
  paidLeaves,
  unpaidLeaves,
  grossSalary,
  bonus = 0,
  otherDeductions = 0,
}) => {
  const perDaySalary = calculatePerDaySalary(grossSalary, workingDays);
  const lopAmount = calculateLopAmount(perDaySalary, unpaidLeaves);
  const netSalary = calculateNetSalary({
    grossSalary,
    lopAmount,
    bonus,
    otherDeductions,
  });

  return {
    employeeId,
    mode: "MANUAL",
    fromDate,
    toDate,
    workingDays,
    presentDays,
    paidLeaves,
    unpaidLeaves,
    grossSalary,
    perDaySalary,
    lopAmount,
    bonus,
    otherDeductions,
    netSalary,
    status: "Calculated",
  };
};
