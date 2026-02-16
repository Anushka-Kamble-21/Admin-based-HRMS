import { useEffect, useState } from "react";
import { getEmployees } from "../../../services/api/employeeApi";

const LeaveFilters = ({ filters, setFilters }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await getEmployees(); // company already auto-attached via axios
        const unique = [...new Set(data.map(e => e.department))];
        setDepartments(unique);
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    };

    loadDepartments();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-4">

      <select
        className="border p-2"
        value={filters.department}
        onChange={(e) =>
          setFilters({ ...filters, department: e.target.value })
        }
      >
        <option value="">All Departments</option>
        {departments.map(dep => (
          <option key={dep} value={dep}>{dep}</option>
        ))}
      </select>

      <input
        type="month"
        className="border p-2"
        value={filters.month}
        onChange={(e) =>
          setFilters({ ...filters, month: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Search employee name..."
        className="border p-2"
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

    </div>
  );
};

export default LeaveFilters;
