import Employee from "./employee.model.js";

export const createEmployee = (data) => {
  return Employee.create(data);
};

export const getAllEmployees = (company) => {
  const filter = company ? { company } : {};
  return Employee.find(filter).sort({ createdAt: -1 });
};

export const getEmployeeById = (id) => {
  return Employee.findById(id);
};

export const updateEmployee = (id, data) => {
  return Employee.findByIdAndUpdate(id, data, { new: true });
};

export const updateEmployeeStatus = (id, status, resignDate) => {
  return Employee.findByIdAndUpdate(
    id,
    { status, resignDate },
    { new: true }
  );
};

/*for dynamic company filter in Topbar
export const getCompanies = async () => {
  const companies = await Employee.distinct("company");
  const legacy = await Employee.distinct("department");

  return [...new Set([...companies, ...legacy])].filter(Boolean);
};
*/

export const getCompanies = async () => {
  return Employee.distinct("company");
};
