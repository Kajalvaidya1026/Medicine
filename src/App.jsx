import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/index.jsx";
import CreateAccount from "./pages/auth/CreateAccount.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login/role" element={<SignIn />} />
      <Route path="/Login/create-account" element={<CreateAccount />} />
      <Route path="/Login/forgot-password" element={<ForgotPassword />} />
      <Route path="/Login/otp" element={<VerifyOtp />} />
      <Route path="/Login/reset-password" element={<ResetPassword />} />
      <Route path="/Dashboard/:role" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
