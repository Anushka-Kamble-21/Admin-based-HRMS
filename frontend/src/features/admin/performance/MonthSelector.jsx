const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const MonthSelector = ({ selectedMonth, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">Month:</span>
      <select
        value={selectedMonth}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border rounded px-3 py-1 text-sm"
      >
        {months.map((month, index) => (
          <option key={month} value={index}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
