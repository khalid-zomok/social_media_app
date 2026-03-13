import React from "react";
import { Navigate } from "react-router-dom";

export default function PostProtectedRoute({ children }) {
  // If token exists, redirect to home
  if (localStorage.getItem("userToken")) {
    return <Navigate to="/home" replace />; 
  }

  // Otherwise, allow access to Login/Register
  return children;
}