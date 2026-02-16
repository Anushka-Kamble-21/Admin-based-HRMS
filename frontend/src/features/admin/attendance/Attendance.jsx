import CreateLeaveFromAttendanceModal from "./CreateLeaveFromAttendanceModal";
import MonthlyAttendanceModal from "./MonthlyAttendanceModal";
import { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../../../services/api/employeeApi";
import {
  getAttendanceByDate,
  saveAttendanceBulk
} from "../../../services/api/attendanceApi";
import { getLeaves } from "../../../services/api/leaveApi";

const today = new Date().toISOString().split("T")[0];

const Attendance = () => {
  const [attendanceLocked, setAttendanceLocked] = useState(false);

  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [leaveModalEmployee, setLeaveModalEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  const [allowPastEdit, setAllowPastEdit] = useState(false);
  const [showPastEditModal, setShowPastEditModal] = useState(false);

  const isPastDate = date < today;
  const canSave = !isPastDate || (isPastDate && allowPastEdit);

  const isEligibleForDate = (emp) => {
    if (!emp.dateOfJoining) return true;
    return emp.dateOfJoining <= date;
  };

  /* Load employees */
  useEffect(() => {
    const loadEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data.filter(e => e.status === "Active"));
    };
    loadEmployees();
  }, []);

  /* Load leaves */
  useEffect(() => {
    const loadLeaves = async () => {
      const data = await getLeaves();
      setLeaves(data.filter(l => l.status === "Approved"));
    };
    loadLeaves();
  }, []);

  /* Build attendance rows */
  useEffect(() => {
    if (!employees.length || (date === today && records.length > 0 && !attendanceLocked)) return;


    const loadAttendance = async () => {
      const attendanceData = await getAttendanceByDate(date);
      if (attendanceData.length > 0 && date === today) {
        setAttendanceLocked(true);
      } else {
        setAttendanceLocked(false);
      }

      const rows = employees
        .filter(emp => isEligibleForDate(emp))
        .map(emp => {
          const existing = attendanceData.find(
            rec =>
              String(rec.employeeId?._id || rec.employeeId) ===
              String(emp._id)
          );

          if (existing) {
            return {
              ...existing,
              employeeName: emp.name,
              department: emp.department
            };
          }

          const leave = leaves.find(
            l =>
              String(l.employeeId) === String(emp._id) &&
              l.startDate <= date &&
              l.endDate >= date
          );

          if (leave) {
            return {
              employeeId: emp._id,
              employeeName: emp.name,
              department: emp.department,
              date,
              attendanceStatus:
                leave.leaveType === "WFH" ? "WFH" : "On Leave",
              loginTime: "",
              logoutTime: "",
              punctuality: ""
            };
          }

          return {
            employeeId: emp._id,
            employeeName: emp.name,
            department: emp.department,
            date,
            attendanceStatus: "Absent",
            loginTime: "",
            logoutTime: "",
            punctuality: ""
          };
        });

      setRecords(rows);
      setAllowPastEdit(false);
    };

    loadAttendance();
  }, [date, employees, leaves]);

  /* Edit handlers */
  const handleChange = (employeeId, field, value) => {
    setRecords(prev =>
      prev.map(r =>
        String(r.employeeId) === String(employeeId)
          ? { ...r, [field]: value }
          : r
      )
    );
  };

  const handleStatusChange = (record, value) => {
    if (value === "On Leave") {
      const leaveExists = leaves.some(
        l =>
          String(l.employeeId) === String(record.employeeId) &&
          l.startDate <= date &&
          l.endDate >= date
      );

      if (!leaveExists) {
        setLeaveModalEmployee(record);
        return;
      }
    }

    handleChange(record.employeeId, "attendanceStatus", value);
  };

  /* Save */
  const handleSave = async () => {
    const payload = records.map(
      ({ employeeName, department, ...rest }) => rest
    );

    await saveAttendanceBulk(payload);

    //  reload saved attendance
    const updated = await getAttendanceByDate(date);
    setRecords(updated.map(r => ({
      ...r,
      employeeName: employees.find(e => String(e._id) === String(r.employeeId))?.name,
      department: employees.find(e => String(e._id) === String(r.employeeId))?.department
    })));

    //  lock UI for today
    if (date === today) {
      setAttendanceLocked(true);
    }

    alert("Attendance saved");
  };


  /* Insights */
  const insights = useMemo(() => {
    return records.reduce((acc, r) => {
      acc[r.attendanceStatus] =
        (acc[r.attendanceStatus] || 0) + 1;
      return acc;
    }, {});
  }, [records]);

  const filteredRecords = records.filter(r =>
    r.employeeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Attendance</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Search employee"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Attendance table */}
      <div className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3">Department</th>
              <th className="p-3">Login</th>
              <th className="p-3">Logout</th>
              <th className="p-3">Attendance</th>
              <th className="p-3">Punctuality</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map(r => {
              const isLeave = r.attendanceStatus === "On Leave";
              const locked = (date === today && attendanceLocked) ||
                            (isPastDate && !allowPastEdit);

              return (
                <tr
                  key={r.employeeId}
                  className={`border-t ${attendanceLocked && date === today ? "opacity-60" : ""}`}
                >

                  <td
                    className="p-3 text-blue-600 cursor-pointer underline"
                    onClick={() =>
                      setViewEmployee(
                        employees.find(
                          e => String(e._id) === String(r.employeeId)
                        )
                      )
                    }
                  >
                    {r.employeeName}
                  </td>

                  <td className="p-3 text-center">{r.department}</td>

                  <td className="p-3 text-center">
                    <input
                      type="time"
                      disabled={isLeave || locked}
                      value={r.loginTime}
                      onChange={e =>
                        handleChange(
                          r.employeeId,
                          "loginTime",
                          e.target.value
                        )
                      }
                      className="border p-1 rounded"
                    />
                  </td>

                  <td className="p-3 text-center">
                    <input
                      type="time"
                      disabled={isLeave || locked}
                      value={r.logoutTime}
                      onChange={e =>
                        handleChange(
                          r.employeeId,
                          "logoutTime",
                          e.target.value
                        )
                      }
                      className="border p-1 rounded"
                    />
                  </td>

                  <td className="p-3 text-center">
                    <select
                      disabled={locked}
                      value={r.attendanceStatus}
                      onChange={e =>
                        handleStatusChange(r, e.target.value)
                      }
                      className="border p-1 rounded"
                    >
                      <option>Present</option>
                      <option>Half Day</option>
                      <option>Absent</option>
                      <option>WFH</option>
                      <option>On Leave</option>
                    </select>
                  </td>

                  <td className="p-3 text-center">
                    <select
                      disabled={isLeave || locked}
                      value={r.punctuality}
                      onChange={e =>
                        handleChange(
                          r.employeeId,
                          "punctuality",
                          e.target.value
                        )
                      }
                      className="border p-1 rounded"
                    >
                      <option value="">—</option>
                      <option>On Time</option>
                      <option>Late</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Buttons */}
        <div className="flex justify-end mt-4 gap-3">

          {attendanceLocked && date === today && (
            <button
              onClick={() => setAttendanceLocked(false)}
              className="border px-4 py-2 rounded"
            >
              Edit Attendance
            </button>
          )}

          {isPastDate && !allowPastEdit && (
            <button
              onClick={() => setShowPastEditModal(true)}
              className="border px-4 py-2 rounded"
            >
              Edit Past Attendance
            </button>
          )}

          {(!attendanceLocked || allowPastEdit) && (
            <button
              onClick={handleSave}
              className="bg-black text-white px-6 py-2 rounded"
            >
              Save Attendance
            </button>
          )}

        </div>

      </div>

      {/* Past edit modal */}
      {showPastEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">
              Edit Past Attendance
            </h2>

            <p className="text-sm text-gray-600">
              You are editing attendance for a past date ({date}).  
              This should only be done to correct genuine mistakes.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowPastEditModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAllowPastEdit(true);
                  setShowPastEditModal(false);
                }}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Allow Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave modal */}
      {leaveModalEmployee && (
        <CreateLeaveFromAttendanceModal
          employee={employees.find(
            e => String(e._id) === String(leaveModalEmployee.employeeId)
          )}
          startDate={date}
          onCreate={(leave) => {
            setLeaves(prev => [...prev, leave]);
            setRecords(prev =>
              prev.map(r =>
                String(r.employeeId) === String(leave.employeeId)
                  ? { ...r, attendanceStatus: "On Leave" }
                  : r
              )
            );
          }}
          onClose={() => setLeaveModalEmployee(null)}
        />
      )}

      {/* Monthly attendance modal */}
      {viewEmployee && (
        <MonthlyAttendanceModal
          employee={viewEmployee}
          onClose={() => setViewEmployee(null)}
        />
      )}
    </div>
  );
};

export default Attendance;
