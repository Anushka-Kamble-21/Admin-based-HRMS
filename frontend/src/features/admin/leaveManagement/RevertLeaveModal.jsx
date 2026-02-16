import { useState } from "react";

const RevertLeaveModal = ({ leave, onConfirm, onClose }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert("Please provide a reason for reverting the leave.");
      return;
    }

    // ✅ Only send what backend expects
    onConfirm({
      _id: leave._id,
      revertReason: reason
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold text-red-600">
          Revert Leave
        </h2>

        <p className="text-sm text-gray-600">
          You are reverting leave for{" "}
          <strong>{leave.employeeName}</strong>{" "}
          ({leave.startDate} → {leave.endDate})
        </p>

        <div>
          <label className="block text-sm mb-1">
            Revert Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="border p-2 rounded w-full"
            placeholder="Enter reason for reverting this leave"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Confirm Revert
          </button>
        </div>
      </form>
    </div>
  );
};

export default RevertLeaveModal;
