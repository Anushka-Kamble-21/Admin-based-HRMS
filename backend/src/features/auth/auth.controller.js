import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  createAdmin,
  findAdminByEmail
} from "./auth.service.js";

export const registerAdmin = async (req, res) => {
  try {
    await createAdmin(req.body);
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        designation: admin.designation
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
