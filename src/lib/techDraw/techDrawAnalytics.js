/**
 * Google Analytics events for the CAD TechDraw pipeline (upload, payment, progress).
 * Uses sendGAtagEvent from common.helper with event_category CAD_2D_DRAWING_EVENT.
 */
import { sendGAtagEvent } from "@/common.helper";
import { CAD_2D_DRAWING_EVENT } from "@/config";

const CATEGORY = CAD_2D_DRAWING_EVENT;

function track(event_name, params = {}) {
  sendGAtagEvent({
    event_name,
    event_category: CATEGORY,
    ...params,
  });
}

function fileSizeMb(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round((n / (1024 * 1024)) * 10) / 10;
}

function flowTypeFromEligibility(eligibility) {
  if (!eligibility) return "unknown";
  return eligibility.free_run_available ? "free" : "paid";
}

function flowTypeFromJob(job) {
  if (!job) return "unknown";
  if (job.is_free_run || job.payment_status === "free") return "free";
  if (job.payment_status === "paid") return "paid";
  return "unknown";
}

/** User selected a valid STEP/STP file on the upload page. */
export function trackTechDrawFileSelected(file) {
  if (!file) return;
  track("techdraw_file_selected", {
    file_name: file.name || "",
    file_size_mb: fileSizeMb(file.size),
  });
}

/** File rejected (wrong type or over size limit). */
export function trackTechDrawFileRejected(reason) {
  track("techdraw_file_rejected", {
    reject_reason: reason || "unknown",
  });
}

/** Upload pipeline phase (upload-url, s3-upload, submit). */
export function trackTechDrawUploadPhase(phase) {
  track("techdraw_upload_phase", {
    phase: phase || "",
  });
}

/** User clicked submit — upload / payment flow starting. */
export function trackTechDrawUploadStart({ flowType, file }) {
  track("techdraw_upload_start", {
    flow_type: flowType || "unknown",
    file_size_mb: file ? fileSizeMb(file.size) : 0,
  });
}

/** STEP uploaded and job row created (before redirect to status page). */
export function trackTechDrawUploadSuccess({ flowType, jobId, file }) {
  track("techdraw_upload_success", {
    flow_type: flowType || "unknown",
    job_id: jobId || "",
    file_size_mb: file ? fileSizeMb(file.size) : 0,
  });
}

/** Upload or job creation failed on the upload page. */
export function trackTechDrawUploadFailed({ flowType, errorMessage }) {
  track("techdraw_upload_failed", {
    flow_type: flowType || "unknown",
    error_message: String(errorMessage || "").slice(0, 200),
  });
}

/** User entered paid flow — about to create Razorpay order. */
export function trackTechDrawPaymentInitiated({ jobId } = {}) {
  track("techdraw_payment_initiated", {
    job_id: jobId || "",
  });
}

/** Razorpay order created on server. */
export function trackTechDrawPaymentOrderCreated({ orderId, amount, currency }) {
  track("techdraw_payment_order_created", {
    order_id: orderId || "",
    amount: amount != null ? String(amount) : "",
    currency: currency || "USD",
  });
}

/** Razorpay checkout modal opened. */
export function trackTechDrawPaymentCheckoutOpened({ orderId }) {
  track("techdraw_payment_checkout_opened", {
    order_id: orderId || "",
  });
}

/** Payment verified on server after Razorpay success. */
export function trackTechDrawPaymentCompleted({ orderId, paymentId, jobId } = {}) {
  track("techdraw_payment_completed", {
    order_id: orderId || "",
    payment_id: paymentId || "",
    job_id: jobId || "",
  });
}

/** Payment verification failed or Razorpay handler error. */
export function trackTechDrawPaymentFailed({ orderId, errorMessage, stage }) {
  track("techdraw_payment_failed", {
    order_id: orderId || "",
    error_message: String(errorMessage || "").slice(0, 200),
    failure_stage: stage || "unknown",
  });
}

/** User closed Razorpay modal without paying. */
export function trackTechDrawPaymentCancelled({ orderId } = {}) {
  track("techdraw_payment_cancelled", {
    order_id: orderId || "",
  });
}

/** Standard page view for TechDraw upload, dashboard, pipeline status, and library pages. */
export function trackTechDrawPageView({ pageType, jobId, designId, job } = {}) {
  track("2d_technical_page_viewed", {
    event_type: "page_view",
    page_type: pageType || "",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    job_id: jobId || "",
    design_id: designId || "",
    job_status: job?.status || "",
    flow_type: flowTypeFromJob(job),
  });
}

/** Job entered live processing (poll started or status PROCESSING). */
export function trackTechDrawPipelineProgress({ jobId, job }) {
  track("techdraw_pipeline_progress", {
    job_id: jobId || "",
    job_status: job?.status || "PROCESSING",
    pipeline_stage: job?.pipeline_stage || "",
    flow_type: flowTypeFromJob(job),
  });
}

/** Pipeline finished successfully. */
export function trackTechDrawPipelineSuccess({ jobId, job }) {
  track("techdraw_pipeline_success", {
    job_id: jobId || "",
    flow_type: flowTypeFromJob(job),
    output_s3_prefix: job?.output_s3_prefix || "",
  });
}

/** Pipeline failed on the server. */
export function trackTechDrawPipelineFailed({ jobId, job, errorMessage }) {
  track("techdraw_pipeline_failed", {
    job_id: jobId || "",
    flow_type: flowTypeFromJob(job),
    error_message: String(
      errorMessage || job?.error_message || "",
    ).slice(0, 200),
  });
}

export { flowTypeFromEligibility, flowTypeFromJob };
