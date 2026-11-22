/** Cookie set only after a successful admin login on the testing host. */
export const TESTING_ADMIN_COOKIE = "testing-admin-uuid";

export const TESTING_ACCESS_PATH = "/testing-access";

const TESTING_HOST = "testing.marathon-os.com";

export function isTestingServerHost(hostname) {
  const host = String(hostname || "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  return host === TESTING_HOST || host.endsWith(`.${TESTING_HOST}`);
}

/** Same-origin path only. Drops the testing login route so it cannot loop. */
export function safeNextPath(value) {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return "/";
  }
  if (value === TESTING_ACCESS_PATH || value.startsWith(`${TESTING_ACCESS_PATH}?`)) {
    return "/";
  }
  return value;
}

export function persistTestingAdminSession(adminUuid) {
  if (typeof document === "undefined" || !adminUuid) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TESTING_ADMIN_COOKIE}=${encodeURIComponent(adminUuid)}; Path=/; Max-Age=${60 * 60 * 24 * 14}; SameSite=Lax${secure}`;
}
