"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import {
  checkTechDrawEligibility,
  getOrCreateTechDrawUuid,
  getTechDrawPriceDisplay,
  prepareCadDrawingJob,
  uploadAndSubmitTechDrawJob,
} from "@/api/cadDrawingPipelineApi";
import { openTechDrawPayment } from "./techDrawPayment";
import CadDrawingPipelineHero from "./CadDrawingPipelineHero";
import CadDrawingPipelineHowItWorks from "./CadDrawingPipelineHowItWorks";
import { STEP_EXT } from "./pipelineConstants";
import { techDrawPipelineStatusPath } from "@/lib/techDraw/techDrawJobRoutes";
import { DIMENSION_EXTRACTION_FREE_RETRY_MSG } from "@/api/techDrawErrors";
import {
  flowTypeFromEligibility,
  trackTechDrawFileRejected,
  trackTechDrawFileSelected,
  trackTechDrawUploadFailed,
  trackTechDrawUploadPhase,
  trackTechDrawUploadStart,
  trackTechDrawUploadSuccess,
} from "@/lib/techDraw/techDrawAnalytics";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import styles from "./CadDrawingPipeline.module.css";

function isUserVerified() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem("is_verified"));
}

// Hard cap on STEP/STP uploads. FreeCAD load times grow quickly past this point
// and the S3 upload + worker pipeline cost balloons, so we reject larger files
// up front on the client. Keep in sync with any server-side enforcement.
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_UPLOAD_LABEL = "100 MB";

function formatMb(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const LLM_STATUS_MESSAGES = {
  overloaded:
    "The AI service is currently overloaded. Please try again in a few moments.",
  rate_limited:
    "The AI service is rate-limited right now. Please wait a minute and retry.",
  timeout:
    "The AI service did not respond in time. Please retry in a moment.",
  auth_error:
    "AI service authentication failed. Please contact support.",
  model_not_found:
    "The configured AI model is unavailable. Please contact support.",
  not_configured:
    "The AI service is not configured on the server. Please contact support.",
  unavailable:
    "The AI service is temporarily unavailable. Please try again shortly.",
};

function getLlmDownMessage(status) {
  return (
    LLM_STATUS_MESSAGES[status] ||
    "The AI service is temporarily unavailable. Please try again in a few minutes."
  );
}

function isLlmAvailable(eligibility) {
  if (!eligibility) return true;
  if (typeof eligibility.llm_available === "boolean") return eligibility.llm_available;
  if (eligibility.haiku_status) return eligibility.haiku_status === "ok";
  return true;
}

export default function CadDrawingPipelineView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const freeRetryFor = String(searchParams.get("freeRetryFor") || "").trim();
  const isFreeRetryFlow = Boolean(freeRetryFor);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadPhase, setUploadPhase] = useState("");
  const [error, setError] = useState("");
  const [advOpen, setAdvOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const fileInputRef = useRef(null);
  const uploadSectionRef = useRef(null);
  const submitLockRef = useRef(false);
  const pendingAfterLoginRef = useRef(false);

  const prices = getTechDrawPriceDisplay();

  useEffect(() => {
    getOrCreateTechDrawUuid();
  }, []);

  const refreshEligibility = useCallback(async () => {
    setEligibilityLoading(true);
    try {
      const data = await checkTechDrawEligibility();
      setEligibility(data);
    } catch {
      setEligibility(null);
    } finally {
      setEligibilityLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEligibility();
  }, [refreshEligibility]);

  const pickFile = useCallback((f) => {
    if (!f) return;
    if (!STEP_EXT.test(f.name)) {
      trackTechDrawFileRejected("invalid_extension");
      toast.error("Only .step or .stp files are allowed.");
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      trackTechDrawFileRejected("file_too_large");
      const msg = `File is ${formatMb(f.size)}. Maximum allowed size is ${MAX_UPLOAD_LABEL}.`;
      setError(msg);
      toast.error(msg);
      return;
    }
    trackTechDrawFileSelected(f);
    setFile(f);
    setError("");
  }, []);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    pickFile(f);
    e.target.value = "";
  };

  const openFilePicker = useCallback(() => {
    if (submitting || submitLockRef.current) return;
    fileInputRef.current?.click();
  }, [submitting]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    pickFile(f);
  };

  const needsPaidFlow =
    !isFreeRetryFlow && eligibility && !eligibility.free_run_available && !eligibilityLoading;

  const llmAvailable = useMemo(() => isLlmAvailable(eligibility), [eligibility]);
  const llmDownMessage = useMemo(
    () => (llmAvailable ? "" : getLlmDownMessage(eligibility?.llm_status)),
    [llmAvailable, eligibility],
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    if (submitLockRef.current || submitting) return;

    if (!file) {
      toast.error("Choose a STEP or STP file.");
      return;
    }
    if (!STEP_EXT.test(file.name)) {
      toast.error("Only .step or .stp files are allowed.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      const msg = `File is ${formatMb(file.size)}. Maximum allowed size is ${MAX_UPLOAD_LABEL}.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!isUserVerified()) {
      toast.info("Please log in to run the drawing pipeline.");
      pendingAfterLoginRef.current = true;
      setShowLogin(true);
      return;
    }

    if (!llmAvailable) {
      const msg = llmDownMessage || getLlmDownMessage(eligibility?.llm_status);
      setError(msg);
      toast.error(msg);
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    setError("");

    const flowType = needsPaidFlow ? "paid" : flowTypeFromEligibility(eligibility);
    trackTechDrawUploadStart({ flowType, file });

    try {
      setUploadPhase("Checking AI service…");
      let freshEligibility;
      try {
        freshEligibility = await checkTechDrawEligibility();
        setEligibility(freshEligibility);
      } catch {
        freshEligibility = eligibility;
      }
      if (!isLlmAvailable(freshEligibility)) {
        const msg = getLlmDownMessage(freshEligibility?.llm_status);
        setError(msg);
        toast.error(msg);
        submitLockRef.current = false;
        setSubmitting(false);
        setUploadPhase("");
        return;
      }

      const onPhase = (phase) => {
        trackTechDrawUploadPhase(phase);
        if (phase === "upload-url") setUploadPhase("Requesting upload URL…");
        if (phase === "s3-upload") setUploadPhase("Uploading STEP file…");
        if (phase === "submit") setUploadPhase("Creating job & starting pipeline…");
      };

      let jobId;

      if (needsPaidFlow) {
        setUploadPhase(`Pay ${prices.baseLabel} + tax (${prices.totalLabel})…`);
        const payment = await openTechDrawPayment({
          description: `2D technical drawing — ${prices.baseLabel}`,
        });
        setUploadPhase("Payment received — uploading STEP file…");
        jobId = await uploadAndSubmitTechDrawJob({
          file,
          title: title.trim(),
          description: description.trim(),
          payment,
          onPhase,
        });
        toast.success("Payment received. Your drawing is processing.");
      } else {
        const prep = await prepareCadDrawingJob({
          file,
          title: title.trim(),
          description: description.trim(),
          requiresPayment: false,
          original_failed_job_id: isFreeRetryFlow ? freeRetryFor : undefined,
          onPhase,
        });
        jobId = prep.jobId;
        toast.success(
          isFreeRetryFlow
            ? "Free replacement upload started."
            : "Drawing pipeline started.",
        );
      }

      trackTechDrawUploadSuccess({ flowType, jobId, file });
      setUploadPhase("Opening job dashboard…");
      router.push(techDrawPipelineStatusPath(jobId));
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.meta?.message ||
        (axios.isAxiosError(err) && err.response?.data?.meta?.message) ||
        "Request failed";
      const text = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
      trackTechDrawUploadFailed({
        flowType: needsPaidFlow ? "paid" : flowTypeFromEligibility(eligibility),
        errorMessage: text,
      });
      setError(text);
      toast.error(text.length > 80 ? "Could not start the drawing pipeline." : text);
      submitLockRef.current = false;
      setSubmitting(false);
      setUploadPhase("");
    }
  };

  const priceShort = `$${Math.floor(prices.base)}`;
  const heroCtaLabel = eligibility?.free_run_available
    ? "Generate My Drawing — Free"
    : `Generate My Drawing — ${priceShort}`;

  const scrollToUpload = useCallback(() => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => fileInputRef.current?.focus(), 400);
  }, []);

  const handleLoginClose = useCallback(() => {
    setShowLogin(false);
    const shouldResume = pendingAfterLoginRef.current && isUserVerified();
    pendingAfterLoginRef.current = false;
    if (shouldResume) {
      refreshEligibility();
      window.setTimeout(() => {
        document
          .getElementById("cad-pipeline-submit-form")
          ?.requestSubmit?.();
      }, 200);
    }
  }, [refreshEligibility]);

  return (
    <>
      <CadDrawingPipelineHero
        priceShort={priceShort}
        ctaLabel={!eligibilityLoading ? heroCtaLabel : undefined}
        onGenerateClick={scrollToUpload}
      />

      <div className={styles.page}>
        <section
          id="cad-pipeline-upload"
          ref={uploadSectionRef}
          className={styles.uploadSection}
          aria-labelledby="cad-pipeline-upload-title"
        >
          {/* <h2 id="cad-pipeline-upload-title" className={styles.uploadSectionTitle}>
            Free Online <span className={styles.pageTitleAccent}>CAD Viewer</span>
          </h2>
          <div className={styles.uploadSectionSubtitle}>
            Secure, Fast &amp; Cloud-Based
          </div>
          <p className={styles.uploadSectionDesc}>
            A lightweight, online CAD viewer to quickly preview 3D models — anytime, anywhere.
          </p> */}

        {!eligibilityLoading && eligibility && !llmAvailable ? (
          <div
            className={`${styles.resultBanner} ${styles.resultBannerErr}`}
            style={{ marginBottom: 16, alignItems: "flex-start", gap: 12 }}
          >
            <span className={styles.resultIcon}>⚠</span>
            <div style={{ flex: 1 }}>
              <div className={styles.resultText}>AI service is unavailable</div>
              <div className={styles.resultSub}>{llmDownMessage}</div>
              <button
                type="button"
                onClick={refreshEligibility}
                disabled={eligibilityLoading}
                className={styles.runBtn}
                style={{
                  marginTop: 10,
                  padding: "6px 14px",
                  width: "auto",
                  fontSize: 13,
                }}
              >
                {eligibilityLoading ? "Checking…" : "Retry AI check"}
              </button>
            </div>
          </div>
        ) : null}

        {isFreeRetryFlow ? (
          <div
            className={`${styles.resultBanner} ${styles.resultBannerWarn}`}
            style={{ marginBottom: 16 }}
          >
            <span className={styles.resultIcon}>↻</span>
            <div>
              <div className={styles.resultText}>Free replacement upload</div>
              <div className={styles.resultSub}>{DIMENSION_EXTRACTION_FREE_RETRY_MSG}</div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className={`${styles.resultBanner} ${styles.resultBannerErr}`}>
            <span className={styles.resultIcon}>✕</span>
            <div>
              <div className={styles.resultText}>Could not start job</div>
              <div className={styles.resultSub}>{error}</div>
            </div>
          </div>
        ) : null}

        <div className={styles.uploadOnlyLayout}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>📐</div>
              <div className={styles.cardTitle}>Input configuration</div>
            </div>
            <div className={styles.cardBody}>
              <form id="cad-pipeline-submit-form" onSubmit={onSubmit}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".step,.stp"
                  className={styles.fileInputHidden}
                  onChange={onPickFile}
                  disabled={submitting}
                  aria-hidden
                  tabIndex={-1}
                />
                <div
                  className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDrag : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label="Choose STEP or STP file"
                  onClick={openFilePicker}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openFilePicker();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                >
                  <div className={styles.uploadIcon}>📦</div>
                  <div className={styles.uploadLabel}>Drop STEP / STP here</div>
                  <div className={styles.uploadHint}>
                    or click to browse · .step .stp · max {MAX_UPLOAD_LABEL}
                  </div>
                  {file ? (
                    <div className={styles.uploadFileName}>
                      ✓ {file.name} ({formatMb(file.size)})
                    </div>
                  ) : null}
                </div>
                {/* keep an warning or informative color for the following text */}
                <p className={styles.uploadHint} style={{ color: "#ff0000"}}>*Providing a clear title and detailed description helps the AI generate more accurate 2D drawings, dimensions, section views, and manufacturing-ready measurements.</p>
                <br />
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="cad-pipeline-title">
                    Drawing title
                  </label>
                  <input
                    id="cad-pipeline-title"
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Detailed Frigate Ship Model with Realistic Dimensions"
                    disabled={submitting}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="cad-pipeline-desc">
                    Description
                  </label>
                  <textarea
                    id="cad-pipeline-desc"
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Explore a highly detailed frigate ship model designed with dimensions closely matching an actual vessel. Ideal for maritime simulations and design projects."
                    disabled={submitting}
                  />
                </div>

                {uploadPhase ? (
                  <p className={styles.uploadPhaseHint}>{uploadPhase}</p>
                ) : null}

                {needsPaidFlow ? (
                  <p className={styles.uploadPhaseHint} style={{ marginBottom: 8 }}>
                    You will pay <strong>{prices.baseLabel}</strong> + tax ({prices.totalLabel})
                    first, then your file uploads.
                  </p>
                ) : null}

                <button
                  className={styles.runBtn}
                  type="submit"
                  disabled={submitting || !llmAvailable}
                  title={!llmAvailable ? llmDownMessage : undefined}
                >
                  {submitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden />
                      {uploadPhase || "Working…"}
                    </>
                  ) : !llmAvailable ? (
                    <>⚠ AI service unavailable</>
                  ) : needsPaidFlow ? (
                    <>▶ Pay {prices.baseLabel} & upload</>
                  ) : (
                    <>▶ Run drawing pipeline</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        </section>

        <CadDrawingPipelineHowItWorks />
      </div>

      {showLogin ? <UserLoginPupUp onClose={handleLoginClose} type="login" /> : null}
    </>
  );
}
