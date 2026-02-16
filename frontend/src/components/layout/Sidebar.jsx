import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm transition ${
      isActive
        ? "bg-white text-[#0f2a25] font-medium"
        : "text-gray-300 hover:bg-[#173f37] hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-[#0f2a25] text-white flex flex-col">
      <div className="p-6 text-2xl font-bold tracking-wide">
        HRMS
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/employees" className={linkClass}>
          Employee Management
        </NavLink>

        <NavLink to="/admin/attendance" className={linkClass}>
          Attendance
        </NavLink>

        <NavLink to="/admin/leaves" className={linkClass}>
          Leave Management
        </NavLink>

        <NavLink to="/admin/payroll" className={linkClass}>
          Payroll
        </NavLink>

        <NavLink to="/admin/performance" className={linkClass}>
          Performance
        </NavLink>

        <NavLink to="/admin/profile" className={linkClass}>
          Profile
        </NavLink>
        
      </nav>
    </aside>
  );
};

export default Sidebar;