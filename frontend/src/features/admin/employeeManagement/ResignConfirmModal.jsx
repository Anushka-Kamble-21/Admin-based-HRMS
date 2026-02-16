import { useState } from "react";

const ResignConfirmModal = ({ employee, onCancel, onConfirm }) => {
  const [resignDate, setResignDate] = useState("");
  const [remark, setRemark] = useState("");

  const handleConfirm = () => {
    if (!resignDate) {
      alert("Please select resignation date");
      return;
    }

    onConfirm({
      status: "Resigned",
      resignDate,
      remark
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Confirm Resignation
        </h2>

        <p className="text-sm mb-4">
          You are marking <b>{employee.name}</b> as resigned.
          This action should only be done after confirmation.
        </p>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block mb-1">Resignation Date</label>
            <input
              type="date"
              value={resignDate}
              onChange={(e) => setResignDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Remark (optional)</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Reason / notes"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Confirm Resignation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResignConfirmModal;
