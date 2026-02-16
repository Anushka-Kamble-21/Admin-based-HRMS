import { useState, useEffect } from "react";
import { getEmployees, addEmployee } from "../../../services/api/employeeApi";
import AddEmployeeModal from "./AddEmployeeModal";
import { useNavigate } from "react-router-dom";
import { getCompanies } from "../../../services/api/employeeApi";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [hideResigned, setHideResigned] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const navigate = useNavigate();

  const departmentOptions = [
    ...new Set(employees.map(emp => emp.department).filter(Boolean))
  ];

  const statusOptions = [
    ...new Set(employees.map(emp => emp.status).filter(Boolean))
  ];

  const filteredEmployees = employees.filter((emp) => {
    // Hide resigned employees toggle
    if (hideResigned && emp.status === "Resigned") {
      return false;
    }

    const matchesDepartment =
      !departmentFilter || emp.department === departmentFilter;

    const matchesStatus =
      !statusFilter || emp.status === statusFilter;

    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const handleAddEmployee = async (newEmployee) => {
    try {
      const saved = await addEmployee(newEmployee);
      setEmployees((prev) => [...prev, saved]);

      // refresh company filters instantly
      const companies = await getCompanies();
      if (companies.length > 0) {
        localStorage.setItem("company", companies[0]);
      }

    } catch {
      alert("Failed to add employee");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Employee Management</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Search by name, department or role..."
            className="border p-2 rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departmentOptions.map(dep => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hideResigned}
              onChange={(e) => setHideResigned(e.target.checked)}
              className="accent-black"
            />
            <span className="text-sm text-gray-700">
              Hide resigned employees
            </span>
          </div>

        </div>

        <button className="bg-black text-white px-4 py-2 rounded" onClick={() => setShowAddModal(true)}>
          + Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-center">Department</th>
              <th className="p-3 text-center">Designation</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading employees...
                </td>
              </tr>
            )}

            {!loading && filteredEmployees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="p-3">{emp.name}</td>
                <td className="p-3 text-center">{emp.department}</td>
                <td className="p-3 text-center">{emp.designation}</td>
                <td className="p-3 text-center">{emp.status}</td>
                <td className="p-3 text-center">
                  <button
                    className="text-blue-600"
                    onClick={() =>
                      navigate(`/admin/employees/${emp._id}`, {
                        state: { employee: emp }
                      })
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;


