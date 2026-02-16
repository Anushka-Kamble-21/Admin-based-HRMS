import Admin from "../auth/auth.model.js";

export const getAdminProfile = async (adminId) => {
  return Admin.findById(adminId).select("-password");
};

export const updateAdminProfile = async (adminId, data) => {
  const { name, email, phone, designation } = data;

  return Admin.findByIdAndUpdate(
    adminId,
    {
      name,
      email,
      phone,
      designation
    },
    { new: true }
  ).select("-password");
};
