import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../api/auth.js";
import AuthInput from "../../components/auth/AuthInput.jsx";
import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthNotice from "../../components/auth/AuthNotice.jsx";
import PasswordInput from "../../components/auth/PasswordInput.jsx";
import PasswordRequirements from "../../components/auth/PasswordRequirements.jsx";
import PrimaryButton from "../../components/auth/PrimaryButton.jsx";



const PUBLIC_ROLES = ["Customer", "Supplier", "Doctor"];
const ROLE_IDS = { Customer: 1, Supplier: 2, Doctor: 3 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateAccount() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("Customer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setNotice({ type: "error", message: "Please enter your name." });
      return;
    }
    if (!emailPattern.test(cleanEmail)) {
      setNotice({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!PUBLIC_ROLES.includes(accountType)) {
      setNotice({ type: "error", message: "Please select an account type." });
      return;
    }
    if (!passwordValid) {
      setNotice({
        type: "error",
        message:
          "Use at least 8 characters, including uppercase and lowercase letters and a number.",
      });
      return;
    }
    if (confirmPassword !== password) {
      setNotice({ type: "error", message: "Passwords do not match." });
      return;
    }

    setBusy(true);
    setNotice(null);
    try {
      await registerUser({
        userName: cleanEmail.split("@")[0],
        password,
        fullName: cleanName,
        email: cleanEmail,
        contactNumber: "",
        role: {
          roleId: ROLE_IDS[accountType],
        },
        isActive: true,
      });
      setNotice({
        type: "success",
        message: `Account created successfully for ${accountType}.`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not create your account. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  const signInUrl = `/Login/role?role=${encodeURIComponent(accountType)}`;

  return (
    <AuthLayout
      eyebrow="GET STARTED"
      title="Create Account"
      subtitle="Sign up to get started with MEDICARE."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <AuthInput
          id="signup-name"
          label="Name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Enter your full name"
          autoComplete="name"
        />
        <AuthInput
          id="signup-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
        />
        <div className="form-field">
          <label htmlFor="signup-role">Account Type</label>
          <select
            id="signup-role"
            value={accountType}
            onChange={(event) => setAccountType(event.target.value)}
          >
            {PUBLIC_ROLES.map((publicRole) => (
              <option key={publicRole} value={publicRole}>
                {publicRole}
              </option>
            ))}
          </select>
        </div>
        <PasswordInput
          id="signup-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          autoComplete="new-password"
          placeholder="Enter your password"
        />
        {password && <PasswordRequirements password={password} />}
        <PasswordInput
          id="signup-confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          visible={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((current) => !current)}
          autoComplete="new-password"
          placeholder="Confirm your password"
        />
        {confirmPassword && (
          <p
            className={
              confirmPassword === password
                ? "password-match password-match--valid"
                : "password-match password-match--invalid"
            }
            aria-live="polite"
          >
            {confirmPassword === password
              ? "✓ Passwords match"
              : "✗ Passwords do not match"}
          </p>
        )}
        <AuthNotice notice={notice} />
        {notice?.type === "success" ? (
          <PrimaryButton
            type="button"
            onClick={() => navigate(signInUrl)}
          >
            Continue to Sign In
          </PrimaryButton>
        ) : (
          <PrimaryButton disabled={busy}>
            {busy ? "Creating Account…" : "Create Account"}
            <span aria-hidden="true">→</span>
          </PrimaryButton>
        )}
      </form>
      <p className="auth-switch">
        Already registered? <Link to={signInUrl}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}
