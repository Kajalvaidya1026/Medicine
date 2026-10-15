import React from "react";

export default function AuthHeader({ eyebrow, title, subtitle }) {
  return (
    <>
      <div className="auth-card__brand">
        <span className="auth-card__brand-icon" aria-hidden="true">
          ✚
        </span>
        <span>
          <strong>MEDICARE</strong>
          <small>PHARMACY MANAGEMENT</small>
        </span>
      </div>
      {eyebrow && <p className="auth-eyebrow">{eyebrow}</p>}
      <h2 className="auth-card__title">{title}</h2>
      {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
    </>
  );
}
