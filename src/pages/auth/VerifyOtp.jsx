import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout.jsx";
import AuthNotice from "../../components/auth/AuthNotice.jsx";
import OtpInput from "../../components/auth/OtpInput.jsx";
import PrimaryButton from "../../components/auth/PrimaryButton.jsx";

const DEMO_OTP = "2342";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(21);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0 || verified) {
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => setTimer((current) => current - 1),
      1000,
    );
    return () => window.clearTimeout(timeoutId);
  }, [timer, verified]);

  function updateDigit(index, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) =>
      current.map((item, position) => (position === index ? digit : item)),
    );
    setError("");

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function verifyCode(event) {
    event.preventDefault();

    const code = digits.join("");
    if (code.length !== 4) {
      setError("Please enter the complete 4-digit code.");
      return;
    }
    if (code !== DEMO_OTP) {
      setError("Invalid OTP. Please try again.");
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
    <AuthLayout
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
          <OtpInput
            digits={digits}
            inputRefs={inputRefs}
            onDigitChange={updateDigit}
            onKeyDown={handleKeyDown}
          />
          <p className="demo-disclaimer">
            Demo code: <strong>{DEMO_OTP}</strong>. No OTP is sent or validated
            by the backend.
          </p>
          {error && (
            <AuthNotice notice={{ type: "error", message: error }} />
          )}
          <p className="otp-timer" aria-live="polite">
            OTP expires in <strong>{timer}s</strong>
          </p>
          <PrimaryButton>
            Verify OTP <span aria-hidden="true">→</span>
          </PrimaryButton>
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
          <PrimaryButton
            type="button"
            onClick={() =>
              navigate(
                `/Login/reset-password?email=${encodeURIComponent(email)}`,
              )
            }
          >
            Continue to Reset Password <span aria-hidden="true">→</span>
          </PrimaryButton>
        </div>
      )}
      <p className="auth-switch">
        <Link to="/Login/role">← Back to Login</Link>
      </p>
    </AuthLayout>
  );
}
