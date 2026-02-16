import {
  getAdminProfile,
  updateAdminProfile
} from "./profile.service.js";

export const fetchProfile = async (req, res) => {
  try {
    const admin = await getAdminProfile(req.user.id);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const updated = await updateAdminProfile(
      req.user.id,
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
