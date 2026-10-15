import React from "react";

export default function AuthNotice({ notice }) {
  if (!notice) {
    return null;
  }

  return (
    <div
      className={`form-notice form-notice--${notice.type}`}
      role={notice.type === "error" ? "alert" : "status"}
    >
      {notice.message}
    </div>
  );
}
