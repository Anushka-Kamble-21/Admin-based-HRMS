import axios from "../axios";

export const getLeaves = async () => {
  const res = await axios.get("/leaves");
  return res.data;
};

export const createLeave = async (leave) => {
  try {
    const res = await axios.post("/leaves", leave);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to create leave"
    );
  }
};

export const updateLeave = async (id, leave) => {
  const res = await axios.put(`/leaves/${id}`, leave);
  return res.data;
};

export const revertLeave = async (id, reason) => {
  const res = await axios.patch(
    `/leaves/${id}/revert`,
    { reason }
  );
  return res.data;
};
