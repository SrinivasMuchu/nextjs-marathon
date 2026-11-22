/**
 * Ask the global <FeedbackHost/> to show the rating corner card for a job.
 * The host checks with the server whether this user should be asked now (sample files,
 * already rated, one prompt per 24 h, quiet after 2 dismissals) and shows nothing otherwise.
 */
export const FEEDBACK_PROMPT_EVENT = "marathon:feedback-prompt";

/** The corner card appears this long after a download starts. */
export const FEEDBACK_PROMPT_DELAY_MS = 3000;

// Jobs whose stars are already on screen (e.g. the paid success modal): no corner card for them.
const inlineJobs = new Set();

export function markFeedbackInline(jobId) {
  if (!jobId) return () => {};
  const id = String(jobId);
  inlineJobs.add(id);
  return () => inlineJobs.delete(id);
}

export function requestFeedbackPrompt({ jobId, jobType = "converter", source = "post_download_card" }) {
  if (typeof window === "undefined" || !jobId) return;
  if (inlineJobs.has(String(jobId))) return;
  window.dispatchEvent(new CustomEvent(FEEDBACK_PROMPT_EVENT, { detail: { jobId: String(jobId), jobType, source } }));
}

/**
 * Schedule the card `delayMs` after a download starts. Returns cancel(): call it if the download fails
 * before the card shows, so we never ask how a file "turned out" that never arrived.
 */
export function scheduleFeedbackPrompt(args, delayMs = FEEDBACK_PROMPT_DELAY_MS) {
  if (typeof window === "undefined" || !args?.jobId) return () => {};
  const timer = window.setTimeout(() => requestFeedbackPrompt(args), delayMs);
  return () => window.clearTimeout(timer);
}

/** Flow 3 "stopped waiting": the user cancelled while the job still runs on the server. */
export function requestStoppedWaitingPrompt({ jobId, jobType = "converter" }) {
  if (typeof window === "undefined" || !jobId) return;
  window.dispatchEvent(new CustomEvent(FEEDBACK_PROMPT_EVENT, {
    detail: { jobId: String(jobId), jobType, source: "failed_job", kind: "stopped" },
  }));
}

// Drawing sheet previews on screen, so the rating form can offer "Mark the problem" (flow 2b).
const drawingSheets = new Map();

/** sheets: [{ sheet: 1, src: "https://…/svg/sheet_1.svg", label }] */
export function registerDrawingSheets(jobId, sheets) {
  if (!jobId) return () => {};
  const id = String(jobId);
  drawingSheets.set(id, Array.isArray(sheets) ? sheets : []);
  return () => drawingSheets.delete(id);
}

export function getDrawingSheets(jobId) {
  return jobId ? drawingSheets.get(String(jobId)) || [] : [];
}
