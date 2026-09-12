/**
 * CAD Match — similar designs from library DB.
 * Base: ${BASE_URL}/v1/cad-match/*
 */
import axios from "axios";
import { BASE_URL } from "@/config";

export const CAD_MATCH_API_BASE = "/v1/cad-match";

const UPLOAD_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 3_000;
const STATUS_REQUEST_TIMEOUT_MS = 60_000;
const MAX_POLL_TRANSIENT_ERRORS = 24;

export const CAD_MATCH_ALLOWED_EXT =
  /\.(step|stp|stl|obj|ply|off|iges|igs|glb|gltf)$/i;

export function getOrCreateCadMatchUuid() {
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
  const uuid = getOrCreateCadMatchUuid();
  return uuid ? { "user-uuid": uuid } : {};
}

function assertUuid() {
  if (!BASE_URL) {
    throw new Error("App API URL is not configured (NEXT_PUBLIC_BASE_URL).");
  }
  const uuid = getOrCreateCadMatchUuid();
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

export class CadMatchPollError extends Error {
  constructor(message, { jobId, job, transient = false } = {}) {
    super(message);
    this.name = "CadMatchPollError";
    this.jobId = jobId;
    this.job = job;
    this.transient = transient;
  }
}

function isTransientPollError(err) {
  if (err instanceof CadMatchPollError) return err.transient;
  if (axios.isAxiosError(err)) {
    const code = err.code;
    if (code === "ECONNABORTED" || code === "ERR_NETWORK" || code === "ETIMEDOUT") return true;
    const status = err.response?.status;
    if (status === 502 || status === 503 || status === 504 || status === 429) return true;
  }
  return false;
}

function contentTypeForFile(fileName) {
  const ext = String(fileName).split(".").pop()?.toLowerCase();
  if (ext === "stl") return "model/stl";
  if (ext === "glb" || ext === "gltf") return "model/gltf-binary";
  return "application/octet-stream";
}

export async function getCadMatchUploadUrl(fileName) {
  assertUuid();
  const { data } = await axios.post(
    `${BASE_URL}${CAD_MATCH_API_BASE}/upload-url`,
    { file_name: fileName },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function uploadCadMatchFile(putUrl, file) {
  if (!putUrl) throw new Error("Upload URL missing from server.");
  try {
    await axios.put(putUrl, file, {
      headers: { "Content-Type": contentTypeForFile(file.name) },
      timeout: UPLOAD_TIMEOUT_MS,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  } catch (err) {
    if (axios.isAxiosError(err) && !err.response) {
      throw new Error(
        "Could not upload the CAD file to storage (often CORS on the S3 bucket).",
      );
    }
    throw new Error(formatApiError(err, "CAD file upload failed."));
  }
}

export async function submitCadMatchJob({ input_file_url, s3_bucket, file_name }) {
  assertUuid();
  const { data } = await axios.post(
    `${BASE_URL}${CAD_MATCH_API_BASE}/submit`,
    { input_file_url, s3_bucket, file_name },
    { headers: userUuidHeader(), timeout: 60_000 },
  );
  return unwrap(data);
}

export async function getCadMatchJobStatus(jobId) {
  assertUuid();
  if (!jobId) throw new Error("Job id is required.");
  const { data } = await axios.get(
    `${BASE_URL}${CAD_MATCH_API_BASE}/status/${jobId}`,
    { headers: userUuidHeader(), timeout: STATUS_REQUEST_TIMEOUT_MS },
  );
  return unwrap(data);
}

/**
 * Upload + submit. Returns { job_id }.
 */
export async function prepareCadMatchJob({ file, onPhase }) {
  if (!file) throw new Error("Choose a CAD file first.");
  if (!CAD_MATCH_ALLOWED_EXT.test(file.name)) {
    throw new Error(
      "Unsupported file type. Use STEP, STL, OBJ, PLY, OFF, IGES, or GLB.",
    );
  }

  onPhase?.("Getting upload URL…");
  const upload = await getCadMatchUploadUrl(file.name);

  onPhase?.("Uploading CAD file…");
  await uploadCadMatchFile(upload.put_url, file);

  onPhase?.("Starting match…");
  const submitted = await submitCadMatchJob({
    input_file_url: upload.input_file_url,
    s3_bucket: upload.s3_bucket,
    file_name: upload.file_name || file.name,
  });

  const jobId = submitted?.job_id;
  if (!jobId) throw new Error("Match job was not created.");
  return { job_id: jobId, status: submitted.status };
}

/**
 * Poll until COMPLETED or FAILED.
 */
export async function waitForCadMatchJob(jobId, { signal, onUpdate } = {}) {
  let transientErrors = 0;
  while (true) {
    if (signal?.aborted) {
      throw new CadMatchPollError("Polling cancelled.", { jobId, transient: true });
    }
    try {
      const job = await getCadMatchJobStatus(jobId);
      transientErrors = 0;
      onUpdate?.(job);
      const status = String(job?.status || "").toUpperCase();
      if (status === "COMPLETED") return job;
      if (status === "FAILED") {
        throw new CadMatchPollError(
          job?.error_message || "Match failed.",
          { jobId, job, transient: false },
        );
      }
    } catch (err) {
      if (err instanceof CadMatchPollError && !err.transient) throw err;
      if (isTransientPollError(err)) {
        transientErrors += 1;
        if (transientErrors > MAX_POLL_TRANSIENT_ERRORS) {
          throw new CadMatchPollError(
            "Lost connection while matching. Refresh to check status.",
            { jobId, transient: true },
          );
        }
      } else {
        throw new CadMatchPollError(formatApiError(err, "Status check failed."), {
          jobId,
          transient: false,
        });
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

export function cadMatchStatusPath(jobId) {
  return `/dashboard/cad-match/${jobId}`;
}

export function similarityPercent(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return null;
  // Cosine similarity is typically 0–1 for L2-normalized vectors
  const pct = Math.max(0, Math.min(100, Math.round(n * 100)));
  return pct;
}
