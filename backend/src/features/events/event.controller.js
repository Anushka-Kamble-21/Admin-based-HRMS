import {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  deleteEvent
} from "./event.service.js";

export const createEventController = async (req, res) => {
  try {
    const event = await createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllEventsController = async (req, res) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUpcomingEventsController = async (req, res) => {
  try {
    const events = await getUpcomingEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEventController = async (req, res) => {
  try {
    await deleteEvent(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};