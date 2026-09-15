import axios from "axios";
import { BASE_URL } from "@/config";

const UPLOAD_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 1_500;
const STATUS_REQUEST_TIMEOUT_MS = 60_000;
const MAX_POLL_TRANSIENT_ERRORS = 24;

export function getOrCreateStepBomUuid() {
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
  const uuid = getOrCreateStepBomUuid();
  return uuid ? { "user-uuid": uuid } : {};
}

function unwrap(data) {
  if (!data?.meta?.success) {
    const msg = data?.meta?.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data.data;
}

export async function uploadStepBomFile(file, onPhase) {
  if (!file) throw new Error("No file selected");
  const uuid = getOrCreateStepBomUuid();
  const formData = new FormData();
  formData.append("file", file);
  onPhase?.("upload");
  const { data } = await axios.post("/api/step-bom-upload", formData, {
    headers: { "user-uuid": uuid },
    timeout: UPLOAD_TIMEOUT_MS + 60_000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  return unwrap(data);
}

export async function getStepBomStatus(jobId) {
  const headers = userUuidHeader();
  try {
    const { data } = await axios.get(`/api/step-bom-status/${jobId}`, {
      headers,
      timeout: STATUS_REQUEST_TIMEOUT_MS,
    });
    return unwrap(data);
  } catch (err) {
    const { data } = await axios.get(`${BASE_URL}/v1/cad-step-bom/status/${jobId}`, {
      headers,
      timeout: STATUS_REQUEST_TIMEOUT_MS,
    });
    return unwrap(data);
  }
}

export async function pollStepBomJob(jobId, { onUpdate, signal } = {}) {
  let transientErrors = 0;
  while (!signal?.aborted) {
    try {
      const payload = await getStepBomStatus(jobId);
      const job = payload?.job || payload;
      onUpdate?.(job);
      if (job?.status === "COMPLETED" || job?.status === "FAILED") return job;
      transientErrors = 0;
    } catch (err) {
      transientErrors += 1;
      if (transientErrors > MAX_POLL_TRANSIENT_ERRORS) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  throw new Error("Polling cancelled");
}
