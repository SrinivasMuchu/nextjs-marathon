"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { STEP_EXT } from "./pipelineConstants";
import styles from "./CadDrawingPipeline.module.css";

export default function CadDrawingPipelineView() {
  const router = useRouter();
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
  const fileInputRef = useRef(null);
  const submitLockRef = useRef(false);

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
    if (f && STEP_EXT.test(f.name)) pickFile(f);
    else if (f) toast.error("Only .step or .stp files are allowed.");
  };

  const needsPaidFlow =
    eligibility && !eligibility.free_run_available && !eligibilityLoading;

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

    submitLockRef.current = true;
    setSubmitting(true);
    setError("");

    try {
      const onPhase = (phase) => {
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
          onPhase,
        });
        jobId = prep.jobId;
        toast.success("Drawing pipeline started.");
      }

      setUploadPhase("Opening job dashboard…");
      router.push(`/dashboard/2d-technical-drawing/${jobId}`);
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.meta?.message ||
        (axios.isAxiosError(err) && err.response?.data?.meta?.message) ||
        "Request failed";
      const text = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
      setError(text);
      toast.error(text.length > 80 ? "Could not start the drawing pipeline." : text);
      submitLockRef.current = false;
      setSubmitting(false);
      setUploadPhase("");
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>M</div>
            <div>
              <div className={styles.logoText}>Marathon-OS</div>
              <div className={styles.logoSub}>Engineering · Manufacturing · Supply Chain</div>
            </div>
          </div>
          <div className={styles.headerBadge}>CAD Pipeline v1.0</div>
        </header>

        <h1 className={styles.pageTitle}>
          Drawing <span className={styles.pageTitleAccent}>Pipeline</span>
        </h1>
        <p className={styles.pageDesc}>
          Upload a STEP or STP file to generate technical drawings. Your first job is free.
          After that, you pay {prices.baseLabel} (+ tax) first, then your file is uploaded and
          processing starts.
        </p>

        {!eligibilityLoading && eligibility ? (
          <div
            className={`${styles.resultBanner} ${
              eligibility.free_run_available ? styles.resultBannerOk : styles.resultBannerWarn
            }`}
            style={{ marginBottom: 16 }}
          >
            <span className={styles.resultIcon}>
              {eligibility.free_run_available ? "✓" : "💳"}
            </span>
            <div>
              <div className={styles.resultText}>
                {eligibility.free_run_available
                  ? `Your first drawing is free (${prices.baseLabel})`
                  : `Pay ${prices.baseLabel} before upload`}
              </div>
              <div className={styles.resultSub}>
                {eligibility.free_run_available
                  ? "Upload your STEP file and processing starts immediately."
                  : `Step 1: Pay ${prices.baseLabel} + tax (${prices.totalLabel}). Step 2: Your STEP file uploads automatically. Step 3: Pipeline runs.`}
              </div>
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
              <form onSubmit={onSubmit}>
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
                  <div className={styles.uploadHint}>or click to browse · .step .stp</div>
                  {file ? <div className={styles.uploadFileName}>✓ {file.name}</div> : null}
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="cad-pipeline-title">
                    Drawing title
                  </label>
                  <input
                    id="cad-pipeline-title"
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Industrial Pump Housing CAD Model"
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
                    placeholder="Notes for the LLM / title block"
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

                <button className={styles.runBtn} type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden />
                      {uploadPhase || "Working…"}
                    </>
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
      </div>
    </div>
  );
}
