const PayslipModal = ({ payroll, onClose }) => {
  if (!payroll) return null;

  const {
    periodFrom,
    periodTo,
    monthlySalary,
    earnedSalary,
    netSalary,
    attendanceSummary = {},
    deductions = {}
  } = payroll;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded p-6 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Payslip</h2>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>

        {/* Period & Salary */}
        <div className="text-sm space-y-1">
          <div>
            <strong>Period:</strong>{" "}
            {periodFrom || "-"} → {periodTo || "-"}
          </div>
          <div>
            <strong>Monthly Salary:</strong> ₹{monthlySalary ?? 0}
          </div>
          <div>
            <strong>Earned Salary:</strong> ₹{earnedSalary ?? monthlySalary ?? 0}
          </div>
        </div>

        {/* Attendance Summary */}
        <div>
          <h3 className="font-semibold text-sm mb-2">Attendance Summary</h3>
          {Object.keys(attendanceSummary).length === 0 ? (
            <div className="text-sm text-gray-500">
              No attendance data available
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(attendanceSummary).map(([key, value]) => (
                <div key={key}>
                  {key}: <strong>{value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deductions */}
        <div>
          <h3 className="font-semibold text-sm mb-2">Deductions</h3>
          {Object.keys(deductions).length === 0 ? (
            <div className="text-sm text-gray-500">
              No deductions applied
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              {Object.entries(deductions).map(([key, value]) => (
                <div key={key}>
                  {key}: ₹{value}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Net Salary */}
        <div className="text-lg font-semibold border-t pt-3">
          Net Salary: ₹{netSalary ?? 0}
        </div>
      </div>
    </div>
  );
};

export default PayslipModal;
