"use client";

import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { prepareCadDrawingJob } from "@/api/cadDrawingPipelineApi";
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
  const fileInputRef = useRef(null);
  const submitLockRef = useRef(false);

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
    setUploadPhase("Preparing upload…");

    try {
      const prep = await prepareCadDrawingJob({
        file,
        title: title.trim(),
        description: description.trim(),
        onPhase: (phase) => {
          if (phase === "upload-url") setUploadPhase("Requesting upload URL…");
          if (phase === "s3-upload") setUploadPhase("Uploading STEP file…");
          if (phase === "submit") setUploadPhase("Creating job in database…");
        },
      });

      setUploadPhase("Opening job dashboard…");
      router.push(`/dashboard/2d-technical-drawing/${prep.jobId}`);
    } catch (err) {
      const msg =
        err?.response?.data?.meta?.message ||
        (axios.isAxiosError(err) && err.response?.data?.meta?.message) ||
        err?.message ||
        "Request failed";
      const text = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
      setError(text);
      toast.error("Could not start the drawing pipeline.");
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
          Upload a STEP or STP file to generate technical drawings with AI-assisted views,
          dimensions, and exports (PDF, SVG, DXF). After the job is created, you will be taken
          to your job dashboard to track progress (and complete payment if required).
        </p>

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

                <button
                  type="button"
                  className={styles.advToggle}
                  onClick={() => setAdvOpen((v) => !v)}
                  disabled={submitting}
                >
                  <span className={`${styles.advChevron} ${advOpen ? styles.advChevronOpen : ""}`}>
                    ▶
                  </span>{" "}
                  Advanced options
                </button>
                <div className={`${styles.advPanel} ${advOpen ? styles.advPanelOpen : ""}`}>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Drawing standard</label>
                      <select className={styles.select} disabled={submitting} defaultValue="iso">
                        <option value="iso">ISO (1st angle)</option>
                        <option value="ansi">ANSI (3rd angle)</option>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Sheet size</label>
                      <select className={styles.select} disabled={submitting} defaultValue="A3">
                        <option value="A3">A3 (420×297mm)</option>
                        <option value="A2">A2 (594×420mm)</option>
                        <option value="A4">A4 (297×210mm)</option>
                      </select>
                    </div>
                  </div>
                  <p className={styles.hint}>
                    Advanced fields are UI-only for now; wire them to the API when the backend
                    accepts them.
                  </p>
                </div>

                {uploadPhase ? (
                  <p className={styles.uploadPhaseHint}>{uploadPhase}</p>
                ) : null}

                <button className={styles.runBtn} type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden />
                      {uploadPhase || "Starting pipeline…"}
                    </>
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
