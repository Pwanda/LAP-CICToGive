import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth.tsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <p>loading...</p>;

  if (!isLoading && isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
};
