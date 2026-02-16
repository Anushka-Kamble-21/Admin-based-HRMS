import axios from "../axios";

/* ---------- CREATE EVENT ---------- */
export const createEvent = async (data) => {
  const res = await axios.post("/events", data);
  return res.data;
};

/* ---------- GET ALL EVENTS (Calendar) ---------- */
export const getAllEvents = async () => {
  const res = await axios.get("/events");
  return res.data;
};

/* ---------- GET UPCOMING EVENTS (Dashboard / Profile) ---------- */
export const getUpcomingEvents = async (limit = 4) => {
  const res = await axios.get("/events/upcoming", {
    params: { limit }
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await axios.delete(`/events/${id}`);
  return res.data;
};
