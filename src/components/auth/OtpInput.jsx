import React from "react";

export default function OtpInput({
  digits,
  inputRefs,
  onDigitChange,
  onKeyDown,
}) {
  return (
    <div className="otp-inputs" aria-label="4-digit verification code">
      {digits.map((digit, index) => (
        <input
          aria-label={`Verification digit ${index + 1}`}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          inputMode="numeric"
          key={index}
          maxLength={1}
          onChange={(event) => onDigitChange(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(index, event)}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          value={digit}
        />
      ))}
    </div>
  );
}
