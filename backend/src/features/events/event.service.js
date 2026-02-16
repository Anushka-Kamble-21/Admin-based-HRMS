import Event from "./event.model.js";

/* CREATE */
export const createEvent = async (data) => {
  return Event.create({
    title: data.title,
    description: data.description,
    eventDate: new Date(data.eventDate)
  });
};

/* GET ALL (Calendar view) */
export const getAllEvents = async () => {
  return Event.find().sort({ eventDate: 1 });
};

/* GET UPCOMING (Dashboard card) */
export const getUpcomingEvents = async (limit = 4) => {
  return Event.find({
    eventDate: { $gte: new Date() }
  })
    .sort({ eventDate: 1 })
    .limit(limit);
};

export const deleteEvent = async (id) => {
  return Event.findByIdAndDelete(id);
};
