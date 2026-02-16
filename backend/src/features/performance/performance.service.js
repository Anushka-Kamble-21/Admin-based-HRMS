import Performance from "./performance.model.js";
import Employee from "../employees/employee.model.js";

export const createOrUpdatePerformance = async (data) => {
  return Performance.findOneAndUpdate(
    { employeeId: data.employeeId, month: data.month },
    data,
    { upsert: true, new: true }
  );
};

export const getPerformanceByMonth = async (month, company) => {
  if (!company) {
    return Performance.find({ month }).populate("employeeId", "name");
  }

  const employees = await Employee.find(
    { company },
    { _id: 1 }
  );

  const employeeIds = employees.map((e) => e._id);

  return Performance.find({
    month,
    employeeId: { $in: employeeIds }
  }).populate("employeeId", "name company department");
};

export const getEmployeePerformance = async (employeeId) => {
  return Performance.find({ employeeId }).sort({ month: -1 });
};
