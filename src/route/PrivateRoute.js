import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user?.email;

  return isLoggedIn ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
