// src/components/ProtectedRoute.tsx  (or wherever it lives)
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import LogoLoader from "./LogoLoader";
import { useAuth } from "../context/AuthContext";   // ← use the hook

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;           // optional role requirement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While checking auth state, show nothing or a loader
  if (isLoading) {
    return <LogoLoader fullScreen />;
  }

  // Not logged in → redirect to login with "from" state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check (if role prop is passed)
  if (role && user.user_type !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
