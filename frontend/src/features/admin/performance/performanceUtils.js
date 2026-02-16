// Converts attendance percentage into a raw score (0–100)
export const calculateAttendanceRawScore = (attendancePercentage) => {
  return Math.max(0, Math.min(attendancePercentage, 100));
};

// Converts late marks into a penalty (0–20)
export const calculateLatePenalty = (lateMarks) => {
  if (!lateMarks || lateMarks <= 0) return 0;
  return Math.min(lateMarks * 5, 20);
};

// Main performance calculation (REALISTIC MODEL)
export const calculateOverallScore = ({
  attendancePercentage,
  behaviorScore, // 1–5
  outputScore,   // 1–5
  lateMarks
}) => {
  const attendanceRaw = calculateAttendanceRawScore(attendancePercentage);
  const behaviorRaw = (behaviorScore / 5) * 100;
  const outputRaw = (outputScore / 5) * 100;
  const latePenalty = calculateLatePenalty(lateMarks);

  // Base weighted score
  let rawScore =
    attendanceRaw * 0.5 +
    behaviorRaw * 0.25 +
    outputRaw * 0.25 -
    latePenalty;

  // Attendance-based hard caps (VERY IMPORTANT)
  if (attendancePercentage < 60) {
    rawScore = Math.min(rawScore, 60);
  } else if (attendancePercentage < 70) {
    rawScore = Math.min(rawScore, 70);
  }

  // Clamp to 0–100
  rawScore = Math.max(0, Math.min(rawScore, 100));

  // Convert to 5-point scale
  return Number(((rawScore / 100) * 5).toFixed(2));
};

// Performance label for UI / reports
export const getPerformanceLabel = (score) => {
  if (score >= 4.5) return "Outstanding";
  if (score >= 4.0) return "Very Strong";
  if (score >= 3.5) return "Good";
  if (score >= 3.0) return "Average";
  return "Needs Improvement";
};
