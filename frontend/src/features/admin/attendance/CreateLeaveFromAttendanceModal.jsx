import { useState } from "react";

const CreateLeaveFromAttendanceModal = ({
  employee,
  startDate,
  onCreate,
  onClose
}) => {
  const [endDate, setEndDate] = useState(startDate);
  const [leaveType, setLeaveType] = useState("Sick");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    onCreate({
      employeeId: employee._id,
      employeeName: employee.name,
      leaveType,
      startDate,
      endDate,
      status: "Approved",
      reason,
      createdAt: new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">
          Create Leave – {employee.name}
        </h2>

        <div>
          <label className="block text-sm mb-1">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option>Sick</option>
            <option>Casual</option>
            <option>Earned</option>
            <option>WFH</option>
            <option>Unpaid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            disabled
            className="border p-2 rounded w-full bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Create Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaveFromAttendanceModal;