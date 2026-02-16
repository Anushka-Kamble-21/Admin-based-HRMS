import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicRoutes = () => {
  const { token } = useAuth();
  return token ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
};

export default PublicRoutes;
