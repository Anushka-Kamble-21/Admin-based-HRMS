import express from "express";
import cors from "cors";
import performanceRoutes from "./features/performance/performance.routes.js";
import employeeRoutes from "./features/employees/employee.routes.js";
import attendanceRoutes from "./features/attendance/attendance.routes.js";
import leaveRoutes from "./features/leaves/leave.routes.js";
import payrollRoutes from "./features/payroll/payroll.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import profileRoutes from "./features/profile/profile.routes.js";
import dashboardRoutes from "./features/dashboard/dashboard.routes.js";
import eventRoutes from "./features/events/event.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hrms.arraylogic.in"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// imp
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/employees", employeeRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/events", eventRoutes);

export default app;
