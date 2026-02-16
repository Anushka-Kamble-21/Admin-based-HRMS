import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  getCompanies
} from "./employee.service.js";
import Employee from "./employee.model.js";

export const addEmployee = async (req, res) => {
  try {
    const employee = await createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchEmployees = async (req, res) => {
  try {
    const { company } = req.query;
    const employees = await getAllEmployees(company);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchEmployeeById = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editEmployee = async (req, res) => {
  try {
    const updated = await updateEmployee(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeEmployeeStatus = async (req, res) => {
  try {
    const { status, resignDate } = req.body;
    const updated = await updateEmployeeStatus(
      req.params.id,
      status,
      resignDate
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchEmployees = async (req, res) => {
  try {
    const { q, company } = req.query;

    if (!q) {
      return res.json([]);
    }

    const filter = {
      status: "Active",
      name: { $regex: q, $options: "i" }
    };

    if (company) {
      filter.company = company;   //FIXED
    }

    const employees = await Employee.find(filter).limit(10);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// dynamic companies list for Topbar
export const fetchCompanies = async (req, res) => {
  try {
    const companies = await getCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
