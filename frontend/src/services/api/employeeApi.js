import axios from "../axios";

export const getEmployees = async (company) => {
  const res = await axios.get("/employees", {
    params: company ? { company } : {}
  });
  return res.data;
};

export const getEmployeeById = async (id) => {
  const res = await axios.get(`/employees/${id}`);
  return res.data;
};

export const addEmployee = async (data) => {
  const res = await axios.post("/employees", data);
  return res.data;
};

export const updateEmployee = async (id, data) => {
  const res = await axios.put(`/employees/${id}`, data);
  return res.data;
};

export const updateEmployeeStatus = async (id, status, resignDate) => {
  const res = await axios.patch(`/employees/${id}/status`, {
    status,
    resignDate
  });
  return res.data;
};

export const getCompanies = async () => {
  const res = await axios.get("/employees/companies/list");
  return res.data;
};
