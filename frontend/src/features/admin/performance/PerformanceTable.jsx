import { useState } from "react";
import PerformanceReviewModal from "./PerformanceReviewModal";

const PerformanceTable = ({
  employees,
  attendanceData,
  selectedMonth
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div className="bg-white rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-center">Attendance %</th>
            <th className="p-3 text-center">Leaves</th>
            <th className="p-3 text-center">Late Marks</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => {
            const stats =
              attendanceData.find(
                (a) => a.employeeId === emp._id
              ) || {
                attendancePercentage: 0,
                leaves: 0,
                lateMarks: 0
              };

            return (
              <tr key={emp._id} className="border-t">
                <td className="p-3">{emp.name}</td>

                <td className="p-3 text-center">
                  {stats.attendancePercentage}%
                </td>

                <td className="p-3 text-center">
                  {stats.leaves}
                </td>

                <td className="p-3 text-center">
                  {stats.lateMarks}
                </td>

                <td className="p-3 text-center">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() =>
                      setSelectedEmployee({
                        ...emp,
                        ...stats
                      })
                    }
                  >
                    View Performance
                  </button>
                </td>
              </tr>
            );
          })}

          {employees.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="p-4 text-center text-gray-500"
              >
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedEmployee && (
        <PerformanceReviewModal
          employee={selectedEmployee}
          month={selectedMonth}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default PerformanceTable;
