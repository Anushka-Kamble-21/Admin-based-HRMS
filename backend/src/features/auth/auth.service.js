import bcrypt from "bcryptjs";
import Admin from "./auth.model.js";

export const createAdmin = async (data) => {
  const { name, email, password, phone, designation } = data;

  const existing = await Admin.findOne({ email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return Admin.create({
    name,
    email,
    password: hashedPassword,
    phone,
    designation
  });
};

export const findAdminByEmail = async (email) => {
  return Admin.findOne({ email });
};
