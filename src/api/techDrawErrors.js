export const TECHDRAW_ERROR_CODES = {
  DIMENSION_EXTRACTION_FAILED: "DIMENSION_EXTRACTION_FAILED",
  EXPORT_TIMEOUT: "EXPORT_TIMEOUT",
};

export const DIMENSION_EXTRACTION_FAILED_USER_MSG =
  "We could not generate dimensions from your uploaded CAD model because the geometry required for dimension extraction was not detected.";

export const EXPORT_TIMEOUT_USER_MSG =
  "Your drawing took too long to export and was stopped before completion. Try a simpler assembly, or contact support if this keeps happening.";

export const DIMENSION_EXTRACTION_FREE_RETRY_MSG =
  "Upload another CAD file and we will process it free of charge.";

export function isDimensionExtractionFailure(job) {
  const code = job?.error_code || job?.errorCode;
  return code === TECHDRAW_ERROR_CODES.DIMENSION_EXTRACTION_FAILED;
}

export function isExportTimeoutFailure(job) {
  const code = job?.error_code || job?.errorCode;
  return code === TECHDRAW_ERROR_CODES.EXPORT_TIMEOUT;
}

export const PIPELINE_FAILED_USER_MSG =
  "We could not finish generating your technical drawing. You can try again with another CAD file at no extra charge.";

export function isFreeRetryAvailable(job) {
  const status = String(job?.status || "").toUpperCase();
  return (
    status === "FAILED" &&
    Boolean(job?.free_retry_granted) &&
    !job?.free_retry_consumed &&
    job?.free_retry_available !== false &&
    !job?.is_free_retry
  );
}

export function failureModalTitle(job) {
  if (isDimensionExtractionFailure(job)) {
    return "Dimensions could not be generated";
  }
  return "Drawing could not be completed";
}

export function failureUserMessage(job) {
  if (isDimensionExtractionFailure(job)) {
    return DIMENSION_EXTRACTION_FAILED_USER_MSG;
  }
  if (isExportTimeoutFailure(job)) {
    return EXPORT_TIMEOUT_USER_MSG;
  }
  const serverMessage = job?.error_message || job?.message;
  return serverMessage || PIPELINE_FAILED_USER_MSG;
}

export function jobFailurePayload(job) {
  if (!job || String(job.status || "").toUpperCase() !== "FAILED") {
    return null;
  }
  const errorCode = job.error_code || job.errorCode;
  return {
    status: "failed",
    errorCode,
    message: job.error_message || job.message,
    freeRetryAvailable: isFreeRetryAvailable(job),
  };
}
