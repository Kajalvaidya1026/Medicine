import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthNotice from "../../components/auth/AuthNotice.jsx";
import PasswordInput from "../../components/auth/PasswordInput.jsx";
import PasswordRequirements from "../../components/auth/PasswordRequirements.jsx";
import PrimaryButton from "../../components/auth/PrimaryButton.jsx";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState(null);
  const [complete, setComplete] = useState(false);

  const hasEightCharacters = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  function handleSubmit(event) {
    event.preventDefault();
    const checks = [
      [hasEightCharacters, "Password must contain at least 8 characters."],
      [hasUppercase, "Password must contain at least one uppercase letter."],
      [hasLowercase, "Password must contain at least one lowercase letter."],
      [hasNumber, "Password must contain at least one number."],
      [
        hasSpecialCharacter,
        "Password must contain at least one special character.",
      ],
      [passwordsMatch, "New password and confirm password must be the same."],
    ];
    const failed = checks.find(([valid]) => !valid);

    if (failed) {
      setNotice({ type: "error", message: failed[1] });
      return;
    }

    setNotice({
      type: "success",
      message:
        "Password validation passed. This is a frontend demo; no password was changed on the backend.",
    });
    setComplete(true);
  }

  function returnToSignIn() {
    const role = searchParams.get("role") || "Customer";
    navigate(`/Login/role?role=${encodeURIComponent(role)}`);
  }

  return (
    <AuthLayout
      eyebrow="DEMO ACCOUNT RECOVERY"
      title="Reset Password"
      subtitle="Create a strong new password for your account."
    >
      {complete ? (
        <div className="auth-form">
          <AuthNotice notice={notice} />
          <PrimaryButton type="button" onClick={returnToSignIn}>
            Back to Login
          </PrimaryButton>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <PasswordInput
            id="reset-password"
            label="New Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            visible={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
            autoComplete="new-password"
            placeholder="Enter new password"
          />
          <PasswordRequirements password={password} includeSpecial />
          <PasswordInput
            id="reset-confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((current) => !current)}
            autoComplete="new-password"
            placeholder="Confirm new password"
          />
          {confirmPassword && (
            <p
              className={
                passwordsMatch
                  ? "password-match password-match--valid"
                  : "password-match password-match--invalid"
              }
            >
              {passwordsMatch
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}
          <AuthNotice notice={notice} />
          <p className="demo-disclaimer">
            This screen validates locally; the inspected backend integration has
            no reset-password endpoint.
          </p>
          <PrimaryButton>
            Reset Password <span aria-hidden="true">→</span>
          </PrimaryButton>
        </form>
      )}
      <p className="auth-switch">
        <Link to="/Login/role">← Back to Login</Link>
      </p>
    </AuthLayout>
  );
}
