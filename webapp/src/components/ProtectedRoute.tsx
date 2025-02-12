import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, userRole }: { allowedRoles: string[], userRole: string }) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
