import {
  fetchTopStats,
  fetchTodayAttendance,
  fetchDepartmentStats,
  fetchMonthlyAttendance,
  fetchMonthlySalary
} from "./dashboard.service.js";

export const getTopStats = async (req, res) => {
  const { company, month } = req.query;
  res.json(await fetchTopStats(company, month));
};

export const getTodayAttendance = async (req, res) => {
  const { company, month } = req.query;
  res.json(await fetchTodayAttendance(company, month));
};

export const getDepartmentStats = async (req, res) => {
  const { company } = req.query;
  res.json(await fetchDepartmentStats(company));
};

export const getMonthlyAttendance = async (req, res) => {
  const { company, month } = req.query;
  res.json(await fetchMonthlyAttendance(company, month));
};

export const getMonthlySalary = async (req, res) => {
  const { company, month } = req.query;
  res.json(await fetchMonthlySalary(company, month));
};
