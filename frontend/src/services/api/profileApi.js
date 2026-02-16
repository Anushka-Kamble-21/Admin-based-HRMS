import axios from "../axios";

export const getProfile = async () => {
  const res = await axios.get("/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await axios.put("/profile", data);
  return res.data;
};
