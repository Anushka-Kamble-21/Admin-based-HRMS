import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    periodFrom: {
      type: Date,
      required: true
    },
    periodTo: {
      type: Date,
      required: true
    },

    monthlySalary: Number,
    perDaySalary: Number,
    workingDays: Number,

    leaveSummary: {
      halfDays: Number,
      wfhDays: Number,
      paidLeaveDays: Number,
      unpaidLeaveDays: Number,
      sandwichDays: Number,
      totalLeaveDays: Number
    },

    attendanceSummary: {
      presentDays: Number,
      halfDays: Number,
      wfhDays: Number,
      unpaidLeaveDays: Number,
      sandwichDays: Number,
      lateMarks: Number
    },

    deductions: {
      halfDayAmount: Number,
      wfhAmount: Number,
      leaveAmount: Number,
      sandwichAmount: Number,
      lateMarkAmount: Number,
      totalDeduction: Number
    },
    earnedSalary: Number,
    netSalary: Number,

    calculationMode: {
      type: String,
      enum: ["AUTO", "MANUAL"],
      default: "AUTO"
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING"
    },

    paidAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);
