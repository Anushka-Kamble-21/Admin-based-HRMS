import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  createEvent,
  getAllEvents,
  deleteEvent
} from "../../../services/api/eventApi";

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchEvents = async () => {
    const data = await getAllEvents();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!title) return;

    await createEvent({
      title,
      description,
      eventDate: selectedDate
    });

    setTitle("");
    setDescription("");
    fetchEvents();
  };

  const handleDeleteEvent = async (id) => {
    await deleteEvent(id);
    fetchEvents();
  };


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Admin Calendar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
        />

        {/* Add Event */}
        <div className="space-y-3">
          <h2 className="font-medium">
            Add Event – {selectedDate.toDateString()}
          </h2>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Event title"
            className="border p-2 w-full"
          />

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="border p-2 w-full"
            rows={3}
          />

          <button
            onClick={handleAddEvent}
            className="bg-black text-white px-4 py-2"
          >
            Add Event
          </button>
        </div>
      </div>

      {/* Event List */}
      <div>
        <h2 className="font-medium mb-2">All Events</h2>

        {events.length === 0 && (
          <p className="text-gray-500">No events added</p>
        )}

        <ul className="space-y-2">
          {events.map(e => (
            <li
              key={e._id}
              className="border p-2 rounded"
            >
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-500">
                {new Date(e.eventDate).toDateString()}
              </div>
              {e.description && (
                <div className="text-sm">{e.description}</div>
              )}
              <button
                onClick={() => handleDeleteEvent(e._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCalendar;
