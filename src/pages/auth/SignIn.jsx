import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { loginUser } from "../../api/auth.js";
import { ApiError } from "../../api/client.js";
import AuthInput from "../../components/auth/AuthInput.jsx";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthNotice from "../../components/auth/AuthNotice.jsx";
import PasswordInput from "../../components/auth/PasswordInput.jsx";
import PrimaryButton from "../../components/auth/PrimaryButton.jsx";
import { normalizeRole, SUPPORTED_ROLES } from "../../constants/roles.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedRole = normalizeRole(searchParams.get("role"));
  const [role, setRole] = useState(requestedRole || "Customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const inFlight = useRef(false);

  useEffect(() => {
    if (requestedRole) {
      setRole(requestedRole);
    }
  }, [requestedRole]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (inFlight.current) {
      return;
    }

    const cleanEmail = email.trim();
    if (!emailPattern.test(cleanEmail)) {
      setNotice({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!password) {
      setNotice({ type: "error", message: "Please enter your password." });
      return;
    }

    inFlight.current = true;
    setBusy(true);
    setNotice(null);

    try {
      const response = await loginUser(cleanEmail, password);
      if (!response.flag) {
        setNotice({
          type: "error",
          message: response.message || "Invalid username or password.",
        });
        return;
      }

      setNotice({
        type: "success",
        message: "Login successful. Opening your dashboard…",
      });
      window.setTimeout(() => {
        navigate(`/Dashboard/${encodeURIComponent(role)}`, { replace: true });
      }, 700);
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof ApiError
            ? error.message
            : "Unable to sign in right now. Please try again.",
      });
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="ACCOUNT ACCESS"
      title={`${role} Login`}
      subtitle="Sign in to continue to your dashboard."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="login-role">Account role</label>
          <select
            id="login-role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {SUPPORTED_ROLES.map((supportedRole) => (
              <option key={supportedRole} value={supportedRole}>
                {supportedRole}
              </option>
            ))}
          </select>
        </div>
        <AuthInput
          id="login-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
        />
        <PasswordInput
          id="login-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        <div className="form-actions form-actions--end">
          <Link to="/Login/forgot-password">Forgot password?</Link>
        </div>
        <AuthNotice notice={notice} />
        <PrimaryButton disabled={busy}>
          {busy ? "Signing In…" : "Sign In"}
          <span aria-hidden="true">→</span>
        </PrimaryButton>
      </form>
      <p className="auth-footnote">Your information is securely protected</p>
      <p className="auth-switch">
        New to MEDICARE? <Link to="/Login/create-account">Create account</Link>
      </p>
    </AuthLayout>
  );
}
