import axios from "../axios";

export const loginAdmin = async (data) => {
  const res = await axios.post("/auth/login", data);
  return res.data;
};
