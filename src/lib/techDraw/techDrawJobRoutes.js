import { isLikelyPostSuccessInfraFailure } from "@/api/cadDrawingPipelineStages";

export function isTechDrawJobComplete(job) {
  if (!job) return false;
  if (String(job.status || "").toUpperCase() === "COMPLETED") return true;
  return isLikelyPostSuccessInfraFailure(job);
}

export function techDrawPipelineStatusPath(jobId) {
  const id = String(jobId || "").trim();
  return `/dashboard/2d-technical-drawing/${encodeURIComponent(id)}`;
}

export function techDrawDesignPath(jobId) {
  const id = String(jobId || "").trim();
  return `/dashboard/2d-technical-drawing/design/${encodeURIComponent(id)}`;
}

/** Dashboard card / deep link — completed → design page, else pipeline status. */
export function techDrawJobHref(job) {
  const id = String(job?._id || job?.id || "").trim();
  if (!id) return techDrawPipelineStatusPath("");
  if (isTechDrawJobComplete(job)) return techDrawDesignPath(id);
  return techDrawPipelineStatusPath(id);
}
