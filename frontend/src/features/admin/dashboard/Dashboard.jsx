import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- COMPONENTS ---------- */
import AttendanceChart from "../../../components/charts/AttendanceChart";
import SalaryChart from "../../../components/charts/SalaryChart";
import DashboardTopCards from "./DashboardTopCards";
import DepartmentChart from "../../../components/charts/DepartmentChart";
import HRCalendar from "../../../components/common/HRCalendar";
import TodaySummary from "../../../components/common/TodaySummary";
import PendingActions from "../../../components/common/PendingActions";

/* ---------- APIS ---------- */
import {
  getTopStats,
  getTodaySummary,
  getDepartmentStats,
  getMonthlyAttendance,
  getMonthlySalary
} from "../../../services/api/dashboardApi";
import { getUpcomingEvents } from "../../../services/api/eventApi";

const Dashboard = () => {
  /* ---------- FILTER STATE ---------- */
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedCompany, setSelectedCompany] = useState(localStorage.getItem("company")); // set via company switch later
  useEffect(() => {
    const handleStorageChange = () => {
      setSelectedCompany(localStorage.getItem("company"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* ---------- DATA STATE ---------- */
  const [stats, setStats] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [todaySummaryData, setTodaySummaryData] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const loading = !stats;

  /* ======================================================
     LOAD DASHBOARD DATA (RE-RUNS ON COMPANY / MONTH CHANGE)
  ====================================================== */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const params = {
          company: selectedCompany,
          month: selectedMonth
        };

        const [
          topStats,   
          todaySummary,
          departments,
          monthlyAttendance,
          monthlySalary,
          upcomingEvents
        ] = await Promise.all([
          getTopStats(params),
          getTodaySummary(params),
          getDepartmentStats(),
          getMonthlyAttendance(params),
          getMonthlySalary(params),
          getUpcomingEvents()
        ]);

        setStats(topStats);
        setTodaySummaryData(todaySummary);
        setDepartmentData(departments);
        setAttendanceData(monthlyAttendance);
        setSalaryData(monthlySalary);
        setCalendarEvents(upcomingEvents);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      }
    };

    loadDashboard();
  }, [selectedMonth, selectedCompany]);

  const navigate = useNavigate();

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div className="space-y-6">
      {/* HEADER + MONTH SELECTOR */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="border p-2 rounded text-sm"
        />
      </div>

      {/* TOP CARDS */}
      <DashboardTopCards data={stats} loading={loading} />
  
      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Attendance Overview</h2>
          <AttendanceChart data={attendanceData} />
        </div>
        

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Salary Overview</h2>
          <SalaryChart data={salaryData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-4">Departments</h2>
            <DepartmentChart data={departmentData} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Calendar</h2>
              <button
                onClick={() => navigate("/admin/calendar")}
                className="text-sm text-blue-600 hover:underline"
              >
                View Calendar →
              </button>
            </div>

            <HRCalendar events={calendarEvents} />
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodaySummary data={todaySummaryData} loading={loading} />
          <PendingActions
            data={{
              pendingLeaves: 0,
              pendingSalaries: stats?.salaryStatus?.pending || 0
            }}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
