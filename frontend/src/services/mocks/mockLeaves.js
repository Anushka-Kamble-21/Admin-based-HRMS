const mockLeaveUsage = {
  id: "leave_001",                 // frontend id (uuid/string)
  
  employeeId: "emp_123",           // maps to employee
  employeeName: "Andrew Miles",    // for UI (no lookup needed)
  department: "HR",

  leaveType: "Sick",               // Sick | Casual | Earned | Unpaid | WFH | CompOff

  startDate: "2026-01-23",
  endDate: "2026-01-25",

  totalDays: 3,                    // auto-calculated
  sandwichDays: 1,                 // optional (0 if none)

  paid: true,                      // derived, not manually chosen

  status: "Approved",              // Approved | Rejected | Cancelled | Reverted | Auto-Marked

  reason: "Fever",                 // optional admin note

  createdBy: "Admin",
  createdAt: "2026-01-20T10:30:00",

  lastModifiedAt: "2026-01-21T15:00:00",
  lastModifiedBy: "Admin",

  revertReason: null               // filled only if reverted
}


export default mockLeaveUsage;

