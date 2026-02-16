const StatCard = ({ title, value, subtitle, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm animate-pulse h-24" />
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold">{value}</h2>
      {subtitle && (
        <p className="text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
