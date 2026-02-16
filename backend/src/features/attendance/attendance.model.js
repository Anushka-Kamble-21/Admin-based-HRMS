import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    date: {
      type: String,
      required: true
    },
    loginTime: {
      type: String,
      default: null
    },
    logoutTime: {
      type: String,
      default: null
    },
    attendanceStatus: {
      type: String,
      enum: ["Present", "Half Day", "Absent", "WFH", "On Leave"],
      required: true
    },
    punctuality: {
      type: String,
      enum: ["On Time", "Late", ""],
      default: ""
    }
  },
  { timestamps: true }
);

attendanceSchema.index(
  { employeeId: 1, date: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", attendanceSchema);
