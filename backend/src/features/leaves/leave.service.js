import mongoose from "mongoose";
import Leave from "./leave.model.js";
import Employee from "../employees/employee.model.js";

export const getAllLeaves = async (company) => {
  const filter = company ? { company, status: "Active" } : { status: "Active" };
  return Leave.find(filter).populate("employeeId");
};


/* ➕ CREATE */
export const createLeave = async (data) => {
  const {
    employeeId,
    totalDays,
    paidDays,
    unpaidDays,
    sandwichDays = 0
  } = data;

  if (Number(paidDays) + Number(unpaidDays)  + Number(sandwichDays) !== Number(totalDays)) {
    throw new Error("paidDays + unpaidDays + sandwichDays must equal totalDays");
  }

  /*if (Number(sandwichDays) > Number(unpaidDays)) {
    throw new Error("sandwichDays cannot exceed unpaidDays");
  }*/

  const employee = await Employee.findById(employeeId);

  return Leave.create({
    ...data,
    employeeId: new mongoose.Types.ObjectId(employeeId),
    company: employee.company,
    department: employee.department
  });

};

/* ✏️ UPDATE */
export const updateLeave = async (id, data) => {
  if (data.employeeId) {
    data.employeeId = new mongoose.Types.ObjectId(data.employeeId);
  }

  const paid = Number(data.paidDays);
  const unpaid = Number(data.unpaidDays);
  const total = Number(data.totalDays);
  const sandwich = Number(data.sandwichDays || 0);

  if (
    !Number.isNaN(paid) &&
    !Number.isNaN(unpaid) &&
    !Number.isNaN(total)
  ) {
    if (paid + unpaid + sandwich !== total) {
      throw new Error("paidDays + unpaidDays + sandwich must equal totalDays");
    }
  }

  /*if (!Number.isNaN(sandwich) && sandwich > unpaid) {
    throw new Error("sandwichDays cannot exceed unpaidDays");
  }*/

  return Leave.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

/* 🔄 REVERT */
export const revertLeave = async (id, revertReason) => {
  return Leave.findByIdAndUpdate(
    id,
    {
      status: "Reverted",
      revertReason,
      lastModifiedBy: "Admin"
    },
    { new: true }
  );
};
