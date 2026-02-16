const LeaveTable = ({ leaves, onEdit, onRevert }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Employee</th>
            <th className="p-3">Dates</th>
            <th className="p-3">Days</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="border-t">
              <td className="p-3">
                {leave.employeeName}
              </td>

              <td className="p-3 text-center">
                {leave.startDate} → {leave.endDate}
              </td>

              <td className="p-3 text-center">
                {leave.totalDays}
              </td>

              <td className="p-3 text-center">
                Paid: {leave.paidDays} / {leave.totalDays}
              </td>

              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(leave)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRevert(leave)}
                  className="text-red-600"
                >
                  Revert
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
