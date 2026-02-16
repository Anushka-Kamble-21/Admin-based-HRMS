import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateEmployee,  updateEmployeeStatus } from "../../../services/api/employeeApi";
import ResignConfirmModal from "./ResignConfirmModal";

const EmployeeProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showResignModal, setShowResignModal] = useState(false);

  const [form, setForm] = useState({
    ...state.employee,
    bankDetails: state.employee.bankDetails || {
      bankName: "",
      branch: "",
      accountNumber: "",
      ifsc: ""
    }
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "status" && value === "Active"
        ? { resignDate: "" }
        : {})
    }));
  };

  const handleBankChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateEmployee(form._id, form);
      navigate("/admin/employees", {
        state: { updatedEmployee: updated }
      });
    } catch {
      alert("Failed to update employee");
    }
  };

  const handleResignationConfirm = async ({ status, resignDate }) => {
    try {
      const updated = await updateEmployeeStatus(
        form._id,
        status,
        resignDate
      );

      setShowResignModal(false);

      navigate("/admin/employees", {
        state: { updatedEmployee: updated }
      });
    } catch {
      alert("Failed to mark employee as resigned");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-4xl">
      <h1 className="text-xl font-semibold mb-6">
        Employee Profile
      </h1>

      {/* ================= Personal & Job Details ================= */}
      <div className="mb-8">
        <h2 className="font-medium mb-4">
          Personal & Job Details
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block mb-1 text-gray-600">Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Employee Name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Department</label>
            <input
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Department"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Designation</label>
            <input
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Designation"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Date of Joining</label>
            <input
              type="date"
              value={form.dateOfJoining}
              onChange={(e) =>
                handleChange("dateOfJoining", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Salary</label>
            <input
              value={form.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Monthly Salary"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Employment Status</label>
            <select
              value={form.status}
              onChange={(e) => {
                if (e.target.value === "Resigned") {
                  setShowResignModal(true);
                } else {
                  handleChange("status", "Active");
                }
              }}
            >
              <option value="Active">Active</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>

          {form.status === "Resigned" && (
            <div>
              <label className="block mb-1 text-gray-600">
                Resignation Date
              </label>
              <input
                type="date"
                value={form.resignDate || ""}
                onChange={(e) =>
                  handleChange("resignDate", e.target.value)
                }
                className="border p-2 rounded w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= Bank Details ================= */}
      <div className="mb-8">
        <h2 className="font-medium mb-4">
          Bank Details
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block mb-1 text-gray-600">Bank Name</label>
            <input
              value={form.bankDetails.bankName}
              onChange={(e) =>
                handleBankChange("bankName", e.target.value)
              }
              className="border p-2 rounded w-full"
              placeholder="Bank Name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Branch</label>
            <input
              value={form.bankDetails.branch}
              onChange={(e) =>
                handleBankChange("branch", e.target.value)
              }
              className="border p-2 rounded w-full"
              placeholder="Branch"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Account Number</label>
            <input
              value={form.bankDetails.accountNumber}
              onChange={(e) =>
                handleBankChange("accountNumber", e.target.value)
              }
              className="border p-2 rounded w-full"
              placeholder="Account Number"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">IFSC Code</label>
            <input
              value={form.bankDetails.ifsc}
              onChange={(e) =>
                handleBankChange("ifsc", e.target.value)
              }
              className="border p-2 rounded w-full"
              placeholder="IFSC Code"
            />
          </div>
        </div>
      </div>

      {/* ================= ACTION ================= */}
      <div className="text-right">
        <button
          onClick={handleUpdate}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
      {showResignModal && (
        <ResignConfirmModal
          employee={form}
          onCancel={() => setShowResignModal(false)}
          onConfirm={handleResignationConfirm}
        />
      )}
    </div>
  );
};

export default EmployeeProfile;
