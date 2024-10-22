import React from "react";
import { Route, Navigate } from "react-router-dom";
import AdminLayout from "~/layouts/AdminLayout/AdminLayout";


const ProtectedKH: React.FC<{
  element: React.ReactElement;
}> = ({ element }) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const isAuthenticated = Boolean(refreshToken);
  if (isAuthenticated) {
        return element;
  }else{return <Navigate to="/sign-up" replace={true} state={{ from: "/" }} />;}

  // Redirect to sign-in page if not authenticated
  
};


export default ProtectedKH;
