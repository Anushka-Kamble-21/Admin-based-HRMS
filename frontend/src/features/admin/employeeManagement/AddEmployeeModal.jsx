import { useState } from "react";

const AddEmployeeModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    salary: "",
    bankName: "",
    branch: "",
    accountNumber: "",
    ifsc: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.company || !form.name || !form.department || !form.designation) {
      alert("Please fill required fields");
      return;
    }

    const newEmployee = {
      //id: crypto.randomUUID(),
      name: form.name,
      company: form.company,
      department: form.department,
      designation: form.designation,
      dateOfJoining: form.dateOfJoining,
      salary: Number(form.salary),
      status: "Active",
      bankDetails: {
        bankName: form.bankName,
        branch: form.branch,
        accountNumber: form.accountNumber,
        ifsc: form.ifsc
      }
    };

    onAdd(newEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Employee</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <input name="name" placeholder="Name" className="border p-2 rounded" onChange={handleChange} />
          <input
            name="company"
            placeholder="Company Name"
            className="border p-2 rounded col-span-2"
            value={form.company}
            onChange={handleChange}
          />

          <input name="department" placeholder="Department" className="border p-2 rounded" onChange={handleChange} />
          <input name="designation" placeholder="Designation" className="border p-2 rounded" onChange={handleChange} />
          <input type="date" name="dateOfJoining" placeholder="Date of joining" className="border p-2 rounded" onChange={handleChange} />

          <input name="salary" placeholder="Salary" className="border p-2 rounded col-span-2" onChange={handleChange} />

          <h3 className="col-span-2 font-medium pt-2">Bank Details</h3>

          <input name="bankName" placeholder="Bank Name" className="border p-2 rounded" onChange={handleChange} />
          <input name="branch" placeholder="Branch" className="border p-2 rounded" onChange={handleChange} />
          <input name="accountNumber" placeholder="Account Number" className="border p-2 rounded" onChange={handleChange} />
          <input name="ifsc" placeholder="IFSC Code" className="border p-2 rounded" onChange={handleChange} />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
