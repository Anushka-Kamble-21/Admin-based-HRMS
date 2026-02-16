const DashboardCard = ({
  title,
  value,
  subtitle,
  actionText,
  onAction,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-28" />
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold mt-1">{value}</h2>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>

      {actionText && (
        <button
          onClick={onAction}
          className="text-sm text-blue-600 mt-3 text-left"
        >
          {actionText} →
        </button>
      )}
    </div>
  );
};

export default DashboardCard;
