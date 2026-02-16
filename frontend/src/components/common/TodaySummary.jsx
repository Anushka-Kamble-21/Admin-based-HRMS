const TodaySummary = ({ data = {}, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-40" />
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="font-semibold mb-4">Today’s Summary</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Present</p>
          <p className="text-xl font-semibold text-green-600">
            {data.present}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Absent</p>
          <p className="text-xl font-semibold text-red-600">
            {data.absent}
          </p>
        </div>

        <div>
          <p className="text-gray-500">On Leave</p>
          <p className="text-xl font-semibold text-yellow-600">
            {data.onLeave}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Late</p>
          <p className="text-xl font-semibold text-orange-600">
            {data.late}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodaySummary;
