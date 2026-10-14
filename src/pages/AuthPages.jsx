import React from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { loginUser, registerUser } from "../api/auth.js";
import { ApiError } from "../api/client.js";
import AuthCard from "../components/AuthCard.jsx";
import { normalizeRole, SUPPORTED_ROLES } from "../constants/roles.js";

const PUBLIC_ROLES = ["Customer", "Supplier", "Doctor"];
const ROLE_IDS = { Customer: 1, Supplier: 2, Doctor: 3 };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PasswordInput({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
  placeholder,
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
        />
        <button
          className="password-toggle"
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function PasswordRequirements({ password, includeSpecial = false }) {
  const requirements = [
    [password.length >= 8, "At least 8 characters"],
    [/[A-Z]/.test(password), "At least 1 uppercase letter"],
    [/[a-z]/.test(password), "At least 1 lowercase letter"],
    [/[0-9]/.test(password), "At least 1 number"],
    ...(includeSpecial
      ? [[/[!@#$%^&*(),.?":{}|<>]/.test(password), "At least 1 special character"]]
      : []),
  ];

  return (
    <ul className="password-requirements" aria-live="polite">
      <li className="password-requirements__title">Password must contain:</li>
      {requirements.map(([valid, text]) => (
        <li
          className={valid ? "password-requirement is-valid" : "password-requirement"}
          key={text}
        >
          <span aria-hidden="true">{valid ? "✓" : "○"}</span> {text}
        </li>
      ))}
    </ul>
  );
}

function InlineNotice({ notice }) {
  if (!notice) return null;

  return (
    <div
      className={`form-notice form-notice--${notice.type}`}
      role={notice.type === "error" ? "alert" : "status"}
    >
      {notice.message}
    </div>
  );
}

export function LoginPage() {
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
    if (requestedRole) setRole(requestedRole);
  }, [requestedRole]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;

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
      setNotice({ type: "success", message: "Login successful. Opening your dashboard…" });
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
    <AuthCard
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
        <div className="form-field">
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>
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
        <InlineNotice notice={notice} />
        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? "Signing In…" : "Sign In"}
          <span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="auth-footnote">Your information is securely protected</p>
      <p className="auth-switch">
        New to MEDICARE? <Link to="/Login/create-account">Create account</Link>
      </p>
    </AuthCard>
  );
}

export function CreateAccountPage() {
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
        roleId: ROLE_IDS[accountType],
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

  return (
    <AuthCard
      eyebrow="GET STARTED"
      title="Create Account"
      subtitle="Sign up to get started with MEDICARE."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="signup-name">Name</label>
          <input
            id="signup-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="signup-email">Email Address</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>
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
        <InlineNotice notice={notice} />
        {notice?.type === "success" ? (
          <button
            className="primary-button"
            type="button"
            onClick={() =>
              navigate(`/Login/role?role=${encodeURIComponent(accountType)}`)
            }
          >
            Continue to Sign In
          </button>
        ) : (
          <button className="primary-button" type="submit" disabled={busy}>
            {busy ? "Creating Account…" : "Create Account"}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </form>
      <p className="auth-switch">
        Already registered?{" "}
        <Link to={`/Login/role?role=${encodeURIComponent(accountType)}`}>
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}

export function ForgotPasswordPage() {
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
    <AuthCard
      eyebrow="ACCOUNT RECOVERY"
      title="Forgot Password?"
      subtitle="Enter your registered email address to continue the demo reset flow."
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="recovery-email">Email Address</label>
          <input
            id="recovery-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>
        {error && <InlineNotice notice={{ type: "error", message: error }} />}
        <p className="demo-disclaimer">
          Password recovery is a frontend demo; this screen does not send an
          email or call a recovery endpoint.
        </p>
        <button className="primary-button" type="submit">
          Send OTP <span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="auth-switch">
        <Link to="/Login/role">← Back to Login</Link>
      </p>
    </AuthCard>
  );
}

export function OtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(21);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0 || verified) return undefined;
    const timeoutId = window.setTimeout(() => setTimer((current) => current - 1), 1000);
    return () => window.clearTimeout(timeoutId);
  }, [timer, verified]);

  function updateDigit(index, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((item, position) => position === index ? digit : item));
    setError("");
    if (digit && index < 3) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function verifyCode(event) {
    event.preventDefault();
    if (digits.join("") !== "2342") {
      setError(digits.join("").length !== 4
        ? "Please enter the complete 4-digit code."
        : "Invalid OTP. Please try again.");
      return;
    }
    setVerified(true);
    setError("");
  }

  function resendCode() {
    setTimer(21);
    setDigits(["", "", "", ""]);
    setError("");
    setVerified(false);
    inputRefs.current[0]?.focus();
  }

  return (
    <AuthCard
      eyebrow="DEMO VERIFICATION"
      title={verified ? "Code Verified" : "Verification Code"}
      subtitle={
        verified
          ? "Your demo code has been verified."
          : "Enter the 4-digit demo code to continue."
      }
    >
      {!verified ? (
        <form className="auth-form" onSubmit={verifyCode}>
          <div className="otp-inputs" aria-label="4-digit verification code">
            {digits.map((digit, index) => (
              <input
                aria-label={`Verification digit ${index + 1}`}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                inputMode="numeric"
                key={index}
                maxLength={1}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                ref={(element) => { inputRefs.current[index] = element; }}
                value={digit}
              />
            ))}
          </div>
          <p className="demo-disclaimer">
            Demo code: <strong>2342</strong>. No OTP is sent or validated by the
            backend.
          </p>
          {error && <InlineNotice notice={{ type: "error", message: error }} />}
          <p className="otp-timer" aria-live="polite">
            OTP expires in <strong>{timer}s</strong>
          </p>
          <button className="primary-button" type="submit">
            Verify OTP <span aria-hidden="true">→</span>
          </button>
          <button
            className="text-button"
            disabled={timer > 0}
            onClick={resendCode}
            type="button"
          >
            Resend OTP
          </button>
        </form>
      ) : (
        <div className="auth-form">
          <div className="verification-success" role="status">
            <span aria-hidden="true">✓</span>
            <strong>Verified and secure</strong>
          </div>
          <button
            className="primary-button"
            onClick={() =>
              navigate(`/Login/reset-password?email=${encodeURIComponent(email)}`)
            }
            type="button"
          >
            Continue to Reset Password <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
      <p className="auth-switch">
        <Link to="/Login/role">← Back to Login</Link>
      </p>
    </AuthCard>
  );
}

export function ResetPasswordPage() {
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
      [hasSpecialCharacter, "Password must contain at least one special character."],
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

  return (
    <AuthCard
      eyebrow="DEMO ACCOUNT RECOVERY"
      title="Reset Password"
      subtitle="Create a strong new password for your account."
    >
      {complete ? (
        <div className="auth-form">
          <InlineNotice notice={notice} />
          <button
            className="primary-button"
            onClick={() => navigate(`/Login/role?role=${encodeURIComponent(searchParams.get("role") || "Customer")}`)}
            type="button"
          >
            Back to Login
          </button>
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
            <p className={passwordsMatch ? "password-match password-match--valid" : "password-match password-match--invalid"}>
              {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}
          <InlineNotice notice={notice} />
          <p className="demo-disclaimer">
            This screen validates locally; the inspected backend integration has
            no reset-password endpoint.
          </p>
          <button className="primary-button" type="submit">
            Reset Password <span aria-hidden="true">→</span>
          </button>
        </form>
      )}
      <p className="auth-switch">
        <Link to="/Login/role">← Back to Login</Link>
      </p>
    </AuthCard>
  );
}
