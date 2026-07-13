/**
 * GD&T pipeline — separate from TechDraw (`cadDrawingPipelineApi.js`).
 * Base: ${BASE_URL}/v1/cad-gdandt/*
 */
import axios from "axios";
import { BASE_URL } from "@/config";

export const GDT_API_BASE = "/v1/cad-gdandt";

const UPLOAD_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 3_000;
const STATUS_REQUEST_TIMEOUT_MS = 60_000;
const MAX_POLL_TRANSIENT_ERRORS = 24;

export function getOrCreateGdtUuid() {
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
  const uuid = getOrCreateGdtUuid();
  return uuid ? { "user-uuid": uuid } : {};
}

function assertUuid() {
  if (!BASE_URL) {
    throw new Error("App API URL is not configured (NEXT_PUBLIC_BASE_URL).");
  }
  const uuid = getOrCreateGdtUuid();
  if (!uuid) {
    throw new Error("Session not ready. Refresh the page and try again.");
  }
}

function unwrap(data) {
  if (!data?.meta?.success) {
    const msg = data?.meta?.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data.data;
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

export class GdtPollError extends Error {
  constructor(message, { jobId, job, transient = false } = {}) {
    super(message);
    this.name = "GdtPollError";
    this.jobId = jobId;
    this.job = job;
    this.transient = transient;
  }
}

function isTransientPollError(err) {
  if (err instanceof GdtPollError) return err.transient;
  if (axios.isAxiosError(err)) {
    const code = err.code;
    if (code === "ECONNABORTED" || code === "ERR_NETWORK" || code === "ETIMEDOUT") return true;
    const status = err.response?.status;
    if (status === 502 || status === 503 || status === 504 || status === 429) return true;
  }
  return false;
}

export async function getGdtUploadUrl(fileName, filesize) {
  assertUuid();
  const { data } = await axios.post(
    `${BASE_URL}${GDT_API_BASE}/upload-url`,
    { file_name: fileName, filesize },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function uploadGdtStepToS3(putUrl, file) {
  if (!putUrl) throw new Error("Upload URL missing from server.");
  try {
    await axios.put(putUrl, file, {
      headers: { "Content-Type": "application/step" },
      timeout: UPLOAD_TIMEOUT_MS,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  } catch (err) {
    if (axios.isAxiosError(err) && !err.response) {
      throw new Error(
        "Could not upload the STEP file to storage (often CORS on the S3 bucket).",
      );
    }
    throw new Error(formatApiError(err, "STEP file upload failed."));
  }
}

export async function checkGdtEligibility() {
  assertUuid();
  const { data } = await axios.get(`${BASE_URL}${GDT_API_BASE}/check-eligibility`, {
    headers: userUuidHeader(),
    timeout: 30_000,
  });
  return unwrap(data);
}

/**
 * @param {object} payload
 * @param {string} payload.title
 * @param {string} [payload.description]
 * @param {string} payload.input_file_url
 * @param {string} payload.s3_bucket
 * @param {string} payload.file_name
 * @param {string} [payload.selected_part_id]
 * @param {object} [payload.user_gdt] optional tolerances / datums
 */
export async function submitGdtJob(payload) {
  assertUuid();
  const { data } = await axios.post(`${BASE_URL}${GDT_API_BASE}/submit`, payload, {
    headers: userUuidHeader(),
    timeout: 60_000,
  });
  return unwrap(data);
}

export async function getGdtJobStatus(jobId) {
  assertUuid();
  const { data } = await axios.get(`${BASE_URL}${GDT_API_BASE}/status/${jobId}`, {
    headers: userUuidHeader(),
    timeout: STATUS_REQUEST_TIMEOUT_MS,
  });
  return unwrap(data);
}

export async function listGdtJobs(limit = 20) {
  assertUuid();
  const { data } = await axios.get(`${BASE_URL}${GDT_API_BASE}/jobs`, {
    headers: userUuidHeader(),
    params: { limit },
    timeout: 30_000,
  });
  return unwrap(data);
}

/** Build user_gdt object from form fields; omit blanks so Qwen fills them. */
export function buildUserGdtFromForm(fields = {}) {
  const out = {};
  const numKeys = [
    "flatness_mm",
    "perpendicularity_mm",
    "position_default_mm",
    "profile_surface_mm",
  ];
  for (const key of numKeys) {
    const raw = fields[key];
    if (raw === undefined || raw === null || String(raw).trim() === "") continue;
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) out[key] = n;
  }
  if (fields.hole_fit && String(fields.hole_fit).trim()) {
    out.hole_fit = String(fields.hole_fit).trim();
  }
  if (fields.datum_a || fields.datum_b || fields.datum_c) {
    const datums = {};
    if (fields.datum_a) datums.A = String(fields.datum_a).trim();
    if (fields.datum_b) datums.B = String(fields.datum_b).trim();
    if (fields.datum_c) datums.C = String(fields.datum_c).trim();
    if (Object.keys(datums).length) out.datums = datums;
  }
  return Object.keys(out).length ? out : undefined;
}

export async function uploadAndSubmitGdtJob({
  file,
  title,
  description,
  selectedPartId,
  userGdt,
  onPhase,
}) {
  const phase = (p) => {
    if (typeof onPhase === "function") onPhase(p);
  };
  phase("requesting_upload_url");
  const upload = await getGdtUploadUrl(file.name, file.size);
  phase("uploading");
  await uploadGdtStepToS3(upload.put_url, file);
  phase("submitting");
  const body = {
    title: title || file.name,
    description: description || "",
    input_file_url: upload.input_file_url,
    s3_bucket: upload.s3_bucket,
    file_name: file.name,
  };
  if (selectedPartId) body.selected_part_id = selectedPartId;
  if (userGdt) body.user_gdt = userGdt;
  const result = await submitGdtJob(body);
  phase("queued");
  return result;
}

export async function pollGdtJobUntilDone(jobId, { signal, onUpdate } = {}) {
  let transientErrors = 0;
  while (true) {
    if (signal?.aborted) {
      throw new GdtPollError("Polling cancelled", { jobId, transient: true });
    }
    try {
      const data = await getGdtJobStatus(jobId);
      const job = data?.job;
      if (typeof onUpdate === "function") onUpdate(job);
      const status = job?.status;
      if (status === "COMPLETED" || status === "FAILED") {
        return job;
      }
      transientErrors = 0;
    } catch (err) {
      if (isTransientPollError(err)) {
        transientErrors += 1;
        if (transientErrors > MAX_POLL_TRANSIENT_ERRORS) {
          throw new GdtPollError(
            "Lost connection while waiting for GD&T job. Refresh to check status.",
            { jobId, transient: true },
          );
        }
      } else {
        throw err;
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

export function gdtPipelineStatusPath(jobId) {
  return `/dashboard/gdt-pipeline/status/${jobId}`;
}

export function gdtUploadPath() {
  return "/tools/gdt-pipeline";
}
