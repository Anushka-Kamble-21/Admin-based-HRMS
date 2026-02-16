import mongoose from "mongoose";

const payrollRevisionSchema = new mongoose.Schema(
  {
    payrollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payroll",
      required: true
    },

    version: Number,

    reason: {
      type: String,
      required: true
    },

    previousData: Object,

    revisedData: Object,

    revisedBy: {
      type: String,
      default: "Admin"
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "PayrollRevision",
  payrollRevisionSchema
);
