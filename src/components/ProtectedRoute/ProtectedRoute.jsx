import React from "react";
import Login from "../Login/Login";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  if (localStorage.getItem("userToken") === null) {
    return (
      <>
        <Navigate to="/login" />
      </>
    );
  } else {
    return <>{children}</>;
  }
}
