"use client";

import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowRight, Search, Upload } from "lucide-react";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import {
  CAD_MATCH_ALLOWED_EXT,
  cadMatchStatusPath,
  getOrCreateCadMatchUuid,
  prepareCadMatchJob,
} from "@/api/cadMatchApi";
import styles from "./CadMatch.module.css";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const FORMAT_PILLS = ["STEP", "STL", "OBJ", "PLY", "IGES", "GLB", "OFF"];

function isUserVerified() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem("is_verified"));
}

function formatMb(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CadMatchView() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const submitLockRef = useRef(false);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState("");
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  React.useEffect(() => {
    getOrCreateCadMatchUuid();
  }, []);

  const pickFile = useCallback((f) => {
    if (!f) return;
    if (!CAD_MATCH_ALLOWED_EXT.test(f.name)) {
      toast.error("Unsupported format. Use STEP, STL, OBJ, PLY, IGES, OFF, or GLB.");
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      const msg = `File is ${formatMb(f.size)}. Maximum allowed size is 100 MB.`;
      setError(msg);
      toast.error(msg);
      return;
    }
    setFile(f);
    setError("");
  }, []);

  const onPickFile = (e) => {
    pickFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const openPicker = () => {
    if (submitting) return;
    fileInputRef.current?.click();
  };

  const runMatch = async () => {
    if (submitLockRef.current || submitting) return;
    if (!file) {
      toast.error("Choose a CAD file first.");
      return;
    }
    if (!isUserVerified()) {
      setShowLogin(true);
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const { job_id: jobId } = await prepareCadMatchJob({
        file,
        onPhase: setPhase,
      });
      toast.success("Match started.");
      router.push(cadMatchStatusPath(jobId));
    } catch (err) {
      const msg = err?.message || "Could not start CAD match.";
      setError(msg);
      toast.error(msg);
      setPhase("");
    } finally {
      setSubmitting(false);
      submitLockRef.current = false;
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>CAD Match</span>
        <h1 className={styles.title}>Find similar CAD designs</h1>
        <p className={styles.subtitle}>
          Upload your part and we&apos;ll match it against live designs in the Marathon
          library — top 10 by shape similarity.
        </p>
      </header>

      <div className={styles.card}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".step,.stp,.stl,.obj,.ply,.off,.iges,.igs,.glb,.gltf"
          hidden
          onChange={onPickFile}
        />

        <div
          className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ""} ${
            submitting ? styles.dropzoneDisabled : ""
          }`}
          onClick={openPicker}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            pickFile(e.dataTransfer.files?.[0]);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openPicker();
          }}
        >
          <div className={styles.dropIcon}>
            <Upload size={22} />
          </div>
          <p className={styles.dropTitle}>Drop your CAD file here</p>
          <p className={styles.dropHint}>or click to browse — up to 100 MB</p>
        </div>

        {file ? (
          <div className={styles.fileChip}>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileMeta}>{formatMb(file.size)}</span>
          </div>
        ) : null}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={openPicker}
            disabled={submitting}
          >
            {file ? "Change file" : "Choose file"}
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={runMatch}
            disabled={!file || submitting}
          >
            <Search size={16} />
            {submitting ? "Matching…" : "Find similar designs"}
            {!submitting ? <ArrowRight size={16} /> : null}
          </button>
        </div>

        {phase ? <p className={styles.phase}>{phase}</p> : null}
        {error ? <div className={styles.error}>{error}</div> : null}

        <div className={styles.formats}>
          {FORMAT_PILLS.map((f) => (
            <span key={f} className={styles.formatPill}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {showLogin ? (
        <UserLoginPupUp
          type="login"
          onClose={() => {
            setShowLogin(false);
            if (isUserVerified()) {
              toast.info("Signed in — click Find similar designs again.");
            }
          }}
        />
      ) : null}
    </div>
  );
}
