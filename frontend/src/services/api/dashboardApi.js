import axios from "../axios";

/* ---------- TOP STATS ---------- */
export const getTopStats = ({ company, month }) =>
  axios
    .get("/dashboard/top-stats", {
      params: { company, month }
    })
    .then(r => r.data);

/* ---------- TODAY SUMMARY ---------- */
export const getTodaySummary = ({ company, month }) =>
  axios
    .get("/dashboard/today-attendance", {
      params: { company, month }
    })
    .then(r => r.data);

/* ---------- DEPARTMENTS ---------- */
export const getDepartmentStats = () =>
  axios.get("/dashboard/departments").then(r => r.data);

/* ---------- MONTHLY ATTENDANCE ---------- */
export const getMonthlyAttendance = ({ company, month }) =>
  axios
    .get("/dashboard/attendance-monthly", {
      params: { company, month }
    })
    .then(r => r.data);

/* ---------- MONTHLY SALARY ---------- */
export const getMonthlySalary = ({ company, month }) =>
  axios
    .get("/dashboard/salary-monthly", {
      params: { company, month }
    })
    .then(r => r.data);
