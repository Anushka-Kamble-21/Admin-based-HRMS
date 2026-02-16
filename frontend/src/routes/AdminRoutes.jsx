import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AdminLayout from "../components/layout/AdminLayout";

import Dashboard from "../features/admin/dashboard/Dashboard";
import Attendance from "../features/admin/attendance/Attendance";
import EmployeeManagement from "../features/admin/employeeManagement/EmployeeManagement";
import LeaveManagement from "../features/admin/leaveManagement/LeaveManagement";
import Payroll from "../features/admin/payroll/Payroll";
import PerformancePage from "../features/admin/performance/PerformancePage";
import Profile from "../features/admin/profile/Profile";
import EmployeeProfile from "../features/admin/employeeManagement/EmployeeProfile";
import Login from "../features/admin/auth/Login";
import AdminCalendar from "../features/admin/calendar/AdminCalendar";

const AdminRoutes = () => {
  const { token } = useAuth(); //reactive auth state

  return (
    <Routes>

      {/* PUBLIC */}
      <Route
        path="/login"
        element={
          token
            ? <Navigate to="/admin/dashboard" replace />
            : <Login />
        }
      />

      {/* PROTECTED */}
      <Route
        path="/admin"
        element={
          token
            ? <AdminLayout />
            : <Navigate to="/login" replace />
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="employees/:id" element={<EmployeeProfile />} />
        <Route path="leaves" element={<LeaveManagement />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="calendar" element={<AdminCalendar />} />
      </Route>

      {/* ROOT */}
      <Route
        path="/"
        element={
          token
            ? <Navigate to="/admin/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
