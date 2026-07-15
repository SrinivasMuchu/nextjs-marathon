/**
 * CAD TechDraw pipeline — matches marathon/api_server cadTechDrawPipeline routes.
 * Base: POST/GET ${BASE_URL}/v1/cad-techdraw/*
 */
import axios from "axios";
import { BASE_URL } from "@/config";
import { techDrawUserJobCdnBase } from "@/lib/techDraw/fetchTechDrawBundleFromPrefix";

export const TECHDRAW_API_BASE = "/v1/cad-techdraw";

/** List price shown in UI when API omits fields (keep in sync with TECHDRAW_JOB_PRICE_USD). */
export const TECHDRAW_BASE_PRICE_USD = 4.99;
const TECHDRAW_GST_RATE = 0.18;

/** Display price for TechDraw (base USD; server may add tax at checkout). */
export function formatTechDrawPrice(amount, currency = "USD") {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

/** Normalized labels for banners, buttons, and Razorpay copy (always $4.99 list price). */
export function getTechDrawPriceDisplay() {
  const currency = "USD";
  const base = TECHDRAW_BASE_PRICE_USD;
  const total = Math.round(base * (1 + TECHDRAW_GST_RATE) * 100) / 100;
  return {
    base,
    total,
    currency,
    baseLabel: formatTechDrawPrice(base, currency),
    totalLabel: formatTechDrawPrice(total, currency),
    perSetLabel: `${formatTechDrawPrice(base, currency)} per drawing set`,
  };
}

const UPLOAD_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 3_000;
const STATUS_REQUEST_TIMEOUT_MS = 60_000;
const MAX_POLL_TRANSIENT_ERRORS = 24;

/** Same anonymous session pattern as cad-renderer / cad-uploading tools. */
export function getOrCreateTechDrawUuid() {
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
  const uuid = getOrCreateTechDrawUuid();
  return uuid ? { "user-uuid": uuid } : {};
}

function assertUuid() {
  if (!BASE_URL) {
    throw new Error("App API URL is not configured (NEXT_PUBLIC_BASE_URL).");
  }
  const uuid = getOrCreateTechDrawUuid();
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

/** Thrown when polling stops; `transient` means the job may still be PROCESSING on the server. */
export class TechDrawPollError extends Error {
  constructor(message, { jobId, job, transient = false } = {}) {
    super(message);
    this.name = "TechDrawPollError";
    this.jobId = jobId;
    this.job = job;
    this.transient = transient;
  }
}

function isTransientPollError(err) {
  if (err instanceof TechDrawPollError) return err.transient;
  if (axios.isAxiosError(err)) {
    const code = err.code;
    if (code === "ECONNABORTED" || code === "ERR_NETWORK" || code === "ETIMEDOUT") return true;
    const status = err.response?.status;
    if (status === 502 || status === 503 || status === 504 || status === 429) return true;
  }
  return false;
}

export async function getTechDrawUploadUrl(fileName, filesize) {
  assertUuid();
  const { data } = await axios.post(
    `${BASE_URL}${TECHDRAW_API_BASE}/upload-url`,
    { file_name: fileName, filesize },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function uploadStepToS3(putUrl, file) {
  if (!putUrl) {
    throw new Error("Upload URL missing from server.");
  }
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
        "Could not upload the STEP file to storage (browser blocked the request — often CORS on the S3 bucket). Try again or use another network.",
      );
    }
    throw new Error(formatApiError(err, "STEP file upload failed."));
  }
}

export async function checkTechDrawEligibility() {
  assertUuid();
  const { data } = await axios.get(`${BASE_URL}${TECHDRAW_API_BASE}/check-eligibility`, {
    headers: userUuidHeader(),
    timeout: 30_000,
  });
  return unwrap(data);
}

export async function submitTechDrawJob({
  title,
  description,
  input_file_url,
  s3_bucket,
  file_name,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  original_failed_job_id,
}) {
  assertUuid();
  const { data } = await axios.post(
    `${BASE_URL}${TECHDRAW_API_BASE}/submit`,
    {
      title,
      description,
      input_file_url,
      s3_bucket,
      file_name,
      ...(original_failed_job_id ? { original_failed_job_id } : {}),
      ...(razorpay_order_id
        ? { razorpay_order_id, razorpay_payment_id, razorpay_signature }
        : {}),
    },
    { headers: userUuidHeader(), timeout: 60_000 },
  );
  return unwrap(data);
}

/** Razorpay checkout only — no job row until submit after payment. */
export async function createTechDrawOrder(jobId, billingId) {
  assertUuid();
  if (!billingId) {
    throw new Error("Billing address is required before payment.");
  }
  const { data } = await axios.post(
    `${BASE_URL}${TECHDRAW_API_BASE}/create-order`,
    {
      billing_id: billingId,
      ...(jobId ? { job_id: jobId } : {}),
    },
    { headers: userUuidHeader(), timeout: 30_000 },
  );
  return unwrap(data);
}

export async function verifyTechDrawPayment({
  job_id,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  assertUuid();
  const { data } = await axios.post(
    `${BASE_URL}${TECHDRAW_API_BASE}/verify-payment`,
    {
      ...(job_id ? { job_id } : {}),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    },
    { headers: userUuidHeader(), timeout: 60_000 },
  );
  return unwrap(data);
}

export async function getTechDrawJobStatus(jobId) {
  assertUuid();
  const { data } = await axios.get(`${BASE_URL}${TECHDRAW_API_BASE}/status/${jobId}`, {
    headers: userUuidHeader(),
    timeout: STATUS_REQUEST_TIMEOUT_MS,
  });
  return unwrap(data);
}

/**
 * Poll /status until COMPLETED or FAILED. Retries transient network/API errors.
 */
export async function pollTechDrawJobUntilDone(jobId, opts = {}) {
  let consecutiveErrors = 0;

  while (true) {
    if (opts.signal?.aborted) {
      throw new TechDrawPollError("Polling cancelled", { jobId, transient: true });
    }

    try {
      const { job } = await getTechDrawJobStatus(jobId);
      consecutiveErrors = 0;
      opts.onJob?.(job);

      if (job?.status === "COMPLETED") {
        return job;
      }

      if (job?.status === "FAILED") {
        throw new TechDrawPollError(job.error_message || "Pipeline failed on the server.", {
          jobId,
          job,
          transient: false,
        });
      }
    } catch (err) {
      if (err instanceof TechDrawPollError && !err.transient) {
        throw err;
      }

      consecutiveErrors += 1;
      if (consecutiveErrors >= MAX_POLL_TRANSIENT_ERRORS) {
        throw new TechDrawPollError(
          "Could not reach the status API. The pipeline may still be running on the server — use Check status.",
          { jobId, transient: true },
        );
      }

      if (!isTransientPollError(err) && !(err instanceof TechDrawPollError)) {
        throw new TechDrawPollError(err?.message || "Status check failed", {
          jobId,
          transient: consecutiveErrors < MAX_POLL_TRANSIENT_ERRORS,
        });
      }
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

/** Upload STEP and create job via same-origin API proxy (avoids S3 CORS). */
async function prepareCadDrawingJobViaProxy({
  file,
  title,
  description,
  original_failed_job_id,
  onPhase,
}) {
  const uuid = getOrCreateTechDrawUuid();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title || file.name);
  formData.append("description", description || "");
  if (original_failed_job_id) {
    formData.append("original_failed_job_id", original_failed_job_id);
  }

  onPhase?.("upload-url");
  onPhase?.("s3-upload");
  onPhase?.("submit");

  const { data } = await axios.post("/api/techdraw-upload-step", formData, {
    headers: { "user-uuid": uuid },
    timeout: UPLOAD_TIMEOUT_MS + 60_000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  if (!data?.meta?.success) {
    const msg = data?.meta?.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  return data.data;
}

/** Upload STEP and create job in DB (free run, free retry, or after Razorpay payment). */
export async function uploadAndSubmitTechDrawJob({
  file,
  title = "",
  description = "",
  payment,
  original_failed_job_id,
  onPhase,
}) {
  if (!file) throw new Error("No file selected");
  assertUuid();

  onPhase?.("upload-url");
  const upload = await getTechDrawUploadUrl(file.name, file.size);
  onPhase?.("s3-upload");
  await uploadStepToS3(upload.put_url, file);
  onPhase?.("submit");
  const submit = await submitTechDrawJob({
    title: title || file.name,
    description,
    input_file_url: upload.input_file_url,
    s3_bucket: upload.s3_bucket,
    file_name: upload.file_name,
    original_failed_job_id,
    ...(payment || {}),
  });
  return String(submit.job_id);
}

/**
 * Paid: details stay in client state until after payment.
 * Free: upload + create job immediately.
 */
export async function prepareCadDrawingJob({
  file,
  title = "",
  description = "",
  requiresPayment = false,
  original_failed_job_id,
  onPhase,
}) {
  if (!file) throw new Error("No file selected");
  assertUuid();

  const prices = getTechDrawPriceDisplay();

  if (requiresPayment && !original_failed_job_id) {
    return { needsPayment: true, prices };
  }

  let jobId;
  try {
    jobId = await uploadAndSubmitTechDrawJob({
      file,
      title,
      description,
      original_failed_job_id,
      onPhase,
    });
  } catch (proxyErr) {
    const proxyMsg = formatApiError(proxyErr, "");
    if (proxyMsg && !/network|fetch|timeout|502|503|504/i.test(proxyMsg)) {
      throw proxyErr;
    }
    jobId = await prepareCadDrawingJobViaProxy({
      file,
      title,
      description,
      original_failed_job_id,
      onPhase,
    }).then((d) => String(d.job_id));
  }

  return { needsPayment: false, jobId, prices, isFreeRetry: Boolean(original_failed_job_id) };
}

export async function startCadDrawingPipeline({ file, title = "", description = "", onPhase }) {
  const prep = await prepareCadDrawingJob({ file, title, description, onPhase });
  if (prep.needsPayment) {
    return prep;
  }

  onPhase?.("processing");
  const job = await pollTechDrawJobUntilDone(prep.jobId, {
    onJob: (j) => onPhase?.("status", j),
  });

  return { needsPayment: false, job, jobId: prep.jobId };
}

export async function resumeCadDrawingPipelineAfterPayment(jobId, onPhase) {
  onPhase?.("processing");
  const job = await pollTechDrawJobUntilDone(jobId, {
    onJob: (j) => onPhase?.("status", j),
  });
  return { job, jobId };
}

export async function waitForTechDrawJob(jobId, onPhase) {
  onPhase?.("processing");
  const job = await pollTechDrawJobUntilDone(jobId, {
    onJob: (j) => onPhase?.("status", j),
  });
  return { job, jobId };
}

/** CloudFront base for a completed user TechDraw job: …/user-freecad-techdraw/{jobId}. */
export function techDrawOutputBaseUrl(job) {
  return techDrawUserJobCdnBase(job?._id || job?.id);
}

const TECHDRAW_SHEET_COUNT = 5;

const SCREENSHOT_FILES = [
  "front_view.png",
  "top_view.png",
  "left_view.png",
  "right_view.png",
  "isometric_view.png",
  "front_hidden_view.png",
];

function extFromPath(path) {
  const m = path.match(/\.([^.]+)$/);
  return m ? m[1].toLowerCase() : "file";
}

/** Per-sheet PDF/SVG/DXF links for the preview grid. */
export function sheetDownloadsFromJob(job) {
  const base = techDrawOutputBaseUrl(job);
  if (!base) return [];

  return Array.from({ length: TECHDRAW_SHEET_COUNT }, (_, i) => {
    const n = i + 1;
    return {
      sheetNum: n,
      pdfHref: `${base}/sheet_${n}.pdf`,
      svgHref: `${base}/svg/sheet_${n}.svg`,
      dxfHref: `${base}/dxf/sheet_${n}.dxf`,
    };
  });
}

/** All downloadable artifacts under user-freecad-techdraw/{jobId} on CloudFront. */
export function outputItemsFromJob(job) {
  const base = techDrawOutputBaseUrl(job);
  if (!base) return [];

  const entries = [
    { path: "technical_drawing_simple.pdf", label: "Complete drawing (PDF)" },
    { path: "technical_drawing_simple.FCStd", label: "FreeCAD project (.FCStd)" },
    ...Array.from({ length: TECHDRAW_SHEET_COUNT }, (_, i) => ({
      path: `sheet_${i + 1}.pdf`,
      label: `Sheet ${i + 1} (PDF)`,
    })),
    ...Array.from({ length: TECHDRAW_SHEET_COUNT }, (_, i) => ({
      path: `svg/sheet_${i + 1}.svg`,
      label: `Sheet ${i + 1} (SVG)`,
    })),
    ...Array.from({ length: TECHDRAW_SHEET_COUNT }, (_, i) => ({
      path: `dxf/sheet_${i + 1}.dxf`,
      label: `Sheet ${i + 1} (DXF)`,
    })),
    { path: "geometry_per_sheet.json", label: "Geometry per sheet" },
    { path: "dimension_specs.json", label: "Dimension specs" },
    { path: "view_selection_response.json", label: "View selection (LLM)" },
    { path: "drawing_config_simple.py", label: "Drawing config" },
    { path: "llm_usage_log.jsonl", label: "LLM usage log" },
    ...SCREENSHOT_FILES.map((path) => ({
      path: `screenshots/${path}`,
      label: path.replace(/_/g, " ").replace(/\.png$/i, ""),
    })),
  ];

  return entries.map(({ path, label }) => ({
    ext: extFromPath(path),
    name: label,
    fileName: path,
    href: `${base}/${path}`,
    size: "",
  }));
}

export function countTechDrawSheets(job) {
  if (!techDrawOutputBaseUrl(job)) return 0;
  return TECHDRAW_SHEET_COUNT;
}
