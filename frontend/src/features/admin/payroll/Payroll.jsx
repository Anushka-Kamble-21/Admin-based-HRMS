import { useEffect, useState } from "react";
import { getEmployees } from "../../../services/api/employeeApi";
import {
  calculatePayroll,
  savePayroll,
  getPayrolls,
  markPayrollPaid
} from "../../../services/api/payrollApi";
import SalaryCalculator from "./SalaryCalculator";
import PayslipModal from "./PayslipModal";

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toISOString().slice(0, 10);
};

const Payroll = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeQuery, setEmployeeQuery] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [snapshot, setSnapshot] = useState(null);
  const [payrolls, setPayrolls] = useState([]);
  const [viewPayroll, setViewPayroll] = useState(null);

  useEffect(() => {
    loadEmployees();
    loadPayrolls();
  }, []);

  const loadEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data.filter(e => e.status === "Active"));
  };

  const loadPayrolls = async () => {
    const data = await getPayrolls();
    setPayrolls(Array.isArray(data) ? data : []);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(employeeQuery.toLowerCase())
  );

  /* ---------- CALCULATE ---------- */
  const handleCalculate = async () => {
    if (!employeeId) {
      alert("Select employee");
      return;
    }

    const data = await calculatePayroll({
      employeeId,
      month
    });

    setSnapshot(data);
  };

  /* ---------- SAVE ---------- */
  const handleSave = async (finalPayroll) => {
    await savePayroll(finalPayroll);
    setSnapshot(null);
    loadPayrolls();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Payroll</h1>

      {/* CONTROLS */}
      <div className="bg-white p-4 rounded shadow grid grid-cols-4 gap-4">

        {/* EMPLOYEE SEARCH */}
        <div className="relative">
          <label className="text-sm block mb-1">
            Employee
          </label>

          <input
            type="text"
            value={employeeQuery}
            placeholder="Enter employee name..."
            onChange={(e) => {
              setEmployeeQuery(e.target.value);
              setEmployeeId("");
              setShowSuggestions(true);
            }}
            className="border p-2 rounded w-full"
          />

          {showSuggestions && employeeQuery && (
            <div className="absolute z-20 bg-white border w-full rounded shadow max-h-40 overflow-y-auto">
              {filteredEmployees.map(emp => (
                <div
                  key={emp._id}
                  onClick={() => {
                    setEmployeeQuery(emp.name);
                    setEmployeeId(emp._id);
                    setShowSuggestions(false);
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                >
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-xs text-gray-500">
                    {emp.department}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MONTH */}
        <div>
          <label className="text-sm block mb-1">
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleCalculate}
            className="bg-black text-white px-6 py-2 rounded"
          >
            Calculate
          </button>
        </div>
      </div>

      {/* SALARY CALCULATOR */}
      {snapshot && (
        <SalaryCalculator
          snapshot={snapshot}
          onSave={handleSave}
        />
      )}

      {/* PAYROLL HISTORY */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-center">Period</th>
              <th className="p-3 text-right">Net</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map(p => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {p.employeeId?.name || "-"}
                </td>

                <td className="p-3 text-center">
                  {formatDate(p.periodFrom)} → {formatDate(p.periodTo)}
                </td>

                <td className="p-3 text-right font-medium">
                  ₹{Number(p.netSalary).toFixed(2)}
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="p-3 text-center space-x-2">
                  {p.status === "PENDING" && (
                    <button
                      onClick={async () => {
                        await markPayrollPaid(p._id);
                        loadPayrolls();
                      }}
                      className="text-green-600 font-medium"
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => setViewPayroll(p)}
                    className="text-blue-600 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PayslipModal
        payroll={viewPayroll}
        onClose={() => setViewPayroll(null)}
      />
    </div>
  );
};

export default Payroll;
