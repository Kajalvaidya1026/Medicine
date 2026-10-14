import React from "react";
import { Link } from "react-router-dom";

export default function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb--one" aria-hidden="true" />
      <div className="auth-orb auth-orb--two" aria-hidden="true" />
      <div className="auth-layout">
        <section className="auth-intro" aria-label="MEDICARE introduction">
          <Link className="auth-brand" to="/" aria-label="MEDICARE home">
            <span className="auth-brand__mark" aria-hidden="true">
              +
            </span>
            <span>
              <strong>MEDICARE</strong>
              <small>PHARMACY MANAGEMENT SYSTEM</small>
            </span>
          </Link>
          <div className="auth-intro__content">
            <span className="auth-intro__eyebrow">SMART PHARMACY PLATFORM</span>
            <h1>Manage your pharmacy smarter.</h1>
            <p>
              Keep medicines, inventory, orders, and pharmacy operations easy to
              manage.
            </p>
            <div className="auth-pill-illustration" aria-hidden="true">
              <span className="auth-pill-illustration__glow" />
              <span className="auth-pill-illustration__cross">+</span>
              <span className="auth-pill-illustration__capsule">
                <i />
                <i />
              </span>
              <span className="auth-pill-illustration__tablet">
                <i />
              </span>
            </div>
          </div>
          <span className="auth-intro__footer">Secure · Simple · Reliable</span>
        </section>
        <section className="auth-panel">
          <article className="auth-card">
            <div className="auth-card__topline" />
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
            {children}
          </article>
          <Link className="auth-back-home" to="/">
            ← Back to home
          </Link>
        </section>
      </div>
    </main>
  );
}
