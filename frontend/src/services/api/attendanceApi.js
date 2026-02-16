import axios from "../axios";

export const getAttendanceByDate = async (date) => {
  try {
    const res = await axios.get(`/attendance/date/${date}`);
    return res.data;
  } catch (err) {
    // preserve old behavior: return empty array on failure
    return [];
  }
};

export const saveAttendanceBulk = async (records) => {
  const res = await axios.post("/attendance", { records });
  return res.data;
};


export const getEmployeeMonthlyAttendance = async (
  employeeId,
  month,
  year
) => {
  const res = await axios.get(
    `/attendance/employee/${employeeId}/monthly`,
    {
      params: { month, year }
    }
  );

  return res.data;
};
