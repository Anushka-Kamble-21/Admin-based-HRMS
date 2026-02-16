import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const AttendanceChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No attendance data
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
        <Bar dataKey="present" fill="#16a34a" />
        <Bar dataKey="absent" fill="#dc2626" />
        <Bar dataKey="onLeave" fill="#eab308" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
