/**
 * Keep in sync with cad_tech_draw.pipeline_stage (api_server/models/cadTechDraw.js).
 *
 * pipeline_stage = last completed step while status is PROCESSING.
 * The UI shows the next stage as RUNNING.
 */

export const PIPELINE_STAGES = [
  "VIEW_CAPTURE",
  "VIEW_SELECTION",
  "SHEET_SETUP",
  "DIMENSION_PLANNING",
  "ANNOTATE_EXPORT",
];

const STAGE_INDEX = Object.fromEntries(PIPELINE_STAGES.map((s, i) => [s, i]));

/** Kafka commit failed after S3/Mongo success — job may still have outputs. */
export function isLikelyPostSuccessInfraFailure(job) {
  const msg = (job?.error_message || "").toLowerCase();
  if (!msg.includes("commitfailed") && !msg.includes("not part of an active group")) {
    return false;
  }
  return Boolean(String(job?._id || job?.id || "").trim());
}

export const PIPELINE_STAGE_LABELS = {
  VIEW_CAPTURE: "View capture",
  VIEW_SELECTION: "Smart view selection",
  SHEET_SETUP: "Drawing sheet setup",
  DIMENSION_PLANNING: "Dimension planning",
  ANNOTATE_EXPORT: "Annotate & export",
};

const WORKER_CLAIMED_RE =
  /processing started|downloading your 3d model|capturing engineering views|opening step file/i;

/** Job is PROCESSING in Mongo but the single consumer has not started it yet (Kafka backlog). */
export function isJobInPipelineQueue(job) {
  if (job?.status !== "PROCESSING") return false;
  if (job?.pipeline_stage) return false;

  const lines = [
    job?.console_status,
    ...(Array.isArray(job?.console_statuses)
      ? job.console_statuses.map((e) => e?.message)
      : []),
  ]
    .map((m) => (m || "").toString().trim())
    .filter(Boolean);

  for (const line of lines) {
    if (/in queue/i.test(line)) return true;
    if (WORKER_CLAIMED_RE.test(line)) return false;
  }

  return true;
}

/**
 * @param {{ status?: string, pipeline_stage?: string }} job
 * @param {number} stageCount
 */
export function derivePipelineStageUi(job, stageCount = PIPELINE_STAGES.length) {
  const status = job?.status || "";
  const stage = job?.pipeline_stage;
  const stageIdx = stage && STAGE_INDEX[stage] != null ? STAGE_INDEX[stage] : -1;

  if (status === "COMPLETED") {
    return {
      overallStatus: "DONE ✓",
      stagesDone: Array(stageCount).fill(true),
      activeStageIndex: -1,
      stagesError: false,
      errorStageIndex: -1,
    };
  }

  if (status === "FAILED") {
    const lastIdx = stageCount - 1;
    const errorStageIndex =
      stageIdx >= 0 ? Math.min(lastIdx, stageIdx + 1) : 0;
    // Do not mark the failed stage as DONE (was i <= stageIdx — hid ERROR on last stage).
    const stagesDone = Array.from(
      { length: stageCount },
      (_, i) => i < errorStageIndex,
    );
    return {
      overallStatus: "FAILED",
      stagesDone,
      activeStageIndex: -1,
      stagesError: true,
      errorStageIndex,
    };
  }

  const processingUi = (completedIdx) => {
    const lastIdx = stageCount - 1;
    if (completedIdx < 0) {
      return {
        overallStatus: "RUNNING",
        stagesDone: Array(stageCount).fill(false),
        activeStageIndex: 0,
        stagesError: false,
        errorStageIndex: -1,
      };
    }
    // While PROCESSING, never show all stages DONE — last step may still be uploading.
    const activeStageIndex =
      completedIdx >= lastIdx ? lastIdx : completedIdx + 1;
    const stagesDone = Array.from(
      { length: stageCount },
      (_, i) => i < activeStageIndex,
    );
    return {
      overallStatus: "RUNNING",
      stagesDone,
      activeStageIndex,
      stagesError: false,
      errorStageIndex: -1,
    };
  };

  if (status === "PENDING") {
    if (stageIdx >= 0) {
      return processingUi(stageIdx);
    }
    return {
      overallStatus: "QUEUED",
      stagesDone: Array(stageCount).fill(false),
      activeStageIndex: 0,
      stagesError: false,
      errorStageIndex: -1,
    };
  }

  if (status === "PROCESSING" || status === "UPLOADING") {
    if (status === "PROCESSING" && isJobInPipelineQueue(job)) {
      return {
        overallStatus: "IN QUEUE",
        stagesDone: Array(stageCount).fill(false),
        activeStageIndex: -1,
        stagesError: false,
        errorStageIndex: -1,
      };
    }
    return processingUi(stageIdx);
  }

  return {
    overallStatus: "READY",
    stagesDone: Array(stageCount).fill(false),
    activeStageIndex: -1,
    stagesError: false,
    errorStageIndex: -1,
  };
}
