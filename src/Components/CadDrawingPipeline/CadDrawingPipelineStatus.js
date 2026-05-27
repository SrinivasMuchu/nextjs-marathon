"use client";

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import {
  getTechDrawJobStatus,
  TechDrawPollError,
  waitForTechDrawJob,
} from "@/api/cadDrawingPipelineApi";
import { consumeJobLogs, formatStatusConsoleLine } from "@/api/consoleStatus";
import {
  derivePipelineStageUi,
  isLikelyPostSuccessInfraFailure,
} from "@/api/cadDrawingPipelineStages";
import {
  getJobDisplayTitle,
  getJobPageSubtitle,
  logLineClass,
  PIPELINE_STAGES_UI,
} from "./pipelineConstants";
import styles from "./CadDrawingPipeline.module.css";
import {
  isTechDrawJobComplete,
  techDrawDesignPath,
} from "@/lib/techDraw/techDrawJobRoutes";

function isTransientStatusError(err) {
  if (err instanceof TechDrawPollError) return err.transient;
  if (axios.isAxiosError(err)) {
    const c = err.code;
    if (c === "ECONNABORTED" || c === "ERR_NETWORK" || c === "ETIMEDOUT") return true;
    const s = err.response?.status;
    if (s === 502 || s === 503 || s === 504 || s === 429) return true;
  }
  return false;
}

export default function CadDrawingPipelineStatus({ jobId }) {
  const router = useRouter();
  const { user } = useContext(contextState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [completedJob, setCompletedJob] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const [needsPayment, setNeedsPayment] = useState(false);

  const [logs, setLogs] = useState(() => [
    { kind: "dim", text: `// Job ${jobId}` },
    { kind: "dim", text: "// Loading pipeline status…" },
  ]);
  const [overallStatus, setOverallStatus] = useState("RUNNING");
  const [activeStageIndex, setActiveStageIndex] = useState(-1);
  const [stagesDone, setStagesDone] = useState(() => PIPELINE_STAGES_UI.map(() => false));
  const [stagesError, setStagesError] = useState(false);
  const [errorStageIndex, setErrorStageIndex] = useState(-1);
  const pollAbortRef = useRef(null);
  const lastLoggedStatusRef = useRef(null);
  const consoleStatusesSeenRef = useRef(0);
  const workerLogsSeenRef = useRef(0);
  const terminalBodyRef = useRef(null);
  const pollStartedRef = useRef(false);

  const logRefs = useRef({
    consoleStatusesSeen: consoleStatusesSeenRef,
    workerLogsSeen: workerLogsSeenRef,
  });

  // ── Streaming log reveal ────────────────────────────────────────────────
  // Lines are queued in a ref and drained one-at-a-time on a short timer so
  // the dashboard terminal types them out instead of dumping a wall of pre-
  // existing text the moment the page loads. Matches the feel of tailing the
  // consumer's stdout in real time.
  const pendingLogsRef = useRef([]);
  const flushTimerRef = useRef(null);
  const LOG_REVEAL_DELAY_MS = 80;

  const drainCallbacksRef = useRef([]);

  const runDrainCallbacks = useCallback(() => {
    const callbacks = drainCallbacksRef.current;
    drainCallbacksRef.current = [];
    callbacks.forEach((cb) => {
      try {
        cb();
      } catch (_) {
        /* ignore individual callback failures */
      }
    });
  }, []);

  const drainOneLog = useCallback(() => {
    const next = pendingLogsRef.current.shift();
    if (!next) {
      if (flushTimerRef.current) {
        window.clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      runDrainCallbacks();
      return;
    }
    setLogs((prev) => [...prev, next]);
  }, [runDrainCallbacks]);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current) return;
    drainOneLog();
    if (pendingLogsRef.current.length === 0) return;
    flushTimerRef.current = window.setInterval(drainOneLog, LOG_REVEAL_DELAY_MS);
  }, [drainOneLog]);

  const appendLog = useCallback(
    (kind, text) => {
      pendingLogsRef.current.push({ kind, text });
      scheduleFlush();
    },
    [scheduleFlush],
  );

  /** Run `cb` once the streaming log queue has finished revealing every line. */
  const afterLogsDrained = useCallback(
    (cb) => {
      if (typeof cb !== "function") return;
      if (pendingLogsRef.current.length === 0 && !flushTimerRef.current) {
        cb();
        return;
      }
      drainCallbacksRef.current.push(cb);
    },
    [],
  );

  useEffect(
    () => () => {
      if (flushTimerRef.current) {
        window.clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      pendingLogsRef.current = [];
      drainCallbacksRef.current = [];
    },
    [],
  );

  const syncConsoleStatuses = useCallback(
    (job) => {
      if (!job) return;
      consumeJobLogs(job, logRefs.current, appendLog);
    },
    [appendLog],
  );

  useEffect(() => {
    const el = terminalBodyRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs]);

  const applyPipelineStageUi = useCallback((job) => {
    const ui = derivePipelineStageUi(job, PIPELINE_STAGES_UI.length);
    setOverallStatus(ui.overallStatus);
    setStagesDone(ui.stagesDone);
    setActiveStageIndex(ui.activeStageIndex);
    setStagesError(ui.stagesError);
    setErrorStageIndex(ui.errorStageIndex);
  }, []);

  const handleJobStatusUpdate = useCallback(
    (job) => {
      if (!job?.status) return;
      setCurrentJob(job);
      applyPipelineStageUi(job);
    },
    [applyPipelineStageUi],
  );

  const applyCompletedJob = useCallback(
    (job) => {
      setCompletedJob(job);
      setResult({ meta: { success: true }, data: { job, job_id: jobId } });
      applyPipelineStageUi(job);
    },
    [applyPipelineStageUi, jobId],
  );

  const finishPipelineRun = useCallback(
    (job) => {
      syncConsoleStatuses(job);
      applyCompletedJob(job);
      setError("");
      setStagesError(false);
      setErrorStageIndex(-1);
      setNeedsPayment(false);
      appendLog("ok", "  ✓ Pipeline completed.");
      if (job?.output_s3_prefix) {
        appendLog("info", `  Output prefix: ${job.output_s3_prefix}`);
      }
      toast.success("Drawing pipeline finished.");
      if (isTechDrawJobComplete(job)) {
        // Wait for the streaming terminal to finish revealing every line
        // before we navigate, otherwise the user sees the redirect happen
        // mid-stream.
        afterLogsDrained(() => router.replace(techDrawDesignPath(jobId)));
      }
    },
    [afterLogsDrained, appendLog, applyCompletedJob, jobId, router, syncConsoleStatuses],
  );

  const applyFailedJobFromApi = useCallback(
    (job) => {
      handleJobStatusUpdate(job);
      if (isLikelyPostSuccessInfraFailure(job)) {
        appendLog(
          "warn",
          "  ⚠ Upload finished, but the job was marked FAILED by a Kafka queue error (not a drawing failure).",
        );
        appendLog("dim", `  ${job.error_message}`);
        finishPipelineRun(job);
        toast.warn("Outputs are ready — ignore the FAILED label (server queue glitch).");
        return true;
      }
      const text = job.error_message || "Pipeline failed on the server.";
      setError(text);
      setOverallStatus("FAILED");
      setStagesError(true);
      appendLog("err", `  ✗ ${text}`);
      toast.error(text);
      return true;
    },
    [appendLog, finishPipelineRun, handleJobStatusUpdate],
  );

  const handlePipelineError = useCallback(
    (err) => {
      if (err instanceof TechDrawPollError && err.job?.status === "FAILED") {
        return applyFailedJobFromApi(err.job);
      }

      const stillRunning =
        (err instanceof TechDrawPollError && err.transient) || isTransientStatusError(err);

      if (stillRunning) {
        const text =
          err?.message ||
          "Connection to status API was lost. The pipeline is likely still running on the server.";
        setError(text);
        setStagesError(false);
        setErrorStageIndex(-1);
        setOverallStatus("PROCESSING");
        appendLog("warn", `  ⏳ ${text}`);
        toast.warn("Still processing — use Check status to continue waiting.");
        return true;
      }

      return false;
    },
    [applyFailedJobFromApi, appendLog, handleJobStatusUpdate],
  );

  const onPhase = useCallback(
    (phase, job) => {
      if (phase === "processing") {
        appendLog("info", "  → Live processing updates appear below…");
      }
      if (phase === "status" && job?.status) {
        const added = consumeJobLogs(job, logRefs.current, appendLog);
        const statusKey = `${job.status}:${job.console_status || ""}:${job.pipeline_stage || ""}`;
        if (added === 0 && statusKey !== lastLoggedStatusRef.current) {
          lastLoggedStatusRef.current = statusKey;
          appendLog("info", formatStatusConsoleLine(job));
        } else if (added > 0) {
          lastLoggedStatusRef.current = statusKey;
        }
        if (job.status === "FAILED" && job.error_message) {
          if (isLikelyPostSuccessInfraFailure(job)) {
            appendLog(
              "warn",
              "  ⚠ Upload finished — FAILED label is from queue, not the drawing.",
            );
          }
        }
        handleJobStatusUpdate(job);
      }
    },
    [appendLog, handleJobStatusUpdate, syncConsoleStatuses],
  );

  const startPolling = useCallback(async () => {
    setLoading(true);
    setStagesError(false);
    setOverallStatus("RUNNING");
    appendLog("info", "  → Watching pipeline progress…");

    try {
      const { job } = await waitForTechDrawJob(jobId, onPhase);
      finishPipelineRun(job);
    } catch (err) {
      if (!handlePipelineError(err)) {
        const text = err?.message || "Request failed";
        setError(text);
        setOverallStatus("FAILED");
        setStagesError(true);
        appendLog("err", `  ✗ ${text}`);
        toast.error("Pipeline request failed.");
      }
    } finally {
      setLoading(false);
    }
  }, [appendLog, finishPipelineRun, handlePipelineError, jobId, onPhase]);

  const continueWaitingForJob = useCallback(async () => {
    if (loading || needsPayment) return;
    await startPolling();
  }, [loading, needsPayment, startPolling]);

  useEffect(() => {
    if (!jobId || pollStartedRef.current) return;
    pollStartedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        const { job } = await getTechDrawJobStatus(jobId);
        if (cancelled) return;

        appendLog("hdr", "========== JOB STATUS ==========");
        appendLog("info", `  Title: ${job.title || job.file_name || jobId}`);
        consumeJobLogs(job, logRefs.current, appendLog);
        if (
          (job.console_statuses || []).length === 0 &&
          (job.worker_logs || []).length === 0
        ) {
          appendLog("info", formatStatusConsoleLine(job));
        }
        lastLoggedStatusRef.current = `${job.status}:${job.console_status || ""}:${job.pipeline_stage || ""}`;
        handleJobStatusUpdate(job);

        const paymentPending =
          job.status === "PENDING" &&
          (job.payment_pending === true ||
            (job.payment_status === "pending" && !job.is_free_run));

        if (paymentPending) {
          setNeedsPayment(true);
          setOverallStatus("QUEUED");
          setLoading(false);
          appendLog("warn", "  Payment required before the pipeline can start.");
          return;
        }

        if (job.status === "COMPLETED") {
          finishPipelineRun(job);
          setLoading(false);
          return;
        }

        if (job.status === "FAILED") {
          applyFailedJobFromApi(job);
          setLoading(false);
          return;
        }

        await startPolling();
      } catch (err) {
        if (cancelled) return;
        const text = err?.message || "Could not load job status.";
        setError(text);
        setOverallStatus("FAILED");
        setLoading(false);
        appendLog("err", `  ✗ ${text}`);
      }
    })();

    return () => {
      cancelled = true;
      pollAbortRef.current?.abort();
    };
  }, [appendLog, applyFailedJobFromApi, finishPipelineRun, handleJobStatusUpdate, jobId, startPolling, syncConsoleStatuses]);

  const jobForDisplay = currentJob || completedJob;
  const displayTitle = getJobDisplayTitle(jobForDisplay);
  const pageSubtitle = getJobPageSubtitle(jobForDisplay);

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>
          {displayTitle}
          <span className={styles.pageTitleAccent}> · Pipeline</span>
        </h1>
        <p className={styles.pageDesc}>{pageSubtitle}</p>

        {overallStatus !== "COMPLETED" && user?.email ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 18px",
              margin: "0 0 18px",
              borderRadius: 12,
              background:
                "linear-gradient(135deg, rgba(97, 11, 238, 0.16) 0%, rgba(97, 11, 238, 0.06) 100%)",
              border: "1px solid rgba(97, 11, 238, 0.45)",
              color: "#e8e8f0",
              boxShadow: "0 0 18px rgba(97, 11, 238, 0.15)",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>📧</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                We will notify you when your CAD 2d views are ready.
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#a8a8c2",
                  marginTop: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Email:&nbsp;
                <span style={{ color: "#c9b6ff", fontWeight: 500 }}>{user.email}</span>
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div
            className={`${styles.resultBanner} ${
              overallStatus === "PROCESSING" ? styles.resultBannerWarn : styles.resultBannerErr
            }`}
          >
            <span className={styles.resultIcon}>{overallStatus === "PROCESSING" ? "⏳" : "✕"}</span>
            <div>
              <div className={styles.resultText}>
                {overallStatus === "PROCESSING" ? "Still processing on server" : "Request failed"}
              </div>
              <div className={styles.resultSub}>{error}</div>
              {overallStatus === "PROCESSING" && !needsPayment ? (
                <button
                  type="button"
                  className={styles.checkStatusBtn}
                  onClick={continueWaitingForJob}
                  disabled={loading}
                >
                  {loading ? "Checking status…" : "Check status"}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {result && !error ? (
          <div className={`${styles.resultBanner} ${styles.resultBannerOk}`}>
            <span className={styles.resultIcon}>✓</span>
            <div>
              <div className={styles.resultText}>Pipeline completed</div>
              <div className={styles.resultSub}>Downloads are listed below when available.</div>
            </div>
          </div>
        ) : null}

        <div className={styles.layout}>
          <div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderGrow}>
                  <div className={styles.cardIcon}>⚙️</div>
                  <div className={styles.cardTitle}>Pipeline stages</div>
                </div>
                <span className={styles.tokenBadge}>{overallStatus}</span>
              </div>

              <div className={styles.stages}>
                {PIPELINE_STAGES_UI.map((s, i) => {
                  const done = stagesDone[i];
                  const pipelineRunning =
                    loading ||
                    overallStatus === "RUNNING" ||
                    overallStatus === "PROCESSING" ||
                    overallStatus === "QUEUED";
                  const active =
                    pipelineRunning && !stagesError && activeStageIndex === i;
                  const err = stagesError && i === errorStageIndex && !done;
                  const stageClass = [
                    styles.stage,
                    active ? styles.stageActive : "",
                    done ? styles.stageDone : "",
                    err ? styles.stageError : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div key={s.name} className={stageClass}>
                      <div className={styles.stageNum}>
                        {done ? (
                          "✓"
                        ) : active ? (
                          <span className={styles.spinner} aria-hidden />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <div className={styles.stageContent}>
                        <div className={styles.stageName}>{s.name}</div>
                        <div className={styles.stageDesc}>{s.desc}</div>
                        <div className={styles.stageStatus}>
                          {done ? "DONE" : active ? "RUNNING" : err ? "ERROR" : "WAITING"}
                        </div>
                        <div className={styles.stageProgress}>
                          <div className={styles.stageProgressFill} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={`${styles.terminal} ${styles.terminalSidebar}`}>
              <div className={styles.terminalBar}>
                <span className={`${styles.tDot} ${styles.tDot1}`} />
                <span className={`${styles.tDot} ${styles.tDot2}`} />
                <span className={`${styles.tDot} ${styles.tDot3}`} />
                <span className={styles.terminalLabel}>processing status</span>
              </div>
              <div className={styles.terminalBody} ref={terminalBodyRef}>
                {logs.map((line, idx) => (
                  <span key={`${idx}-${line.text.slice(0, 24)}`} className={styles.logLine}>
                    <span className={logLineClass(line.kind)}>{line.text}</span>
                    <br />
                  </span>
                ))}
                <span className={`${styles.logLine} ${styles.logCursor}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
