import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile, updateProfile } from "../../../services/api/profileApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { getUpcomingEvents } from "../../../services/api/eventApi";
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfile();
      setProfile(data);
      setForm(data);
      setLoading(false);
    };
    const loadEvents = async () => {
      const data = await getUpcomingEvents();
      setEvents(data);
    };
    loadProfile();
    loadEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const updated = await updateProfile(form);
    setProfile(updated);
    setForm(updated);
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;

  const upcomingEvents = [...events]
    .filter(e => new Date(e.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 3);

  return (
    <div className="space-y-6">

      {/* ===== PROFILE HEADER ===== */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold">
            {profile.name?.[0]}
          </div>
          <div>
            <p className="text-lg font-semibold">{profile.name}</p>
            <p className="text-sm text-gray-300">
              {profile.designation || "Administrator"}
            </p>
            <p className="text-xs text-gray-400">{profile.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20"
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setForm(profile);
                setIsEditing(false);
              }}
              className="text-sm px-3 py-1 rounded bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-sm px-3 py-1 rounded bg-white text-black"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* ===== PERSONAL INFO CARD ===== */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-medium mb-4">Personal Information</h3>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <Field
            label="Full Name"
            value={profile.name}
            name="name"
            isEditing={isEditing}
            onChange={handleChange}
          />
          <Field
            label="Email"
            value={profile.email}
            name="email"
            isEditing={isEditing}
            onChange={handleChange}
          />
          <Field
            label="Phone"
            value={profile.phone || "-"}
            name="phone"
            isEditing={isEditing}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ===== JOB INFO CARD ===== */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-medium mb-4">Job Information</h3>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <Field
            label="Designation"
            value={profile.designation || "-"}
            name="designation"
            isEditing={isEditing}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ===== CALENDAR CARD ===== */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-medium mb-4">Important Dates</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileContent={({ date }) => {
              const hasEvent = events.some(
                e =>
                  new Date(e.eventDate).toDateString() ===
                  date.toDateString()
              );
              return hasEvent ? (
                <div className="w-1.5 h-1.5 bg-black rounded-full mx-auto mt-1" />
              ) : null;
            }}
          />

          {/* Upcoming Events */}
          <div>
            <h4 className="text-sm font-medium mb-2">Upcoming Events</h4>

            {upcomingEvents.length === 0 && (
              <p className="text-sm text-gray-500">
                No upcoming events
              </p>
            )}

            <ul className="space-y-2">
              {upcomingEvents.map(e => (
                <li
                  key={e._id}
                  className="border rounded p-2"
                >
                  <p className="text-sm font-medium">
                    {e.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(e.eventDate).toDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate("/admin/calendar")}
              className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Manage Calendar
            </button>
        </div>
      </div>

    </div>
  );
};

const Field = ({ label, value, name, isEditing, onChange }) => (
  <div>
    <p className="text-gray-500 mb-1">{label}</p>
    {isEditing ? (
      <input
        name={name}
        defaultValue={value}
        onChange={onChange}
        className="border rounded px-3 py-2 w-full bg-gray-50"
      />
    ) : (
      <p className="font-medium">{value}</p>
    )}
  </div>
);

export default Profile;
