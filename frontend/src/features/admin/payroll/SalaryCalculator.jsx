import { useEffect, useMemo, useState } from "react";

const SalaryCalculator = ({ snapshot, onSave }) => {
  const [attendance, setAttendance] = useState({
    halfDays: 0,
    wfhDays: 0,
    unpaidLeaveDays: 0,
    sandwichDays: 0,
    lateMarks: 0
  });

  useEffect(() => {
    if (snapshot?.attendanceSummary) {
      setAttendance({
        halfDays: Number(snapshot.attendanceSummary.halfDays || 0),
        wfhDays: Number(snapshot.attendanceSummary.wfhDays || 0),
        unpaidLeaveDays: Number(snapshot.attendanceSummary.unpaidLeaveDays || 0),
        sandwichDays: Number(snapshot.attendanceSummary.sandwichDays || 0),
        lateMarks: Number(snapshot.attendanceSummary.lateMarks || 0)
      });
    }
  }, [snapshot]);

  const recalculated = useMemo(() => {
    if (!snapshot) return null;

    const perDay = snapshot.perDaySalary;

    const deductions = {
      halfDayAmount: attendance.halfDays * perDay * 0.5,
      wfhAmount: attendance.wfhDays * perDay * 0.5,
      unpaidLeaveAmount: attendance.unpaidLeaveDays * perDay,
      sandwichAmount: attendance.sandwichDays * perDay, //leave management already calculate saturday-sunday leave separately
      lateMarkAmount: attendance.lateMarks * 100
    };

    const totalDeduction = Object.values(deductions) //test update 
      .reduce((a, b) => a + b, 0);

    const netSalary = Math.max(
      snapshot.earnedSalary - totalDeduction,
      0
    );

    return {
      deductions,
      totalDeduction,
      netSalary
    };
  }, [attendance, snapshot]);

  if (!snapshot || !recalculated) return null;

  const {
    monthlySalary,
    perDaySalary,
    earnedSalary,
    attendanceSummary,
    workingDays,
    workedDays
  } = snapshot;

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h3 className="text-lg font-semibold">Salary Calculator</h3>

      {/* BASIC INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Monthly Salary:</strong> ₹{monthlySalary}</div>
        <div><strong>Per Day Salary:</strong> ₹{perDaySalary.toFixed(2)}</div>
        <div><strong>Working Days:</strong> {workingDays}</div>
        <div><strong>Worked Days:</strong> {workedDays}</div>
        <div><strong>Earned Salary:</strong> ₹{earnedSalary.toFixed(2)}</div>
        <div>
          <strong>Absent Days:</strong>{" "}
          {attendanceSummary?.absentDays ?? 0}
        </div>
      </div>

      {/* EDITABLE PENALTIES */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(attendance).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm capitalize">{key}</label>
            <input
              type="number"
              value={value}
              min="0"
              onChange={e =>
                setAttendance({
                  ...attendance,
                  [key]: Number(e.target.value)
                })
              }
              className="border p-2 rounded w-full"
            />
          </div>
        ))}
      </div>

      {/* DEDUCTIONS */}
      <div className="border rounded p-4 bg-gray-50 text-sm space-y-1">
        <div>Half Day: ₹{recalculated.deductions.halfDayAmount}</div>
        <div>WFH: ₹{recalculated.deductions.wfhAmount}</div>
        <div>Unpaid Leave: ₹{recalculated.deductions.unpaidLeaveAmount}</div>
        <div>Sandwich: ₹{recalculated.deductions.sandwichAmount}</div>
        <div>Late Marks: ₹{recalculated.deductions.lateMarkAmount}</div>

        <hr />
        <div className="font-semibold">
          Total Deduction: ₹{recalculated.totalDeduction}
        </div>
      </div>

      {/* FINAL */}
      <div className="text-lg font-semibold">
        Net Salary: ₹{recalculated.netSalary}
      </div>

      <button
        onClick={() =>
          onSave({
            ...snapshot,
            attendanceSummary: {
              ...snapshot.attendanceSummary,
              ...attendance
            },
            deductions: {
              ...recalculated.deductions,
              totalDeduction: recalculated.totalDeduction
            },
            netSalary: recalculated.netSalary
          })
        }
        className="bg-black text-white px-6 py-2 rounded"
      >
        Save Payroll
      </button>
    </div>
  );
};

export default SalaryCalculator;
