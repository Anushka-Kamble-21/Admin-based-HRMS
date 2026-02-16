import {
  getAllLeaves,
  createLeave,
  updateLeave,
  revertLeave
} from "./leave.service.js";

export const getLeaves = async (req, res) => {
  try {
    const { company } = req.query;

    const leaves = await getAllLeaves(company);
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addLeave = async (req, res) => {
  try {
    console.log("ADD LEAVE HIT");
    const leave = await createLeave(req.body);
    return res.status(201).json(leave);
  } catch (err) {
    console.error("ADD LEAVE ERROR:", err);
    return res.status(400).json({ message: err.message });
  }
};

export const editLeave = async (req, res) => {
  try {
    const updated = await updateLeave(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const revertLeaveById = async (req, res) => {
  try {
    const updated = await revertLeave(
      req.params.id,
      req.body.reason
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
