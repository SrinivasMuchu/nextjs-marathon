"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import {
  buildUserGdtFromForm,
  checkGdtEligibility,
  getOrCreateGdtUuid,
  gdtPipelineStatusPath,
  uploadAndSubmitGdtJob,
} from "@/api/gdtPipelineApi";
import styles from "./GdtPipeline.module.css";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const STEP_EXT = /\.(step|stp)$/i;

function isUserVerified() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem("is_verified"));
}

function formatMb(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GdtPipelineView() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const submitLockRef = useRef(false);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [flatness, setFlatness] = useState("");
  const [perpendicularity, setPerpendicularity] = useState("");
  const [positionDefault, setPositionDefault] = useState("");
  const [profileSurface, setProfileSurface] = useState("");
  const [holeFit, setHoleFit] = useState("");
  const [datumA, setDatumA] = useState("");
  const [datumB, setDatumB] = useState("");
  const [datumC, setDatumC] = useState("");

  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadPhase, setUploadPhase] = useState("");
  const [error, setError] = useState("");
  const [eligibility, setEligibility] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    getOrCreateGdtUuid();
    checkGdtEligibility()
      .then(setEligibility)
      .catch(() => setEligibility(null));
  }, []);

  const pickFile = useCallback((f) => {
    if (!f) return;
    if (!STEP_EXT.test(f.name)) {
      setError("Only .step / .stp files are supported.");
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      setError(`File is too large (${formatMb(f.size)}). Max 100 MB.`);
      return;
    }
    setError("");
    setFile(f);
    if (!title) setTitle(f.name.replace(STEP_EXT, ""));
  }, [title]);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer?.files?.[0];
      pickFile(f);
    },
    [pickFile],
  );

  const runSubmit = useCallback(async () => {
    if (submitLockRef.current || submitting) return;
    if (!file) {
      setError("Choose a STEP file first.");
      return;
    }
    if (!isUserVerified()) {
      setShowLogin(true);
      return;
    }
    if (eligibility && eligibility.llm_available === false) {
      setError(
        eligibility.llm_status
          ? `AI service unavailable (${eligibility.llm_status}). Try again shortly.`
          : "AI service is temporarily unavailable. Try again shortly.",
      );
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    setError("");
    setUploadPhase("Preparing…");

    try {
      const userGdt = buildUserGdtFromForm({
        flatness_mm: flatness,
        perpendicularity_mm: perpendicularity,
        position_default_mm: positionDefault,
        profile_surface_mm: profileSurface,
        hole_fit: holeFit,
        datum_a: datumA,
        datum_b: datumB,
        datum_c: datumC,
      });

      const result = await uploadAndSubmitGdtJob({
        file,
        title: title.trim() || file.name,
        description: description.trim(),
        selectedPartId: selectedPartId.trim() || undefined,
        userGdt,
        onPhase: (p) => {
          const labels = {
            requesting_upload_url: "Requesting upload URL…",
            uploading: "Uploading STEP…",
            submitting: "Starting GD&T pipeline…",
            queued: "Queued",
          };
          setUploadPhase(labels[p] || p);
        },
      });

      const jobId = result?.job_id;
      if (!jobId) throw new Error("No job id returned from server.");
      toast.success("GD&T job started");
      router.push(gdtPipelineStatusPath(jobId));
    } catch (err) {
      const msg = err?.message || "Failed to start GD&T job.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
      submitLockRef.current = false;
      setUploadPhase("");
    }
  }, [
    file,
    title,
    description,
    selectedPartId,
    flatness,
    perpendicularity,
    positionDefault,
    profileSurface,
    holeFit,
    datumA,
    datumB,
    datumC,
    eligibility,
    submitting,
    router,
  ]);

  return (
    <div className={styles.root}>
      <header className={styles.hero}>
        <p className={styles.brand}>Marathon GD&amp;T</p>
        <h1>Apply GD&amp;T to a STEP part</h1>
        <p className={styles.heroLead}>
          Upload a STEP file, optionally set datums and tolerances, and we fill
          any blanks with Qwen. Separate from the 2D TechDraw dimension pipeline.
        </p>
      </header>

      <div className={styles.panel}>
        <div className={styles.card}>
          <div
            className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
          >
            <strong>Drop STEP / STP here</strong>
            <p>or click to browse · max 100 MB</p>
            {file ? <div className={styles.fileName}>{file.name} ({formatMb(file.size)})</div> : null}
            <input
              ref={fileInputRef}
              type="file"
              accept=".step,.stp,application/step"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </div>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label} htmlFor="gdt-title">Title</label>
              <input
                id="gdt-title"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Part name"
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="gdt-part">Selected part (optional)</label>
              <input
                id="gdt-part"
                className={styles.input}
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                placeholder="Solid name or index in assembly"
              />
              <p className={styles.hint}>For multi-body STEP: which solid to annotate</p>
            </div>
          </div>

          <div style={{ marginTop: "0.85rem" }}>
            <label className={styles.label} htmlFor="gdt-desc">Description</label>
            <textarea
              id="gdt-desc"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional context for AI (function, mating, material…)"
            />
          </div>

          <h2 className={styles.sectionTitle}>Tolerances &amp; datums</h2>
          <p className={styles.optionalNote}>
            Leave blank to let Qwen suggest values. Your values override AI when set.
          </p>

          <div className={styles.grid2}>
            <div>
              <label className={styles.label} htmlFor="gdt-flat">Flatness (mm)</label>
              <input
                id="gdt-flat"
                className={styles.input}
                inputMode="decimal"
                value={flatness}
                onChange={(e) => setFlatness(e.target.value)}
                placeholder="e.g. 0.05"
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="gdt-perp">Perpendicularity (mm)</label>
              <input
                id="gdt-perp"
                className={styles.input}
                inputMode="decimal"
                value={perpendicularity}
                onChange={(e) => setPerpendicularity(e.target.value)}
                placeholder="e.g. 0.1"
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="gdt-pos">Position default (mm)</label>
              <input
                id="gdt-pos"
                className={styles.input}
                inputMode="decimal"
                value={positionDefault}
                onChange={(e) => setPositionDefault(e.target.value)}
                placeholder="e.g. 0.25"
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="gdt-prof">Profile of surface (mm)</label>
              <input
                id="gdt-prof"
                className={styles.input}
                inputMode="decimal"
                value={profileSurface}
                onChange={(e) => setProfileSurface(e.target.value)}
                placeholder="e.g. 0.4"
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="gdt-fit">Hole fit</label>
              <input
                id="gdt-fit"
                className={styles.input}
                value={holeFit}
                onChange={(e) => setHoleFit(e.target.value)}
                placeholder="e.g. H7"
              />
            </div>
          </div>

          <div className={styles.grid2} style={{ marginTop: "0.85rem" }}>
            <div>
              <label className={styles.label} htmlFor="gdt-da">Datum A</label>
              <input
                id="gdt-da"
                className={styles.input}
                value={datumA}
                onChange={(e) => setDatumA(e.target.value)}
                placeholder="Face id / hint (optional)"
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="gdt-db">Datum B</label>
              <input
                id="gdt-db"
                className={styles.input}
                value={datumB}
                onChange={(e) => setDatumB(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="gdt-dc">Datum C</label>
              <input
                id="gdt-dc"
                className={styles.input}
                value={datumC}
                onChange={(e) => setDatumC(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnPrimary}
              disabled={submitting || !file}
              onClick={runSubmit}
            >
              {submitting ? "Starting…" : "Run GD&T pipeline"}
            </button>
          </div>
          {uploadPhase ? <p className={styles.phase}>{uploadPhase}</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}
        </div>
      </div>

      {showLogin ? (
        <UserLoginPupUp
          onClose={() => {
            setShowLogin(false);
            if (isUserVerified()) {
              runSubmit();
            }
          }}
          type="login"
        />
      ) : null}
    </div>
  );
}
