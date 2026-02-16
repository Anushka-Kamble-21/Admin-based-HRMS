const LeaveSummary = ({ leaves }) => {
  const totalLeaves = leaves.length;

  const totalPaidDays = leaves.reduce(
    (sum, l) => sum + l.paidDays,
    0
  );

  const totalUnpaidDays = leaves.reduce(
    (sum, l) => sum + l.unpaidDays,
    0
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-sm text-gray-500">Leaves</p>
        <p className="text-xl font-semibold">{totalLeaves}</p>
      </div>

      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-sm text-gray-500">Paid Days</p>
        <p className="text-xl font-semibold">{totalPaidDays}</p>
      </div>

      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-sm text-gray-500">Unpaid Days</p>
        <p className="text-xl font-semibold">{totalUnpaidDays}</p>
      </div>
    </div>
  );
};

export default LeaveSummary;
