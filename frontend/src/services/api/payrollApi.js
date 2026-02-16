import axios from "../axios";

/* ---------- CALCULATE (AUTO / PREVIEW) ---------- */
export const calculatePayroll = async (payload) => {
  try {
    const res = await axios.post("/payroll/calculate", payload);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Payroll calculation failed"
    );
  }
};

/* ---------- SAVE FINAL PAYROLL ---------- */
export const savePayroll = async (payload) => {
  try {
    const res = await axios.post("/payroll", payload);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Payroll save failed"
    );
  }
};

/* ---------- GET PAYROLL HISTORY ---------- */
export const getPayrolls = async () => {
  const res = await axios.get("/payroll");
  return res.data;
};

/* ---------- MARK PAYROLL AS PAID ---------- */
export const markPayrollPaid = async (payrollId) => {
  const res = await axios.patch(`/payroll/${payrollId}/pay`);
  return res.data;
};
