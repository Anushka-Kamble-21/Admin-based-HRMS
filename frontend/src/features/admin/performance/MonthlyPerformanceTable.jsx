const MonthlyPerformanceTable = ({ performances }) => {
  if (!performances.length) {
    return (
      <div className="bg-white p-4 rounded shadow text-sm text-gray-500">
        No performance reviews found for this month
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow">
      <h2 className="font-medium p-4 border-b">
        Monthly Performance Summary
      </h2>

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-center">Attendance %</th>
            <th className="p-3 text-center">Late</th>
            <th className="p-3 text-center">Score</th>
            <th className="p-3 text-center">Label</th>
            <th className="p-3 text-left">Remark</th>
          </tr>
        </thead>

        <tbody>
          {performances.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-3">
                {p.employeeId?.name || "—"}
              </td>
              <td className="p-3 text-center">
                {p.attendancePercentage}%
              </td>
              <td className="p-3 text-center">
                {p.lateMarks}
              </td>
              <td className="p-3 text-center">
                {p.overallScore}
              </td>
              <td className="p-3 text-center">
                {p.label}
              </td>
              <td className="p-3">
                {p.remark || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyPerformanceTable;
