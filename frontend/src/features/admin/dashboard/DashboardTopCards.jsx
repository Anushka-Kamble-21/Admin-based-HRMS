import DashboardCard from "../../../components/common/DashboardCard";
import { useNavigate } from "react-router-dom";

const DashboardTopCards = ({ data, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Employees"
        value={data?.totalEmployees}
        subtitle="Active employees"
        loading={loading}
      />

      <DashboardCard
        title="On Leave Today"
        value={data?.onLeaveToday}
        subtitle="Across all departments"
        loading={loading}
      />

      <DashboardCard
        title="Employee Management"
        value={data?.totalEmployees}
        subtitle="View & manage employees"
        actionText="Manage Employees"
        onAction={() => navigate("/admin/employees")}
        loading={loading}
      />

      <DashboardCard
        title="Salary Management"
        value={`${data?.salaryStatus?.processed || 0}/${data?.totalEmployees || 0}`}
        subtitle="Salaries processed"
        actionText="Go to Payroll"
        onAction={() => navigate("/admin/payroll")}
        loading={loading}
      />
    </div>
  );
};

export default DashboardTopCards;
