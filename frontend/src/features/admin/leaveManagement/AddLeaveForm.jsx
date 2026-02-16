import { useEffect, useState } from "react";

const LEAVE_TYPES = [
  "Sick",
  "Casual",
  "Earned",
  "Unpaid",
  "WFH",
  "CompOff"
];

const AddLeaveForm = ({ employees, onAddLeave, onClose }) => {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [leaveType, setLeaveType] = useState("Sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [totalDays, setTotalDays] = useState(0);
  const [paidDays, setPaidDays] = useState(0);
  const [unpaidDays, setUnpaidDays] = useState(0);
  const [sandwichDays, setSandwichDays] = useState(0);

  /* 🔍 Employee search */
  const filteredEmployees = employees.filter((emp) =>
    (emp.name || emp.employeeName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* 📅 Calculate total days */
  useEffect(() => {
    if (!startDate || !endDate) {
      setTotalDays(0);
      setPaidDays(0);
      setUnpaidDays(0);
      setSandwichDays(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return;

    const diff =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setTotalDays(diff);
    setPaidDays(diff);
    setUnpaidDays(0);
    setSandwichDays(0);
  }, [startDate, endDate]);

  /* ➕ Submit */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedEmployee || !startDate || !endDate) {
      alert("Please select employee and dates");
      return;
    }

    if (paidDays + unpaidDays + sandwichDays !== totalDays) {
      alert(
        "Paid + Unpaid + sandwich days must equal Total days"
      );
      return;
    }

    const leavePayload = {
      employeeId: selectedEmployee._id,
      employeeName:
        selectedEmployee.name ||
        selectedEmployee.employeeName,
      department: selectedEmployee.department,

      leaveType,
      startDate,
      endDate,

      totalDays,
      paidDays,
      unpaidDays,
      sandwichDays,

      status: "Active",
      reason: reason || null,
      createdBy: "Admin"
    };

    onAddLeave(leavePayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 space-y-5"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Add Leave
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* EMPLOYEE SEARCH */}
        <div className="relative">
          <label className="text-sm font-medium">
            Employee
          </label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedEmployee(null);
            }}
            placeholder="Search employee"
            className="border rounded-lg p-2 w-full"
          />

          {search && !selectedEmployee && (
            <div className="absolute bg-white border w-full rounded-lg shadow mt-1 max-h-40 overflow-y-auto z-20">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp._id}
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setSearch(
                      emp.name || emp.employeeName
                    );
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium">
                    {emp.name || emp.employeeName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {emp.department} · {emp.designation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TYPE + DATES */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">
              Leave Type
            </label>
            <select
              value={leaveType}
              onChange={(e) =>
                setLeaveType(e.target.value)
              }
              className="border rounded-lg p-2 w-full"
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="border rounded-lg p-2 w-full"
            />
          </div>
        </div>

        {/* DAY BREAKDOWN */}
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-gray-500">Total</p>
            <p className="text-lg font-semibold">
              {totalDays}
            </p>
          </div>

          <div>
            <label>Paid Days</label>
            <input
              type="number"
              min="0"
              max={totalDays}
              value={paidDays}
              onChange={(e) =>
                setPaidDays(Number(e.target.value))
              }
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label>Unpaid Days</label>
            <input
              type="number"
              min="0"
              max={totalDays}
              value={unpaidDays}
              onChange={(e) =>
                setUnpaidDays(Number(e.target.value))
              }
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label>Sandwich Days</label>
            <input
              type="number"
              min="0"
              max={totalDays}
              value={sandwichDays}
              onChange={(e) =>
                setSandwichDays(Number(e.target.value))
              }
              className="border rounded-lg p-2 w-full"
            />
          </div>
        </div>

        {/* REASON */}
        <div>
          <label className="text-sm font-medium">
            Reason (optional)
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            className="border rounded-lg p-2 w-full"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-black text-white rounded-lg"
          >
            Add Leave
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLeaveForm;
