/**
 * User-facing terminal messages — keep in sync with
 * marathon/api_server/server/scripts/freecad_techdraw_pipeline/console_status.py
 */

import { PIPELINE_STAGE_LABELS } from "@/api/cadDrawingPipelineStages";

export const CONSOLE_STATUS = {
  SUBMITTED: "Your request was received — we will start processing shortly",
  PROCESSING_STARTED: "Processing started on our servers",
  DOWNLOADING_MODEL: "Downloading your 3D model file",

  STEP1_START: "Step 1 of 5 — Capturing views of your 3D model",
  STEP1_FRONT: "Step 1 of 5 — Front view captured ✓",
  STEP1_TOP: "Step 1 of 5 — Top view captured ✓",
  STEP1_LEFT: "Step 1 of 5 — Left view captured ✓",
  STEP1_RIGHT: "Step 1 of 5 — Right side view captured ✓",
  STEP1_ISOMETRIC: "Step 1 of 5 — Isometric (3D) view captured ✓",
  STEP1_HIDDEN: "Step 1 of 5 — Hidden-line view captured ✓",
  STEP1_DONE: "Step 1 of 5 — All model views captured ✓",

  STEP2_START: "Step 2 of 5 — AI is choosing the best views for your technical drawing",
  STEP2_DONE: "Step 2 of 5 — Drawing view layout ready ✓",

  STEP3_START: "Step 3 of 5 — Setting up technical drawing sheets",
  STEP3_DONE: "Step 3 of 5 — Views placed on drawing sheets ✓",

  STEP4_START: "Step 4 of 5 — AI is planning dimensions and measurements",
  STEP4_DONE: "Step 4 of 5 — Measurement plan ready ✓",

  STEP5_ANNOTATING: "Step 5 of 5 — Adding dimensions to your drawing",
  STEP5_SVG_START: "Step 5 of 5 — Creating editable SVG drawing files",
  STEP5_SVG_DONE: "Step 5 of 5 — SVG files created ✓",
  STEP5_PDF_START: "Step 5 of 5 — Creating PDF technical drawing",
  STEP5_PDF_DONE: "Step 5 of 5 — PDF drawing created ✓",
  STEP5_DXF_DONE: "Step 5 of 5 — DXF CAD files created ✓",
  STEP5_DONE: "Step 5 of 5 — Drawing export complete ✓",

  UPLOADING: "Saving your finished drawings to the cloud — almost done",
  COMPLETE: "Complete — Your 2D technical drawing is ready ✓",
  FAILED: "Processing failed — please try again or contact support",
};

/** Terminal line: status: PROCESSING · Step 1 of 5 — … */
export function formatStatusConsoleLine(job, consoleMessage) {
  const status = (job?.status || "UNKNOWN").toUpperCase();
  let msg = (consoleMessage || "").trim();
  if (!msg) {
    msg = (job?.console_status || "").trim();
  }
  if (!msg && job?.pipeline_stage) {
    msg = PIPELINE_STAGE_LABELS[job.pipeline_stage] || job.pipeline_stage;
  }
  if (!msg) {
    msg = "Processing…";
  }
  return `  → status: ${status} · ${msg}`;
}

/** Terminal color from message text */
export function consoleStatusLogKind(message) {
  const m = (message || "").toLowerCase();
  if (m.includes("complete") || m.includes("ready ✓") || m.includes("captured ✓") || m.includes("created ✓")) {
    return "ok";
  }
  if (m.includes("failed") || m.includes("error")) return "err";
  if (m.startsWith("step ")) return "info";
  return "info";
}

/**
 * Append new console_statuses from API poll into the terminal.
 * @returns {number} count of new lines appended
 */
export function consumeConsoleStatuses(job, seenCountRef, appendLog) {
  const entries = Array.isArray(job?.console_statuses) ? job.console_statuses : [];
  const seen = seenCountRef?.current ?? 0;
  let added = 0;
  for (let i = seen; i < entries.length; i += 1) {
    const msg = (entries[i]?.message || "").trim();
    if (!msg) continue;
    appendLog(consoleStatusLogKind(msg), formatStatusConsoleLine(job, msg));
    added += 1;
  }
  if (seenCountRef) {
    seenCountRef.current = entries.length;
  }
  return added;
}
