import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoutes = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoutes;
