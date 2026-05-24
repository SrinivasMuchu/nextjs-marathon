"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import {
  getTechDrawJobStatus,
  getTechDrawPriceDisplay,
  TechDrawPollError,
  waitForTechDrawJob,
} from "@/api/cadDrawingPipelineApi";
import { consumeConsoleStatuses, formatStatusConsoleLine } from "@/api/consoleStatus";
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
import { openTechDrawPayment } from "./techDrawPayment";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [completedJob, setCompletedJob] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const paymentPrices = getTechDrawPriceDisplay();

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
  const terminalBodyRef = useRef(null);
  const pollStartedRef = useRef(false);

  const appendLog = useCallback((kind, text) => {
    setLogs((prev) => [...prev, { kind, text }]);
  }, []);

  const syncConsoleStatuses = useCallback(
    (job) => {
      if (!job) return;
      consumeConsoleStatuses(job, consoleStatusesSeenRef, appendLog);
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
        router.replace(techDrawDesignPath(jobId));
      }
    },
    [appendLog, applyCompletedJob, jobId, router, syncConsoleStatuses],
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
        const prevSeen = consoleStatusesSeenRef.current;
        const added = consumeConsoleStatuses(job, consoleStatusesSeenRef, appendLog);
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

  const handlePayAndStart = useCallback(async () => {
    setPaying(true);
    setError("");
    try {
      await openTechDrawPayment({
        jobId,
        description: `2D technical drawing · ${paymentPrices.baseLabel}`,
      });
      appendLog("ok", "  ✓ Payment verified.");
      setNeedsPayment(false);
      const { job } = await getTechDrawJobStatus(jobId);
      if (job?.status === "PROCESSING" || job?.status === "COMPLETED") {
        appendLog("info", "  → Pipeline running…");
        await startPolling();
      } else {
        appendLog(
          "warn",
          "  Upload your STEP file on the pipeline page to start processing.",
        );
        toast.info("Payment received. Upload your STEP file on the pipeline page.");
      }
    } catch (err) {
      const text = err?.message || "Payment failed";
      setError(text);
      toast.error(text);
    } finally {
      setPaying(false);
    }
  }, [appendLog, jobId, paymentPrices, startPolling]);

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
        consumeConsoleStatuses(job, consoleStatusesSeenRef, appendLog);
        if ((job.console_statuses || []).length === 0) {
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

        {needsPayment ? (
          <div className={`${styles.resultBanner} ${styles.resultBannerWarn}`}>
            <span className={styles.resultIcon}>💳</span>
            <div>
              <div className={styles.resultText}>Payment required</div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#610bee",
                  margin: "8px 0 4px",
                }}
              >
                {paymentPrices.baseLabel}
              </div>
              <div className={styles.resultSub}>
                Pay first ({paymentPrices.totalLabel} incl. tax), then upload your STEP on the
                pipeline page if you have not already.
              </div>
              <button
                type="button"
                className={styles.checkStatusBtn}
                onClick={handlePayAndStart}
                disabled={paying}
              >
                {paying
                  ? "Opening checkout…"
                  : `Pay ${paymentPrices.baseLabel} and start`}
              </button>
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
