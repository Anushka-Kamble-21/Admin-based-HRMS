import { useEffect, useState } from "react";

const EditLeaveModal = ({ leave, onSave, onClose }) => {
  const [leaveType, setLeaveType] = useState(leave.leaveType);
  const [startDate, setStartDate] = useState(leave.startDate);
  const [endDate, setEndDate] = useState(leave.endDate);
  const [reason, setReason] = useState(leave.reason || "");

  const [totalDays, setTotalDays] = useState(leave.totalDays);
  const [paidDays, setPaidDays] = useState(leave.paidDays);
  const [unpaidDays, setUnpaidDays] = useState(leave.unpaidDays);
  const [sandwichDays, setSandwichDays] = useState(
    leave.sandwichDays || 0
  );

  /* 🔁 Recalculate total days when dates change */
  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) return;

    const diff =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setTotalDays(diff);

    // keep numbers consistent
    const remaining =
      diff - paidDays - sandwichDays;

    setUnpaidDays(remaining >= 0 ? remaining : 0);
  }, [startDate, endDate]);

  /* 🎯 Paid Days Change */
  const handlePaidDaysChange = (value) => {
    const paid = Number(value);
    if (paid < 0) return;

    const remaining =
      totalDays - paid - sandwichDays;

    if (remaining < 0) return;

    setPaidDays(paid);
    setUnpaidDays(remaining);
  };

  /* 🥪 Sandwich Days Change */
  const handleSandwichChange = (value) => {
    const sandwich = Number(value);
    if (sandwich < 0) return;

    const remaining =
      totalDays - paidDays - sandwich;

    if (remaining < 0) return;

    setSandwichDays(sandwich);
    setUnpaidDays(remaining);
  };

  /* 💾 Submit */
  const handleSubmit = () => {
    if (paidDays + unpaidDays + sandwichDays !== totalDays) {
      alert(
        "Paid + Unpaid + sandwich days must equal Total days"
      );
      return;
    }

    onSave({
      ...leave,
      leaveType,
      startDate,
      endDate,
      totalDays,
      paidDays,
      unpaidDays,
      sandwichDays,
      reason: reason || "",
      lastModifiedBy: "Admin"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">
          Edit Leave
        </h2>

        {/* Leave Type */}
        <div>
          <label className="block text-sm">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option>Sick</option>
            <option>Casual</option>
            <option>Earned</option>
            <option>WFH</option>
            <option>CompOff</option>
            <option>Other</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Days Breakdown */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Total Days</strong>
            <div>{totalDays}</div>
          </div>

          <div>
            <label>Paid Days</label>
            <input
              type="number"
              min="0"
              value={paidDays}
              onChange={(e) =>
                handlePaidDaysChange(e.target.value)
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label>Sandwich Days</label>
            <input
              type="number"
              min="0"
              value={sandwichDays}
              onChange={(e) =>
                handleSandwichChange(e.target.value)
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <strong>Unpaid Days</strong>
            <div className="mt-2">{unpaidDays}</div>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLeaveModal;
