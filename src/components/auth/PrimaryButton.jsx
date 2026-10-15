import React from "react";

export default function PrimaryButton({
  children,
  type = "submit",
  disabled = false,
  onClick,
}) {
  return (
    <button
      className="primary-button"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
