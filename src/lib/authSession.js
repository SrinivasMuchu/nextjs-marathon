import { getCookie, setCookie } from "cookies-next";

const UUID_COOKIE = "uuid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const COOKIE_OPTS = { path: "/", sameSite: "lax", maxAge: COOKIE_MAX_AGE };

export function isTruthyVerified(value) {
  return value === true || value === "true" || value === "1";
}

/** Persist logged-in session — is_verified in localStorage only; uuid in both. */
export function persistVerifiedSession(uuid) {
  if (typeof window === "undefined") return;
  const id = String(uuid || "").trim();
  if (!id) return;

  localStorage.setItem("uuid", id);
  localStorage.setItem("is_verified", "true");
  setCookie(UUID_COOKIE, id, COOKIE_OPTS);
}

/** Anonymous session after logout — new uuid in localStorage + cookie. */
export function persistAnonymousSession(uuid) {
  if (typeof window === "undefined") return;
  const id = String(uuid || "").trim();
  if (!id) return;

  localStorage.removeItem("is_verified");
  localStorage.setItem("uuid", id);
  setCookie(UUID_COOKIE, id, COOKIE_OPTS);
}

export function readVerifiedFromStorage() {
  if (typeof window === "undefined") {
    return { uuid: "", isVerified: false };
  }
  const lsUuid = localStorage.getItem("uuid") || "";
  const lsVerified = isTruthyVerified(localStorage.getItem("is_verified"));
  const cookieUuid = String(getCookie(UUID_COOKIE) || "");

  // Verified uuid in localStorage wins over stale anonymous cookie.
  if (lsVerified && lsUuid) {
    return { uuid: lsUuid, isVerified: true };
  }
  return { uuid: lsUuid || cookieUuid, isVerified: false };
}
