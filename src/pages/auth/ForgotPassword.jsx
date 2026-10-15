import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthInput from "../../components/auth/AuthInput.jsx";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthNotice from "../../components/auth/AuthNotice.jsx";
import PrimaryButton from "../../components/auth/PrimaryButton.jsx";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const cleanEmail = email.trim();
    if (!emailPattern.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    navigate(`/Login/otp?email=${encodeURIComponent(cleanEmail)}`);
  }

  return (
    <AuthLayout
      eyebrow="ACCOUNT RECOVERY"
      title="Forgot Password?"
      subtitle="Enter your registered email address to continue the demo reset flow."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput
          id="recovery-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
        />
        {error && (
          <AuthNotice notice={{ type: "error", message: error }} />
        )}
        <p className="demo-disclaimer">
          Password recovery is a frontend demo; this screen does not send an
          email or call a recovery endpoint.
        </p>
        <PrimaryButton>
          Send OTP <span aria-hidden="true">→</span>
        </PrimaryButton>
      </form>
      <p className="auth-switch">
        <Link to="/Login/role">← Back to Login</Link>
      </p>
    </AuthLayout>
  );
}
