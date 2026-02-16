import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const SalaryChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No salary data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="paid" fill="#2563eb" />
        <Bar dataKey="pending" fill="#f97316" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalaryChart;
