/**
 * Part-name / text match POC.
 * Base: ${BASE_URL}/v1/cad-text-match/*
 */
import axios from "axios";
import { BASE_URL } from "@/config";

export const TEXT_MATCH_API_BASE = "/v1/cad-text-match";

const POLL_INTERVAL_MS = 2_000;
const STATUS_REQUEST_TIMEOUT_MS = 60_000;
const MAX_POLL_TRANSIENT_ERRORS = 24;
const MAX_MATCH_WAIT_MS = 5 * 60 * 1000;

export function getOrCreateTextMatchUuid() {
  if (typeof window === "undefined") return "";
  let uuid = localStorage.getItem("uuid");
  if (!uuid) {
    uuid =
      window.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("uuid", uuid);
  }
  return uuid;
}

function userUuidHeader() {
  const uuid = getOrCreateTextMatchUuid();
  return uuid ? { "user-uuid": uuid } : {};
}

function assertUuid() {
  if (!BASE_URL) {
    throw new Error("App API URL is not configured (NEXT_PUBLIC_BASE_URL).");
  }
  const uuid = getOrCreateTextMatchUuid();
  if (!uuid) {
    throw new Error("Session not ready. Refresh the page and try again.");
  }
}

function formatApiError(err, fallback = "Request failed") {
  if (err instanceof Error && !axios.isAxiosError(err)) return err.message;
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.meta?.message;
    if (typeof msg === "string" && msg) return msg;
    if (!err.response) {
      return "Network error — check your connection or try again.";
    }
  }
  return fallback;
}

function unwrap(data) {
  if (!data?.meta?.success) {
    const msg = data?.meta?.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data.data;
}

export class TextMatchPollError extends Error {
  constructor(message, { jobId, job, transient = false } = {}) {
    super(message);
    this.name = "TextMatchPollError";
    this.jobId = jobId;
    this.job = job;
    this.transient = transient;
  }
}

function isTransientPollError(err) {
  if (err instanceof TextMatchPollError) return err.transient;
  if (axios.isAxiosError(err)) {
    const code = err.code;
    if (code === "ECONNABORTED" || code === "ERR_NETWORK" || code === "ETIMEDOUT") {
      return true;
    }
    const status = err.response?.status;
    if (status === 502 || status === 503 || status === 504 || status === 429) return true;
  }
  return false;
}

export async function submitTextMatchJob(partName) {
  assertUuid();
  const query = String(partName || "").trim();
  if (!query) throw new Error("Enter a part name first.");
  if (query.length < 2) throw new Error("Part name must be at least 2 characters.");

  const { data } = await axios.post(
    `${BASE_URL}${TEXT_MATCH_API_BASE}/submit`,
    { part_name: query, query_text: query },
    { headers: userUuidHeader(), timeout: 60_000 },
  );
  return unwrap(data);
}

export async function getTextMatchJobStatus(jobId) {
  assertUuid();
  if (!jobId) throw new Error("Job id is required.");
  const { data } = await axios.get(
    `${BASE_URL}${TEXT_MATCH_API_BASE}/status/${jobId}`,
    { headers: userUuidHeader(), timeout: STATUS_REQUEST_TIMEOUT_MS },
  );
  const payload = unwrap(data);
  return payload?.job || payload;
}

export async function waitForTextMatchJob(
  jobId,
  { signal, onUpdate, startedAt = Date.now() } = {},
) {
  let transientErrors = 0;
  while (true) {
    if (signal?.aborted) {
      throw new TextMatchPollError("Polling cancelled.", { jobId, transient: true });
    }
    if (Date.now() - startedAt > MAX_MATCH_WAIT_MS) {
      throw new TextMatchPollError("Match is taking too long. Refresh or try again.", {
        jobId,
        transient: false,
      });
    }
    try {
      const job = await getTextMatchJobStatus(jobId);
      transientErrors = 0;
      onUpdate?.(job);
      const status = String(job?.status || "").toUpperCase();
      if (status === "COMPLETED") return job;
      if (status === "FAILED") {
        throw new TextMatchPollError(job?.error_message || "Match failed.", {
          jobId,
          job,
          transient: false,
        });
      }
    } catch (err) {
      if (err instanceof TextMatchPollError && !err.transient) throw err;
      if (isTransientPollError(err)) {
        transientErrors += 1;
        if (transientErrors > MAX_POLL_TRANSIENT_ERRORS) {
          throw new TextMatchPollError(
            "Lost connection while matching. Refresh to check status.",
            { jobId, transient: true },
          );
        }
      } else {
        throw new TextMatchPollError(formatApiError(err, "Status check failed."), {
          jobId,
          transient: false,
        });
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

export function textMatchStatusPath(jobId) {
  return `/dashboard/part-name-match/${jobId}`;
}

export function similarityPercent(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return null;
  const pct = Math.max(0, Math.min(100, Math.round(n * 100)));
  return pct > 0 ? pct : null;
}
