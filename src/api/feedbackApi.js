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

/** Flow 11: store result_viewed / paywall_shown / paywall_closed on the job; drawings also record `downloaded`. */
export async function recordFeedbackJobEvent({ jobId, jobType = "converter", event }) {
  if (!jobId) return;
  try {
    await axios.post(
      `${BASE_URL}${FEEDBACK_API_BASE}/job-event`,
      { job_id: jobId, job_type: jobType, event },
      { headers: userUuidHeader(), timeout: 10_000, validateStatus: (s) => s < 500 },
    );
  } catch {
    // Best-effort; GA4 has the same event.
  }
}

/** 11d: never-downloaded files on their last day before deletion. */
export async function getAbandonedFiles() {
  const { data } = await axios.get(`${BASE_URL}${FEEDBACK_API_BASE}/abandoned`, {
    headers: userUuidHeader(),
    timeout: 20_000,
  });
  return unwrap(data) || [];
}

/** Flow 6: permission to quote a 4–5 review. */
export async function submitTestimonial(payload) {
  const { data } = await axios.post(`${BASE_URL}${FEEDBACK_API_BASE}/testimonial`, payload, {
    headers: userUuidHeader(),
    timeout: 20_000,
    validateStatus: (s) => s < 500,
  });
  return unwrap(data);
}

export async function getMyTestimonials() {
  const { data } = await axios.get(`${BASE_URL}${FEEDBACK_API_BASE}/testimonials`, {
    headers: userUuidHeader(),
    timeout: 20_000,
  });
  return unwrap(data) || [];
}

export async function withdrawTestimonial(id) {
  const { data } = await axios.post(`${BASE_URL}${FEEDBACK_API_BASE}/testimonials/${encodeURIComponent(id)}/withdraw`, {}, {
    headers: userUuidHeader(),
    timeout: 20_000,
  });
  return unwrap(data);
}

/** Flow 7: G2 invite card. */
export async function getReviewInvite() {
  const { data } = await axios.get(`${BASE_URL}${FEEDBACK_API_BASE}/review-invite`, {
    headers: userUuidHeader(),
    timeout: 20_000,
  });
  return unwrap(data);
}

export async function recordReviewInviteEvent(event) {
  try {
    await axios.post(`${BASE_URL}${FEEDBACK_API_BASE}/review-invite/event`, { event }, {
      headers: userUuidHeader(),
      timeout: 10_000,
      validateStatus: (s) => s < 500,
    });
  } catch {
    // best-effort
  }
}

/** Flow 4c: the email rating page. Opening it never saves; only Save does. */
export async function getEmailRatingContext(token, rating) {
  const { data } = await axios.get(`${BASE_URL}${FEEDBACK_API_BASE}/email/context`, {
    params: { t: token, r: rating || undefined },
    timeout: 20_000,
  });
  return unwrap(data);
}

export async function submitEmailRating(payload) {
  const { data } = await axios.post(`${BASE_URL}${FEEDBACK_API_BASE}/email`, payload, {
    timeout: 20_000,
    validateStatus: (s) => s < 500,
  });
  return unwrap(data);
}
