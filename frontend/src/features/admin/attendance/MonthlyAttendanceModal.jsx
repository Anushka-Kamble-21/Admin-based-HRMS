import { useEffect, useState } from "react";
import { getEmployeeMonthlyAttendance } from "../../../services/api/attendanceApi";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const MonthlyAttendanceModal = ({ employee, onClose }) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getEmployeeMonthlyAttendance(
        employee._id,
        month,
        year
      );
      setSummary(data);
    };
    load();
  }, [employee, month, year]);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold">
          {employee.name} – Attendance Summary
        </h2>

        <div className="flex gap-3">
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="border p-2 rounded w-24"
          />
        </div>

        {summary && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            {Object.entries(summary).map(([k, v]) => (
              <div
                key={k}
                className="bg-gray-100 p-3 rounded text-center"
              >
                <p className="text-gray-500">{k}</p>
                <p className="text-xl font-semibold">{v}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendanceModal;
