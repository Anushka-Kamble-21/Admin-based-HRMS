import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    employeeName: {
      type: String,
      required: true
    },

    company: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    startDate: {
      type: String, // YYYY-MM-DD
      required: true
    },

    endDate: {
      type: String,
      required: true
    },

    totalDays: {
      type: Number,
      required: true,
      min: 1
    },

    paidDays: {
      type: Number,
      required: true,
      min: 0
    },

    unpaidDays: {
      type: Number,
      required: true,
      min: 0
    },

    sandwichDays: {
      type: Number,
      default: 0,
      min: 0
    },

    leaveType: {
      type: String,
      enum: ["Sick", "Casual", "Earned", "WFH", "CompOff", "Other"],
      default: "Other"
    },

    reason: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["Active", "Reverted"],
      default: "Active"
    },

    revertReason: {
      type: String,
      default: null
    },

    createdBy: {
      type: String,
      default: "Admin"
    },

    lastModifiedBy: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

/* ✅ STRONG VALIDATION (Payroll-safe) */
leaveSchema.pre("validate", function () {
  const total = Number(this.totalDays || 0);
  const paid = Number(this.paidDays || 0);
  const unpaid = Number(this.unpaidDays || 0);
  const sandwich = Number(this.sandwichDays || 0);

  if (paid + unpaid + sandwich !== total) {
    throw new Error("paidDays + unpaidDays + sandwich days must equal totalDays");
  }

  /*if (sandwich > unpaid) {
    throw new Error("sandwichDays cannot exceed unpaidDays");
  }*/
});

export default mongoose.model("Leave", leaveSchema);
