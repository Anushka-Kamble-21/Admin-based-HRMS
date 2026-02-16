import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    month: {
      type: Number, // 0-11
      required: true
    },

    attendancePercentage: Number,
    attendanceScore: Number,
    lateMarks: Number,

    behaviorScore: Number,
    outputScore: Number,

    overallScore: Number,
    label: String,
    remark: String,

    reviewedBy: String
  },
  { timestamps: true }
);

performanceSchema.index(
  { employeeId: 1, month: 1 },
  { unique: true }
);

export default mongoose.model("Performance", performanceSchema);
