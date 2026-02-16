import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema(
  {
    bankName: String,
    branch: String,
    accountNumber: String,
    ifsc: String
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    dateOfJoining: { type: String },
    salary: { type: Number },
    status: {
      type: String,
      enum: ["Active", "Resigned"],
      default: "Active"
    },
    resignDate: { type: String },
    bankDetails: bankDetailsSchema
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
