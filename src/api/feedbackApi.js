import axios from "axios";
import { BASE_URL } from "@/config";
import "@/lib/deviceId";

const FEEDBACK_API_BASE = "/v1/cad/feedback";

function userUuidHeader() {
  if (typeof window === "undefined") return {};
  const uuid = localStorage.getItem("uuid");
  return uuid ? { "user-uuid": uuid } : {};
}

function unwrap(data) {
  if (!data?.meta?.success) {
    const msg = data?.meta?.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data.data;
}

/**
 * Everything the rating UI needs for one job: route family, per-family chips/examples,
 * the moment (first_impression | after_use), existing ratings and whether to auto-prompt.
 * Drawing jobs pass the techdraw uuid header (their owner may be a separate techdraw identity).
 */
export async function getFeedbackContext(jobId, jobType = "converter", headers) {
  const { data } = await axios.get(`${BASE_URL}${FEEDBACK_API_BASE}/context`, {
    params: { job_id: jobId, job_type: jobType },
    headers: headers || userUuidHeader(),
    timeout: 20_000,
  });
  return unwrap(data);
}

/** Most recent downloaded converter file with no rating that may be asked about now, or null. */
export async function getPendingFeedback() {
  const { data } = await axios.get(`${BASE_URL}${FEEDBACK_API_BASE}/pending`, {
    headers: userUuidHeader(),
    timeout: 20_000,
  });
  return unwrap(data);
}

export async function submitFeedback(payload, headers) {
  const { data } = await axios.post(`${BASE_URL}${FEEDBACK_API_BASE}`, payload, {
    headers: headers || userUuidHeader(),
    timeout: 20_000,
    // 429 comes back with a meta message; let unwrap surface it.
    validateStatus: (s) => s < 500,
  });
  return unwrap(data);
}

/** Pacing (≤1 prompt / 24 h, quiet after 2 dismissals in 30 days) is decided server-side from these. */
export async function recordFeedbackPromptEvent({ jobId, jobType = "converter", event, source }, headers) {
  try {
    await axios.post(
      `${BASE_URL}${FEEDBACK_API_BASE}/prompt-event`,
      { job_id: jobId, job_type: jobType, event, source },
      { headers: headers || userUuidHeader(), timeout: 10_000, validateStatus: (s) => s < 500 },
    );
  } catch {
    // Pacing is best-effort; never surface this to the user.
  }
}
