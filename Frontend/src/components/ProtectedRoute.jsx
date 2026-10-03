import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { auth } = useAuth();

  if (!auth) {
    return (
      <Navigate to={role === "ADMIN" ? "/admin/login" : "/login"} replace />
    );
  }
  if (role && auth.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
