import { useState } from "react";
import {
  calculateOverallScore,
  getPerformanceLabel
} from "./performanceUtils";
import { savePerformance } from "../../../services/api/performanceApi";

const PerformanceReviewModal = ({ employee, month, onClose }) => {
  const [behaviorScore, setBehaviorScore] = useState(3);
  const [outputScore, setOutputScore] = useState(3);
  const [remark, setRemark] = useState("");

  const overallScore = calculateOverallScore({
    attendancePercentage: employee.attendancePercentage || 0,
    behaviorScore,
    outputScore,
    lateMarks: employee.lateMarks || 0
  });

  const handleSave = async () => {
    try {
      await savePerformance({
        employeeId: employee._id,
        month,
        attendancePercentage: employee.attendancePercentage,
        lateMarks: employee.lateMarks,
        behaviorScore,
        outputScore,
        overallScore,
        label: getPerformanceLabel(overallScore),
        remark,
        reviewedBy: "admin"
      });

      onClose();
    } catch (err) {
      alert("Failed to save performance review");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded p-5 space-y-4">
        <h3 className="font-semibold">
          Performance Review – {employee.name}
        </h3>

        <div className="text-sm">
          Attendance: <b>{employee.attendancePercentage}%</b>
        </div>

        <div className="text-sm">
          Late Marks: <b>{employee.lateMarks}</b>
        </div>

        <div>
          <label className="text-sm">Behavior (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={behaviorScore}
            onChange={(e) => setBehaviorScore(+e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="text-sm">Company Output (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={outputScore}
            onChange={(e) => setOutputScore(+e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="text-sm">
          Overall Score: <b>{overallScore}</b>{" "}
          ({getPerformanceLabel(overallScore)})
        </div>

        <textarea
          placeholder="Admin remarks (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="w-full border rounded p-2 text-sm"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handleSave}
          >
            Save Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviewModal;
