import api from "./api";

export const getDashboardStats = () =>
  api.get("/dashboard/stats");

export const getAttendanceOverview = () =>
  api.get("/dashboard/attendance-overview");

export const getWorkforceDistribution = () =>
  api.get("/dashboard/workforce");

export const getRecentActivities = () =>
  api.get("/dashboard/recent-activities");
