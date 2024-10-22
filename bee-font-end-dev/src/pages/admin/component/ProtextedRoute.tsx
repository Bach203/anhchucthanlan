import React from "react";
import { Route, Navigate } from "react-router-dom";
import AdminLayout from "~/layouts/AdminLayout/AdminLayout";


const ProtectedRoute1: React.FC<{
  element: React.ReactElement;
}> = ({ element }) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const roleId = localStorage.getItem("roleId");
  const isAuthenticated = Boolean(refreshToken);
  if (isAuthenticated) {
    switch (roleId) {
      case "3":
        // Redirect to /san-pham for roleId 3
        return <Navigate to="/san-pham" replace={true} state={{ from: "/" }} />;
      default:
        // Redirect to sign-in page for other roles
        return element;
    }
  }

  // Redirect to sign-in page if not authenticated
  return <Navigate to="/sign-in" replace={true} state={{ from: "/" }} />;
};


export default ProtectedRoute1;
