const HRCalendar = ({ events = [] }) => {
  if (!events.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No upcoming events
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div
          key={index}
          className="flex items-start gap-3 border-b pb-3"
        >
          <div className="text-sm font-medium">
            {event.date}
          </div>
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-xs text-gray-500">
              {event.type}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HRCalendar;
