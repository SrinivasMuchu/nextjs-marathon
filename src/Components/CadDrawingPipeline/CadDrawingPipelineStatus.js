"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import {
  countTechDrawSheets,
  getTechDrawJobStatus,
  getTechDrawPriceDisplay,
  outputItemsFromJob,
  sheetDownloadsFromJob,
  TechDrawPollError,
  waitForTechDrawJob,
} from "@/api/cadDrawingPipelineApi";
import {
  derivePipelineStageUi,
  isLikelyPostSuccessInfraFailure,
  PIPELINE_STAGE_LABELS,
} from "@/api/cadDrawingPipelineStages";
import {
  getJobDisplayTitle,
  getJobPageSubtitle,
  logLineClass,
  PIPELINE_STAGES_UI,
  SHEET_LABELS,
} from "./pipelineConstants";
import { openTechDrawPayment } from "./techDrawPayment";
import TechDrawJobLibraryResults from "./TechDrawJobLibraryResults";
import styles from "./CadDrawingPipeline.module.css";

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
  const [runStats, setRunStats] = useState({
    sheets: "—",
    dims: "—",
    tokens: "—",
    time: "—",
  });

  const runStartRef = useRef(Date.now());
  const pollAbortRef = useRef(null);
  const lastLoggedStatusRef = useRef(null);
  const pollStartedRef = useRef(false);

  const appendLog = useCallback((kind, text) => {
    setLogs((prev) => [...prev, { kind, text }]);
  }, []);

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
    (job, elapsedSec) => {
      setCompletedJob(job);
      setResult({ meta: { success: true }, data: { job, job_id: jobId } });
      applyPipelineStageUi(job);
      setRunStats({
        sheets: countTechDrawSheets(job) ? String(countTechDrawSheets(job)) : "—",
        dims: "—",
        tokens: "—",
        time:
          job.time_taken_seconds != null
            ? `${job.time_taken_seconds}s`
            : elapsedSec != null
              ? `${elapsedSec}s`
              : "—",
      });
    },
    [applyPipelineStageUi, jobId],
  );

  const finishPipelineRun = useCallback(
    (job) => {
      const elapsed = ((Date.now() - (runStartRef.current || Date.now())) / 1000).toFixed(1);
      applyCompletedJob(job, elapsed);
      setError("");
      setStagesError(false);
      setErrorStageIndex(-1);
      setNeedsPayment(false);
      appendLog("ok", "  ✓ Pipeline completed.");
      if (job?.output_s3_prefix) {
        appendLog("info", `  Output prefix: ${job.output_s3_prefix}`);
      }
      toast.success("Drawing pipeline finished.");
    },
    [appendLog, applyCompletedJob],
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
      if (phase === "processing") appendLog("info", "  → Pipeline running — polling status…");
      if (phase === "status" && job?.status) {
        const logKey = `${job.status}:${job.pipeline_stage || ""}:${job.error_message || ""}`;
        if (logKey !== lastLoggedStatusRef.current) {
          lastLoggedStatusRef.current = logKey;
          const stageLabel = job.pipeline_stage
            ? PIPELINE_STAGE_LABELS[job.pipeline_stage] || job.pipeline_stage
            : "";
          appendLog(
            "info",
            stageLabel
              ? `  → ${job.status} · ${stageLabel}`
              : `  → Job status: ${job.status}`,
          );
          if (job.status === "FAILED" && job.error_message) {
            if (isLikelyPostSuccessInfraFailure(job)) {
              appendLog(
                "warn",
                "  ⚠ Drawing upload completed — FAILED is from Kafka offset commit, not the pipeline.",
              );
            }
          }
        }
        handleJobStatusUpdate(job);
      }
    },
    [appendLog, handleJobStatusUpdate],
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
    runStartRef.current = Date.now();

    let cancelled = false;

    (async () => {
      try {
        const { job } = await getTechDrawJobStatus(jobId);
        if (cancelled) return;

        appendLog("hdr", "========== JOB STATUS ==========");
        appendLog("info", `  Title: ${job.title || job.file_name || jobId}`);
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
  }, [appendLog, applyFailedJobFromApi, finishPipelineRun, handleJobStatusUpdate, jobId, startPolling]);

  const jobForDisplay = currentJob || completedJob;
  const hasOutputs = Boolean(jobForDisplay?.output_s3_prefix);
  const sheetDownloads = hasOutputs ? sheetDownloadsFromJob(jobForDisplay) : [];
  const outputItems = hasOutputs ? outputItemsFromJob(jobForDisplay) : [];
  const displayTitle = getJobDisplayTitle(jobForDisplay);
  const pageSubtitle = getJobPageSubtitle(jobForDisplay);

  const showLibraryResults =
    completedJob?.output_s3_prefix &&
    (completedJob.status === "COMPLETED" || isLikelyPostSuccessInfraFailure(completedJob));

  if (showLibraryResults) {
    return <TechDrawJobLibraryResults jobId={jobId} job={completedJob} />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>M</div>
            <div>
              <div className={styles.logoText}>Marathon-OS</div>
              <div className={styles.logoSub}>2D technical drawing · Job status</div>
            </div>
          </div>
          <Link href="/tools/cad-drawing-pipeline" className={styles.headerBadge}>
            ← New drawing
          </Link>
        </header>

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

              <div className={styles.terminal}>
                <div className={styles.terminalBar}>
                  <span className={`${styles.tDot} ${styles.tDot1}`} />
                  <span className={`${styles.tDot} ${styles.tDot2}`} />
                  <span className={`${styles.tDot} ${styles.tDot3}`} />
                  <span className={styles.terminalLabel}>pipeline.log</span>
                </div>
                <div className={styles.terminalBody}>
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

          <div className={styles.rightCol}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📊</div>
                <div className={styles.cardTitle}>Run statistics</div>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{runStats.sheets}</div>
                  <div className={styles.statLabel}>Sheets</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{runStats.dims}</div>
                  <div className={styles.statLabel}>Dimensions</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{runStats.tokens}</div>
                  <div className={styles.statLabel}>AI tokens</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{runStats.time}</div>
                  <div className={styles.statLabel}>Duration</div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>🗂</div>
                <div className={styles.cardTitle}>Sheet previews</div>
              </div>
              <div className={styles.sheetsGrid}>
                {SHEET_LABELS.map(([a, b], i) => {
                  const sheet = sheetDownloads[i];
                  const ready = Boolean(sheet?.pdfHref);
                                    const thumbClass = `${styles.sheetThumb} ${ready ? `${styles.sheetThumbLink} ${styles.sheetThumbReady}` : ""}`;
                  const inner = (
                    <>
                      {ready ? <div className={styles.sheetThumbBadge}>PDF</div> : null}
                      <div className={styles.sheetThumbIcon}>{ready ? "🗒" : "📄"}</div>
                      <div className={styles.sheetThumbLabel}>
                        {a}
                        <br />
                        {b}
                      </div>
                    </>
                  );
                  if (ready && sheet?.pdfHref) {
                    return (
                      <a
                        key={i}
                        href={sheet.pdfHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={thumbClass}
                        title={`Sheet ${i + 1} PDF`}
                      >
                        {inner}
                      </a>
                    );
                  }
                  return (
                    <div key={i} className={thumbClass}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📁</div>
                <div className={styles.cardTitle}>Output files</div>
              </div>
              <div className={styles.outputFiles}>
                {!hasOutputs ? (
                  <div className={styles.outputEmpty}>
                    No outputs yet.
                    <br />
                    Processing will populate this list.
                  </div>
                ) : (
                  outputItems.map((item, idx) => {
                    const extClass =
                      item.ext === "pdf"
                        ? styles.extPdf
                        : item.ext === "svg"
                          ? styles.extSvg
                          : item.ext === "dxf"
                            ? styles.extDxf
                            : item.ext === "png"
                              ? styles.extCsv
                              : styles.extJson;
                    return (
                      <a
                        key={`${item.fileName || item.name}-${idx}`}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.outputItem}
                        title={item.fileName}
                      >
                        <span className={`${styles.outputExt} ${extClass}`}>
                          {item.ext.toUpperCase()}
                        </span>
                        <span className={styles.outputName}>{item.name}</span>
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
