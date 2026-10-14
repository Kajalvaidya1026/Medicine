import React from "react";
import { Link, useParams } from "react-router-dom";

import { normalizeRole } from "../constants/roles.js";

export default function DashboardPage() {
  const { role } = useParams();
  const dashboardRole = normalizeRole(role);

  if (!dashboardRole) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-card">
          <h1>Unsupported account role</h1>
          <p>Please sign in again with a supported account.</p>
          <Link className="primary-button" to="/Login/role">
            Go to Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <span className="auth-card__brand-icon" aria-hidden="true">
          ✚
        </span>
        <p className="auth-eyebrow">MEDICARE</p>
        <h1>{dashboardRole} Dashboard</h1>
        <p>Welcome to your dashboard</p>
        <span className="dashboard-role">Role: {dashboardRole}</span>
        <Link className="dashboard-link" to="/">
          Back to Home
        </Link>
      </section>
    </main>
  );
}
