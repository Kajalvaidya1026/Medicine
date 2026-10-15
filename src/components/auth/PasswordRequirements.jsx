import React from "react";

export default function PasswordRequirements({
  password,
  includeSpecial = false,
}) {
  const requirements = [
    [password.length >= 8, "At least 8 characters"],
    [/[A-Z]/.test(password), "At least 1 uppercase letter"],
    [/[a-z]/.test(password), "At least 1 lowercase letter"],
    [/[0-9]/.test(password), "At least 1 number"],
  ];

  if (includeSpecial) {
    requirements.push([
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
      "At least 1 special character",
    ]);
  }

  return (
    <ul className="password-requirements" aria-live="polite">
      <li className="password-requirements__title">Password must contain:</li>
      {requirements.map(([valid, text]) => (
        <li
          className={
            valid ? "password-requirement is-valid" : "password-requirement"
          }
          key={text}
        >
          <span aria-hidden="true">{valid ? "✓" : "○"}</span> {text}
        </li>
      ))}
    </ul>
  );
}
