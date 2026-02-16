const PendingActions = ({ data = {}, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-40" />
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="font-semibold mb-4">Pending Actions</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Leave Requests</p>
            <p className="text-gray-500 text-xs">
              Pending approval
            </p>
          </div>
          <span className="text-lg font-semibold">
            {data.pendingLeaves}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Salary Processing</p>
            <p className="text-gray-500 text-xs">
              Pending salaries
            </p>
          </div>
          <span className="text-lg font-semibold">
            {data.pendingSalaries}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PendingActions;
