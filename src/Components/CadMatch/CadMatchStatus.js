"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Box, FileBox } from "lucide-react";
import HoverImageSequence from "@/Components/CommonJsx/RotatedImages";
import {
  CadMatchPollError,
  getCadMatchJobStatus,
  similarityPercent,
  waitForCadMatchJob,
} from "@/api/cadMatchApi";
import styles from "./CadMatch.module.css";

const STAGE_LABELS = {
  DOWNLOAD: "Downloading",
  MESH: "Reading geometry",
  EMBED: "Computing shape embedding",
  FINGERPRINT: "Computing shape embedding",
  SEARCH: "Searching library",
};

function statusBadgeClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return styles.badgeDone;
  if (s === "FAILED") return styles.badgeFail;
  return styles.badgeRunning;
}

function resolvePreviewUrl(glbUrl, inputFileUrl, jobId) {
  // Prefer same-origin proxy — CloudFront match previews often lack CORS,
  // which leaves <model-viewer> as a black empty box.
  if (jobId && glbUrl) {
    return `/api/cad-match-preview?jobId=${encodeURIComponent(jobId)}`;
  }
  if (glbUrl) return glbUrl;
  // Native GLB/GLTF uploads can be previewed directly if the worker skipped export.
  const src = String(inputFileUrl || "");
  if (/\.(glb|gltf)(\?|#|$)/i.test(src)) return src;
  return null;
}

function ensureModelViewer() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.customElements?.get("model-viewer")) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector(
      "script[data-cad-match-model-viewer]",
    );
    const onReady = () => {
      if (window.customElements?.get("model-viewer")) {
        resolve(true);
        return;
      }
      window.customElements
        ?.whenDefined("model-viewer")
        .then(() => resolve(true))
        .catch(() => resolve(false));
    };
    if (existing) {
      existing.addEventListener("load", onReady, { once: true });
      // Already loaded earlier in the session.
      onReady();
      return;
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    script.dataset.cadMatchModelViewer = "1";
    script.addEventListener("load", onReady, { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.appendChild(script);
  });
}

function QueryPreview({ glbUrl, inputFileUrl, fileName, isRunning, jobId }) {
  const previewUrl = resolvePreviewUrl(glbUrl, inputFileUrl, jobId);
  const [viewerReady, setViewerReady] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoadError("");
    if (!previewUrl) {
      setViewerReady(false);
      return undefined;
    }
    ensureModelViewer().then((ok) => {
      if (!cancelled) setViewerReady(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [previewUrl]);

  // model-viewer fetch needs the session uuid when using our proxy.
  useEffect(() => {
    if (!previewUrl || !viewerReady || typeof window === "undefined") {
      return undefined;
    }
    const el = document.querySelector(
      `[data-cad-match-query-viewer="1"]`,
    );
    if (!el) return undefined;

    const onErr = () =>
      setLoadError("Could not load 3D preview. Try refreshing the page.");
    const onLoad = () => setLoadError("");
    el.addEventListener("error", onErr);
    el.addEventListener("load", onLoad);

    // Attach Authorization-less uuid header via interceptor: model-viewer
    // does not support custom headers, so the proxy also accepts cookie-less
    // requests when job preview is public-to-owner via uuid query fallback.
    return () => {
      el.removeEventListener("error", onErr);
      el.removeEventListener("load", onLoad);
    };
  }, [previewUrl, viewerReady]);

  if (previewUrl && viewerReady) {
    const uuid =
      typeof window !== "undefined"
        ? localStorage.getItem("uuid") || ""
        : "";
    // Pass uuid as query param — <model-viewer> cannot set request headers.
    const src =
      previewUrl.startsWith("/api/cad-match-preview") && uuid
        ? `${previewUrl}&uuid=${encodeURIComponent(uuid)}`
        : previewUrl;
    return (
      <div className={styles.queryPreview}>
        {React.createElement("model-viewer", {
          "data-cad-match-query-viewer": "1",
          src,
          alt: fileName || "Uploaded CAD",
          "camera-controls": true,
          "touch-action": "pan-y",
          "auto-rotate": true,
          "shadow-intensity": "0.6",
          exposure: "1.2",
          "environment-image": "neutral",
          "interaction-prompt": "none",
          style: {
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle at 50% 40%, #2a2f3a 0%, #12141a 70%)",
          },
        })}
        {loadError ? (
          <div className={styles.queryPlaceholder} style={{ position: "absolute", inset: 0 }}>
            <FileBox size={40} strokeWidth={1.5} />
            <span>{loadError}</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.queryPlaceholder}>
      <FileBox size={40} strokeWidth={1.5} />
      <span>
        {isRunning || (previewUrl && !viewerReady)
          ? "Generating 3D preview…"
          : "3D preview unavailable"}
      </span>
    </div>
  );
}

export default function CadMatchStatus({ jobId }) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const abortRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!jobId || startedRef.current) return undefined;
    startedRef.current = true;

    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const first = await getCadMatchJobStatus(jobId);
        setJob(first);
        setLoading(false);
        const st = String(first?.status || "").toUpperCase();
        if (st === "COMPLETED" || st === "FAILED") {
          if (st === "FAILED") {
            setError(first?.error_message || "Match failed.");
          }
          return;
        }

        const done = await waitForCadMatchJob(jobId, {
          signal: ac.signal,
          onUpdate: (j) => setJob(j),
        });
        setJob(done);
      } catch (err) {
        if (ac.signal.aborted) return;
        const msg =
          err instanceof CadMatchPollError
            ? err.message
            : err?.message || "Could not load match status.";
        setError(msg);
        if (err?.job) setJob(err.job);
        toast.error(msg);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => {
      ac.abort();
    };
  }, [jobId]);

  const status = String(job?.status || (loading ? "PENDING" : "")).toUpperCase();
  const stage = job?.pipeline_stage
    ? STAGE_LABELS[job.pipeline_stage] || job.pipeline_stage
    : null;
  const matches = Array.isArray(job?.matches)
    ? [...job.matches].sort((a, b) => Number(b?.score || 0) - Number(a?.score || 0))
    : [];
  const isRunning = status === "PENDING" || status === "PROCESSING";
  const showResults = status === "COMPLETED" || (status === "FAILED" && matches.length > 0);

  return (
    <div className={styles.page}>
      <div className={styles.statusHeader}>
        <div className={styles.statusLabel}>CAD Match</div>
        <h1 className={styles.statusTitle}>
          {status === "COMPLETED"
            ? matches.length > 0
              ? "Your design & similar matches"
              : "No close matches found"
            : status === "FAILED"
              ? "Match failed"
              : "Finding similar designs…"}
        </h1>
        <div className={styles.statusRow}>
          <span className={`${styles.badge} ${statusBadgeClass(status)}`}>
            {status || "…"}
          </span>
          {stage && isRunning ? <span>{stage}</span> : null}
          {status === "COMPLETED" && job?.indexed_designs_searched != null ? (
            <span>Searched {job.indexed_designs_searched} indexed designs</span>
          ) : null}
          {job?.time_taken_seconds != null && status === "COMPLETED" ? (
            <span>{job.time_taken_seconds}s</span>
          ) : null}
        </div>
      </div>

      {isRunning ? (
        <div className={styles.card}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
          <p className={styles.phase}>
            {stage || "Working…"} — computing shape embedding and searching the library.
          </p>
        </div>
      ) : null}

      {error ? <div className={styles.error}>{error}</div> : null}

      {isRunning || showResults || status === "COMPLETED" ? (
        <div className={styles.compareLayout}>
          <section className={styles.querySection} aria-label="Uploaded design">
            <div className={styles.sectionHeading}>
              <Box size={16} />
              <h2>Your uploaded design</h2>
            </div>
            <div className={`${styles.resultCard} ${styles.queryCard}`}>
              <div className={styles.preview}>
                <span className={styles.queryBadge}>Uploaded</span>
                <QueryPreview
                  glbUrl={job?.glb_url}
                  inputFileUrl={job?.input_file_url}
                  fileName={job?.file_name}
                  isRunning={isRunning}
                  jobId={job?.job_id || jobId}
                />
              </div>
              <div className={styles.resultBody}>
                <h3 className={styles.resultTitle}>
                  {job?.file_name || "Uploaded CAD file"}
                </h3>
                <p className={styles.resultMeta}>Query file used for matching</p>
              </div>
            </div>
          </section>

          {showResults || status === "COMPLETED" ? (
          <section className={styles.matchesSection} aria-label="Similar designs">
            <div className={styles.sectionHeading}>
              <h2>Similar designs</h2>
              {matches.length > 0 ? (
                <span className={styles.matchCount}>{matches.length} matches</span>
              ) : null}
            </div>

            {matches.length > 0 ? (
              <div className={styles.resultsGrid}>
                {matches.map((m, idx) => {
                  const designId = m.design_id || m._id;
                  const pct = similarityPercent(m.score);
                  const title = m.page_title || m.part_name || "Untitled design";
                  const href = m.route ? `/library/${m.route}` : "#";
                  return (
                    <Link
                      key={String(designId || idx)}
                      href={href}
                      className={styles.resultCard}
                    >
                      <div className={styles.preview}>
                        {pct != null ? (
                          <span className={styles.scoreBadge}>{pct}% match</span>
                        ) : null}
                        {designId ? (
                          <HoverImageSequence
                            design={{
                              _id: designId,
                              page_title: title,
                            }}
                            width={320}
                            height={180}
                          />
                        ) : null}
                      </div>
                      <div className={styles.resultBody}>
                        <h3 className={styles.resultTitle}>{title}</h3>
                        <p className={styles.resultMeta}>
                          {[m.file_type, m.part_name].filter(Boolean).join(" · ") ||
                            "Library design"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : status === "COMPLETED" ? (
              <div className={`${styles.card} ${styles.empty}`}>
                {job?.error_message ||
                  "No close geometric matches in the library (similarity threshold not met). Try a different file or expand the indexed library."}
              </div>
            ) : null}
          </section>
          ) : null}
        </div>
      ) : null}

      <div className={styles.actions} style={{ marginTop: 24 }}>
        <Link href="/tools/cad-match" className={styles.btnGhost}>
          Match another file
        </Link>
      </div>
    </div>
  );
}
