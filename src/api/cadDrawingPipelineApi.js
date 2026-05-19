/**
 * CAD TechDraw pipeline — matches marathon/api_server cadTechDrawPipeline routes.
 * Base: POST/GET ${BASE_URL}/v1/cad-techdraw/*
 */
import axios from "axios";
import { BASE_URL, DESIGN_GLB_PREFIX_URL } from "@/config";

export const TECHDRAW_API_BASE = "/v1/cad-techdraw";

const UPLOAD_TIMEOUT_MS = 120_000;
const POLL_INTERVAL_MS = 5_000;
const STATUS_REQUEST_TIMEOUT_MS = 60_000;
const MAX_POLL_TRANSIENT_ERRORS = 24;

function userUuidHeader() {
  if (typeof window === "undefined") return {};
  const uuid = localStorage.getItem("uuid");
  return uuid ? { "user-uuid": uuid } : {};
}

function assertUuid() {
  const uuid = typeof window !== "undefined" ? localStorage.getItem("uuid") : null;
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
  await axios.put(putUrl, file, {
    headers: { "Content-Type": "application/step" },
    timeout: UPLOAD_TIMEOUT_MS,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}

export async function checkTechDrawEligibility() {
  assertUuid();
  const { data } = await axios.get(`${BASE_URL}${TECHDRAW_API_BASE}/check-eligibility`, {
    headers: userUuidHeader(),
    timeout: 30_000,
  });
  return unwrap(data);
}

export async function submitTechDrawJob({ title, description, input_file_url, s3_bucket, file_name }) {
  assertUuid();
  const { data } = await axios.post(
    `${BASE_URL}${TECHDRAW_API_BASE}/submit`,
    { title, description, input_file_url, s3_bucket, file_name },
    { headers: userUuidHeader(), timeout: 60_000 },
  );
  return unwrap(data);
}

export async function createTechDrawOrder(jobId) {
  assertUuid();
  const { data } = await axios.post(
    `${BASE_URL}${TECHDRAW_API_BASE}/create-order`,
    { job_id: jobId },
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
    { job_id, razorpay_order_id, razorpay_payment_id, razorpay_signature },
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

/** Upload STEP and create job (does not poll). */
export async function prepareCadDrawingJob({ file, title = "", description = "", onPhase }) {
  if (!file) throw new Error("No file selected");

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
  });

  const jobId = String(submit.job_id);

  if (submit.requires_payment) {
    return {
      needsPayment: true,
      jobId,
      price: submit.price,
      currency: submit.currency,
    };
  }

  return { needsPayment: false, jobId };
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

/** CloudFront base for a completed TechDraw job (prefix includes user-freecad-techdraw/{id}). */
export function techDrawOutputBaseUrl(job) {
  const prefix = job?.output_s3_prefix;
  if (!prefix || typeof prefix !== "string") return "";
  return `${DESIGN_GLB_PREFIX_URL.replace(/\/$/, "")}/${prefix.replace(/^\//, "")}`;
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

/** All downloadable artifacts under output_s3_prefix on CloudFront. */
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
