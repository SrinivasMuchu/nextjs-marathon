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
} from "@/api/cadDrawingPipelineApi";
import useTechDrawPriceDisplay from "./useTechDrawPriceDisplay";
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
import { fetchLibrarySourceFile } from "@/api/librarySourceApi";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import { useConsumeHomeFile } from "@/Components/HomePages/HomeLandingNew/useConsumeHomeFile";
import { convertedFiles } from "@/common.helper";
import { ArrowUp, Info } from "lucide-react";
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

function TrustLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="10.5" width="12" height="8.5" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 10.5V8.2a3 3 0 0 1 6 0v2.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function CadDrawingPipelineView({ initialPrices }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const freeRetryFor = String(searchParams.get("freeRetryFor") || "").trim();
  const isFreeRetryFlow = Boolean(freeRetryFor);
  const [file, setFile] = useState(null);
  const [formStep, setFormStep] = useState("upload");
  const [sampleLoading, setSampleLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gdtStandard, setGdtStandard] = useState("ASME");
  const [datumPreferences, setDatumPreferences] = useState("");
  const [chooseDatums, setChooseDatums] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadPhase, setUploadPhase] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const fileInputRef = useRef(null);
  const submitLockRef = useRef(false);
  const pendingAfterLoginRef = useRef(false);
  const librarySourceLoadedRef = useRef("");

  const catalogPrices = useTechDrawPriceDisplay(initialPrices);
  const prices = useMemo(() => {
    if (eligibility?.price != null && Number.isFinite(Number(eligibility.price))) {
      return getTechDrawPriceDisplay(eligibility.price, eligibility.price_with_gst);
    }
    return catalogPrices;
  }, [eligibility, catalogPrices]);

  useEffect(() => {
    getOrCreateTechDrawUuid();
  }, []);

  useEffect(() => {
    const onApply = (event) => {
      const note = String(event.detail?.note || "").trim();
      if (!note) return;
      setDescription((current) => (current.includes(note) ? current : current.trim() ? `${current.trim()}\n${note}` : note));
      document.getElementById("cad-pipeline-upload")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      toast.info(event.detail?.toast || "Added to your drawing description.");
    };
    window.addEventListener("cad-pipeline-apply", onApply);
    return () => window.removeEventListener("cad-pipeline-apply", onApply);
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

  useEffect(() => {
    if (formStep !== "details") return;
    document.getElementById("cad-pipeline-upload")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [formStep]);

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
    setFormStep("details");
  }, []);

  useConsumeHomeFile(pickFile);

  // Prefill STEP from library design (?source=designId)
  useEffect(() => {
    const sourceId = String(searchParams.get("source") || "").trim();
    if (!sourceId || !/^[a-f0-9]{24}$/i.test(sourceId)) return undefined;
    if (librarySourceLoadedRef.current === sourceId) return undefined;
    if (file || isFreeRetryFlow) return undefined;

    let cancelled = false;
    librarySourceLoadedRef.current = sourceId;

    (async () => {
      try {
        if (!isUserVerified()) {
          setShowLogin(true);
          librarySourceLoadedRef.current = "";
          return;
        }
        setUploadPhase("Loading library STEP file…");
        const source = await fetchLibrarySourceFile(sourceId);
        if (cancelled) return;
        if (source.pageTitle) {
          setTitle((prev) => prev || source.pageTitle.slice(0, 120));
        }
        pickFile(source.file);
        toast.success("Library STEP file loaded.");
      } catch (err) {
        librarySourceLoadedRef.current = "";
        const msg = err?.message || "Could not load library file.";
        setError(msg);
        toast.error(msg);
      } finally {
        if (!cancelled) setUploadPhase("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, file, isFreeRetryFlow, pickFile]);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    pickFile(f);
    e.target.value = "";
  };

  const openFilePicker = useCallback(() => {
    if (submitting || submitLockRef.current) return;
    fileInputRef.current?.click();
  }, [submitting]);

  const clearFile = useCallback(
    (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      if (submitting || submitLockRef.current) return;
      setFile(null);
      setError("");
      setFormStep("upload");
    },
    [submitting],
  );

  const loadSample = useCallback(async () => {
    if (submitting || submitLockRef.current || sampleLoading) return;
    const sample = convertedFiles.find((item) => item.format === "step");
    if (!sample?.url) {
      toast.error("Sample STEP file is unavailable.");
      return;
    }
    setSampleLoading(true);
    try {
      const response = await fetch(sample.url);
      if (!response.ok) throw new Error("sample fetch failed");
      const blob = await response.blob();
      pickFile(
        new File([blob], sample.name || "sample.step", {
          type: blob.type || "application/octet-stream",
        }),
      );
    } catch {
      toast.error("Could not load the sample STEP file.");
    } finally {
      setSampleLoading(false);
    }
  }, [pickFile, sampleLoading, submitting]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    pickFile(f);
  };

  // Uploads are always free; the server charges at download time.
  const needsPaidDownload =
    !isFreeRetryFlow &&
    !eligibilityLoading &&
    Boolean(
      eligibility?.requires_payment_at_download ??
        (eligibility && !eligibility.free_run_available),
    );

  const llmAvailable = useMemo(() => isLlmAvailable(eligibility), [eligibility]);
  const llmDownMessage = useMemo(
    () => (llmAvailable ? "" : getLlmDownMessage(eligibility?.llm_status)),
    [llmAvailable, eligibility],
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    if (submitLockRef.current || submitting) return;

    if (formStep !== "details") {
      if (file) setFormStep("details");
      return;
    }

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

    const flowType = needsPaidDownload ? "paid" : flowTypeFromEligibility(eligibility);
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

      // Upload and generation are always free; payment is collected at download.
      const prep = await prepareCadDrawingJob({
        file,
        title: title.trim(),
        description: description.trim(),
        requiresPayment: false,
        original_failed_job_id: isFreeRetryFlow ? freeRetryFor : undefined,
        gdt_standard: gdtStandard,
        datum_preferences: datumPreferences.trim(),
        choose_datums: chooseDatums,
        onPhase,
      });
      const jobId = prep.jobId;
      toast.success(
        isFreeRetryFlow
          ? "Free replacement upload started."
          : "Drawing pipeline started.",
      );

      trackTechDrawUploadSuccess({
        flowType: flowTypeFromEligibility(freshEligibility),
        jobId,
        file,
      });
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
        flowType: needsPaidDownload ? "paid" : flowTypeFromEligibility(eligibility),
        errorMessage: text,
      });
      setError(text);
      toast.error(text.length > 80 ? "Could not start the drawing pipeline." : text);
      submitLockRef.current = false;
      setSubmitting(false);
      setUploadPhase("");
    }
  };

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
        <div className={`${styles.resultBanner} ${styles.resultBannerErr}`} style={{ marginBottom: 16 }}>
          <span className={styles.resultIcon}>✕</span>
          <div>
            <div className={styles.resultText}>Could not start job</div>
            <div className={styles.resultSub}>{error}</div>
          </div>
        </div>
      ) : null}

      <div className={styles.heroCard}>
        <form id="cad-pipeline-submit-form" className={styles.heroForm} onSubmit={onSubmit}>
          <div className={styles.heroCardHead}>
            <h2>{formStep === "details" ? "Drawing details" : "Upload your STEP file"}</h2>
            <span className={styles.heroSecure}>
              <TrustLock />
              Secure
            </span>
          </div>
          <p className={styles.heroStepEyebrow}>
            {formStep === "details" ? "Step 2 of 2" : "Step 1 of 2"}
          </p>
          <p className={styles.heroCardLede}>
            {formStep === "details"
              ? "Add a title, description, and drawing standard before the pipeline starts."
              : "Choose one STEP file. The next step asks for the drawing title and description."}
          </p>

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

          {formStep === "details" && file ? (
            <>
              <div className={styles.heroFileBar}>
                <span className={styles.heroFileBadge} aria-hidden>
                  STP
                </span>
                <span className={styles.heroFileMeta}>
                  <strong>{file.name}</strong>
                  <small>{formatMb(file.size)} selected</small>
                </span>
                <button
                  type="button"
                  className={styles.heroFileChange}
                  onClick={openFilePicker}
                  disabled={submitting}
                >
                  Change
                </button>
              </div>

              <div className={styles.pipelineInfoTip}>
                <Info size={15} strokeWidth={1.9} aria-hidden />
                <p>
                  A clear title and description help the engine place dimensions, section views, and
                  manufacturing-ready measurements more accurately.
                </p>
              </div>

              <label className={styles.pipelineHeroFieldLabel} htmlFor="cad-pipeline-title">
                Drawing title
              </label>
              <input
                id="cad-pipeline-title"
                className={styles.pipelineHeroInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bracket, third-angle, millimetres"
                disabled={submitting}
              />

              <label
                className={`${styles.pipelineHeroFieldLabel} ${styles.pipelineHeroFieldLabelSpaced}`}
                htmlFor="cad-pipeline-desc"
              >
                Description
              </label>
              <textarea
                id="cad-pipeline-desc"
                className={styles.pipelineHeroTextarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notes for views, units, sheet size, or features to dimension."
                disabled={submitting}
                rows={4}
              />

              <div className={styles.gdtPanel}>
                <div className={styles.gdtPanelTitle}>GD&amp;T datums</div>
                <p className={styles.gdtPanelLead}>
                  Optional. The drawing engine proposes datum faces from the model. You can steer
                  that choice, or pick the exact A / B / C frame after views are captured.
                </p>
                <fieldset className={styles.gdtStandardRow} disabled={submitting}>
                  <legend className={styles.pipelineHeroFieldLabel}>Standard</legend>
                  <label className={styles.gdtRadio}>
                    <input
                      type="radio"
                      name="gdt-standard"
                      value="ASME"
                      checked={gdtStandard === "ASME"}
                      onChange={() => setGdtStandard("ASME")}
                    />
                    ASME Y14.5
                  </label>
                  <label className={styles.gdtRadio}>
                    <input
                      type="radio"
                      name="gdt-standard"
                      value="ISO"
                      checked={gdtStandard === "ISO"}
                      onChange={() => setGdtStandard("ISO")}
                    />
                    ISO GPS
                  </label>
                </fieldset>
                <label
                  className={`${styles.pipelineHeroFieldLabel} ${styles.pipelineHeroFieldLabelSpaced}`}
                  htmlFor="cad-pipeline-datums"
                >
                  Datum notes <span className={styles.gdtOptional}>(optional)</span>
                </label>
                <textarea
                  id="cad-pipeline-datums"
                  className={styles.pipelineHeroTextarea}
                  value={datumPreferences}
                  onChange={(e) => setDatumPreferences(e.target.value)}
                  placeholder="e.g. Primary datum is the mounting face."
                  disabled={submitting}
                  rows={3}
                />
                <label className={styles.gdtCheck}>
                  <input
                    type="checkbox"
                    checked={chooseDatums}
                    disabled={submitting}
                    onChange={(e) => setChooseDatums(e.target.checked)}
                  />
                  <span>I&apos;ll pick datum features A / B / C after the model is analyzed</span>
                </label>
              </div>

              <button
                className={styles.heroGenerate}
                type="submit"
                disabled={submitting || !llmAvailable}
                title={!llmAvailable ? llmDownMessage : undefined}
              >
                {submitting ? uploadPhase || "Working…" : !llmAvailable ? "AI service unavailable" : "Generate 2D drawings"}
              </button>

              <button
                type="button"
                className={styles.heroBack}
                onClick={() => setFormStep("upload")}
                disabled={submitting}
              >
                Back to file
              </button>
            </>
          ) : (
            <>
              <div
                className={`${styles.heroDrop} ${dragOver ? styles.heroDropActive : ""}`}
                onClick={openFilePicker}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                {file ? (
                  <div className={styles.heroFileRow}>
                    <span className={styles.heroFileBadge} aria-hidden>
                      STP
                    </span>
                    <span className={styles.heroFileMeta}>
                      <strong>{file.name}</strong>
                      <small>{formatMb(file.size)} selected</small>
                    </span>
                    <button
                      type="button"
                      className={styles.heroFileRemove}
                      onClick={clearFile}
                      disabled={submitting}
                      aria-label="Remove selected file"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={styles.heroDropIcon} aria-hidden>
                      <ArrowUp size={18} strokeWidth={2.2} />
                    </span>
                    <p className={styles.heroDropTitle}>Drag and drop your STEP file here</p>
                    <p className={styles.heroDropHint}>or choose a file from your computer</p>
                  </>
                )}
                <button
                  type="button"
                  className={styles.heroBrowse}
                  onClick={(event) => {
                    event.stopPropagation();
                    openFilePicker();
                  }}
                  disabled={submitting}
                >
                  Browse files
                </button>
                <p className={styles.heroDropLimit}>Maximum file size: {MAX_UPLOAD_LABEL}</p>
              </div>

              <div className={styles.heroFormats}>
                <div>
                  <span>Input format</span>
                  <div className={styles.heroFormatBox}>
                    <strong>STEP (.step, .stp)</strong>
                    <small>{file ? file.name : "STEP file"}</small>
                  </div>
                </div>
                <span className={styles.heroFormatArrow} aria-hidden>
                  →
                </span>
                <div>
                  <span>Output</span>
                  <div className={styles.heroFormatBox}>
                    <strong>2D drawing set</strong>
                    <small>PDF, DXF, SVG, PNG, FCStd</small>
                  </div>
                </div>
              </div>

              {file ? (
                <button
                  className={styles.heroGenerate}
                  type="button"
                  onClick={() => setFormStep("details")}
                  disabled={submitting}
                >
                  Continue
                </button>
              ) : (
                <button type="button" className={`${styles.heroGenerate} ${styles.heroGenerateIdle}`} onClick={openFilePicker}>
                  Generate 2D drawings
                </button>
              )}

              <p className={styles.heroSampleLine}>
                No STEP file available? Try a STEP sample to see the drawing workflow.
              </p>
              <button
                type="button"
                className={styles.heroSampleBtn}
                onClick={loadSample}
                disabled={submitting || sampleLoading}
              >
                {sampleLoading ? "Loading sample…" : "Try sample.step"}
              </button>
            </>
          )}

          <p className={styles.heroPriceNote}>
            <Info size={15} strokeWidth={1.9} aria-hidden />
            <span>
              {prices.totalLabel ? (
                <>
                  <strong>{prices.totalLabel} per drawing set</strong>, with every format included.
                </>
              ) : (
                <strong>Every format is included.</strong>
              )}{" "}
              Most sets are ready in under 4 minutes.{" "}
              <a href="#whats-included">What&apos;s included</a>
            </span>
          </p>

          {uploadPhase ? <p className={styles.heroPhase}>{uploadPhase}</p> : null}
        </form>
      </div>

      {showLogin ? <UserLoginPupUp onClose={handleLoginClose} type="login" /> : null}
    </>
  );
}
