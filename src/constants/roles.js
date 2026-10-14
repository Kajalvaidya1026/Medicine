export const SUPPORTED_ROLES = [
  "Super Admin",
  "Admin",
  "Supplier",
  "Customer",
  "Doctor",
  "MR",
];

export function normalizeRole(role) {
  const roleValue = Array.isArray(role) ? role[0] : role;
  const normalizedRole = roleValue?.trim().toLowerCase().replace(/[\s_-]+/g, "");

  return (
    SUPPORTED_ROLES.find(
      (supportedRole) =>
        supportedRole.toLowerCase().replace(/\s+/g, "") === normalizedRole,
    ) ?? null
  );
}
