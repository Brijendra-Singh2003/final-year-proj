import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// roles: optional array of allowed roles, e.g. ["admin","doctor"]
export default function ProtectedRoute({ roles = null, redirectTo = "/login" }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to={redirectTo} replace />;

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If allowed, render nested routes
  return <Outlet />;
}
