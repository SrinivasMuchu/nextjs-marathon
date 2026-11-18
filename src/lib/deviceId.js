import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getCookie, setCookie } from "cookies-next";
import { BASE_URL } from "@/config";

/**
 * Long-lived random id for this browser, kept in a cookie and localStorage.
 * Unlike the account `uuid`, it is never replaced on logout or email change: the
 * server uses it to limit converter free files per device (2 for the device's lifetime).
 */
const DEVICE_ID_KEY = "device_id";
// Browsers cap cookie lifetime at ~400 days; it's refreshed on every visit.
const COOKIE_OPTS = { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 400 };
const DEVICE_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;

function readStoredDeviceId() {
  let fromStorage = "";
  try {
    fromStorage = localStorage.getItem(DEVICE_ID_KEY) || "";
  } catch {
    fromStorage = "";
  }
  if (DEVICE_ID_RE.test(fromStorage)) return fromStorage;
  const fromCookie = String(getCookie(DEVICE_ID_KEY) || "");
  return DEVICE_ID_RE.test(fromCookie) ? fromCookie : "";
}

/** This browser's device id; created on first use and stored in both places. */
export function getDeviceId() {
  if (typeof window === "undefined") return "";
  let id = readStoredDeviceId();
  if (!id) id = uuidv4();
  try {
    if (localStorage.getItem(DEVICE_ID_KEY) !== id) localStorage.setItem(DEVICE_ID_KEY, id);
  } catch {
    // Storage blocked: the cookie still carries it.
  }
  if (getCookie(DEVICE_ID_KEY) !== id) setCookie(DEVICE_ID_KEY, id, COOKIE_OPTS);
  return id;
}

/** `{ "x-device-id": ... }` for requests to our API (empty on the server). */
export function deviceIdHeader() {
  const id = getDeviceId();
  return id ? { "x-device-id": id } : {};
}

let installed = false;

/** Send x-device-id on every axios call to our API (not to S3 or other hosts). */
export function installDeviceIdHeader() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  getDeviceId(); // refresh the cookie lifetime
  axios.interceptors.request.use((config) => {
    const url = String(config?.url || "");
    if (BASE_URL && url.startsWith(BASE_URL)) {
      const id = getDeviceId();
      if (id) {
        if (typeof config.headers?.set === "function") {
          if (!config.headers.has?.("x-device-id")) config.headers.set("x-device-id", id);
        } else {
          config.headers = { "x-device-id": id, ...(config.headers || {}) };
        }
      }
    }
    return config;
  });
}

// Installed on import so requests made before any effect runs carry it too.
installDeviceIdHeader();
