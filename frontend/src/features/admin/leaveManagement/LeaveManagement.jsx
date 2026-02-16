import { useEffect, useState } from "react";

import AddLeaveForm from "./AddLeaveForm";
import EditLeaveModal from "./EditLeaveModal";
import RevertLeaveModal from "./RevertLeaveModal";
import LeaveTable from "./LeaveTable";
import LeaveSummary from "./LeaveSummary";
import LeaveFilters from "./LeaveFilters";

import { getEmployees } from "../../../services/api/employeeApi";
import {
  getLeaves,
  createLeave,
  updateLeave,
  revertLeave
} from "../../../services/api/leaveApi";

const LeaveManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [filters, setFilters] = useState({
    department: "",
    month: "",
    search: ""
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [leaveToEdit, setLeaveToEdit] = useState(null);
  const [leaveToRevert, setLeaveToRevert] = useState(null);

  /* ---------------- LOAD DATA ---------------- */

  const loadLeaves = async () => {
    try {
      const data = await getLeaves();
      setLeaves(data);
    } catch {
      alert("Failed to load leaves");
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data.filter(e => e.status === "Active"));
      } catch {
        alert("Failed to load employees");
      }
    };

    loadEmployees();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  const addLeave = async (leave) => {
    try {
      await createLeave(leave);
      await loadLeaves();
      setShowAddModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const saveEditedLeave = async (updatedLeave) => {
    try {
      await updateLeave(updatedLeave._id, updatedLeave);
      await loadLeaves();
      setLeaveToEdit(null);
    } catch {
      alert("Failed to update leave");
    }
  };

  const confirmRevertLeave = async ({ _id, revertReason }) => {
    try {
      await revertLeave(_id, revertReason);
      await loadLeaves();
      setLeaveToRevert(null);
    } catch {
      alert("Failed to revert leave");
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredLeaves = leaves.filter((l) => {
    if (l.status === "Reverted") return false;

    const employee = employees.find(
      e => String(e._id) === String(l.employeeId?._id || l.employeeId)
    );
    if (!employee) return false;

    const leaveMonth = l.startDate.slice(0, 7);

    if (filters.department && employee.department !== filters.department)
      return false;

    if (filters.month && leaveMonth !== filters.month)
      return false;

    if (
      filters.search &&
      !(employee.name || "")
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    )
      return false;

    return true;
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Leave Management</h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Add Leave
        </button>
      </div>

      {/* SUMMARY */}
      <LeaveSummary leaves={filteredLeaves} />

      {/* FILTERS */}
      <LeaveFilters filters={filters} setFilters={setFilters} />

      {/* TABLE */}
      <LeaveTable
        leaves={filteredLeaves}
        onEdit={setLeaveToEdit}
        onRevert={setLeaveToRevert}
      />

      {/* ADD LEAVE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <AddLeaveForm
              employees={employees}
              onAddLeave={addLeave}
              onClose={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {leaveToEdit && (
        <EditLeaveModal
          leave={leaveToEdit}
          onSave={saveEditedLeave}
          onClose={() => setLeaveToEdit(null)}
        />
      )}

      {/* REVERT MODAL */}
      {leaveToRevert && (
        <RevertLeaveModal
          leave={leaveToRevert}
          onConfirm={confirmRevertLeave}
          onClose={() => setLeaveToRevert(null)}
        />
      )}
    </div>
  );
};

export default LeaveManagement;
