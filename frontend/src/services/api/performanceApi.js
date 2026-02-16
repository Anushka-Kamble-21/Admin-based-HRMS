import axios from "../axios";

export const savePerformance = (data) => {
  return axios.post("/performance", data);
};

export const getPerformanceByMonth = (month) => {
  return axios.get(`/performance?month=${month}`);
};
