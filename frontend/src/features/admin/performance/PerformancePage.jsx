import { useEffect, useState } from "react";
import PerformanceTable from "./PerformanceTable";
import MonthSelector from "./MonthSelector";
import { getEmployees } from "../../../services/api/employeeApi";
import { getAttendanceByDate } from "../../../services/api/attendanceApi";
import { getPerformanceByMonth } from "../../../services/api/performanceApi";
import MonthlyPerformanceTable from "./MonthlyPerformanceTable";

const PerformancePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monthlyPerformances, setMonthlyPerformances] = useState([]);

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const loadData = async () => {
    try {
      setLoading(true);

      const empList = await getEmployees();
      setEmployees(empList);

      const monthlyAttendance = await buildMonthlyAttendance(selectedMonth);
      setAttendanceData(monthlyAttendance);
    } catch (err) {
      console.error("Performance load error:", err);
    } finally {
      setLoading(false);
    }

    const perfRes = await getPerformanceByMonth(selectedMonth);
    setMonthlyPerformances(perfRes.data);

  };

  const buildMonthlyAttendance = async (month) => {
    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const map = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const records = await getAttendanceByDate(date);

      records.forEach((r) => {
        const empId = String(r.employeeId);

        if (!map[empId]) {
          map[empId] = {
            employeeId: empId,
            totalDays: 0,
            presentDays: 0,
            leaves: 0,
            lateMarks: 0
          };
        }

        map[empId].totalDays++;

        if (r.attendanceStatus === "Present") {
          map[empId].presentDays++;
        }

        if (r.attendanceStatus === "Leave") {
          map[empId].leaves++;
        }

        if (r.punctuality === "Late") {
          map[empId].lateMarks++;
        }
      });
    }

    return Object.values(map).map((a) => ({
      employeeId: a.employeeId,
      attendancePercentage:
        a.totalDays === 0
          ? 0
          : Math.round((a.presentDays / a.totalDays) * 100),
      leaves: a.leaves,
      lateMarks: a.lateMarks
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Performance Dashboard</h1>
        <MonthSelector
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
        />
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading attendance...</div>
      ) : (
        <PerformanceTable
          employees={employees}
          attendanceData={attendanceData}
          selectedMonth={selectedMonth}
          onReviewSaved={loadData}
        />
      )}

      {loading ? (
        <div className="text-sm text-gray-500">Loading attendance...</div>
      ) : (
        <MonthlyPerformanceTable
          performances={monthlyPerformances}
        />

      )}

    </div>
  );
};

export default PerformancePage;
