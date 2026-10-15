import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/index.jsx";
import {
  CreateAccountPage,
  ForgotPasswordPage,
  LoginPage,
  OtpPage,
  ResetPasswordPage,
} from "./pages/AuthPages.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login/role" element={<LoginPage />} />
      <Route path="/Login/create-account" element={<CreateAccountPage />} />
      <Route path="/Login/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/Login/otp" element={<OtpPage />} />
      <Route path="/Login/reset-password" element={<ResetPasswordPage />} />
      <Route path="/Dashboard/:role" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
