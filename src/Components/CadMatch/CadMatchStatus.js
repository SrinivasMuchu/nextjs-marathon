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
  FINGERPRINT: "Computing shape fingerprint",
  SEARCH: "Searching library",
};

function statusBadgeClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return styles.badgeDone;
  if (s === "FAILED") return styles.badgeFail;
  return styles.badgeRunning;
}

function QueryPreview({ glbUrl, fileName }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!glbUrl || typeof window === "undefined") return undefined;
    if (!window.customElements?.get("model-viewer")) {
      const existing = document.querySelector('script[data-cad-match-model-viewer]');
      if (!existing) {
        const script = document.createElement("script");
        script.type = "module";
        script.src =
          "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
        script.dataset.cadMatchModelViewer = "1";
        document.head.appendChild(script);
      }
    }
  }, [glbUrl]);

  if (glbUrl) {
    return (
      <div className={styles.queryPreview} ref={hostRef}>
        {/* model-viewer is loaded via CDN script above */}
        {React.createElement("model-viewer", {
          src: glbUrl,
          alt: fileName || "Uploaded CAD",
          "camera-controls": true,
          "touch-action": "pan-y",
          "auto-rotate": true,
          exposure: "1",
          style: { width: "100%", height: "100%", background: "transparent" },
        })}
      </div>
    );
  }

  return (
    <div className={styles.queryPlaceholder}>
      <FileBox size={40} strokeWidth={1.5} />
      <span>3D preview available after rematch</span>
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
  const matches = Array.isArray(job?.matches) ? job.matches : [];
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
            {stage || "Working…"} — this usually takes under a minute.
          </p>
        </div>
      ) : null}

      {error ? <div className={styles.error}>{error}</div> : null}

      {showResults || status === "COMPLETED" ? (
        <div className={styles.compareLayout}>
          <section className={styles.querySection} aria-label="Uploaded design">
            <div className={styles.sectionHeading}>
              <Box size={16} />
              <h2>Your uploaded design</h2>
            </div>
            <div className={`${styles.resultCard} ${styles.queryCard}`}>
              <div className={styles.preview}>
                <span className={styles.queryBadge}>Uploaded</span>
                <QueryPreview glbUrl={job?.glb_url} fileName={job?.file_name} />
              </div>
              <div className={styles.resultBody}>
                <h3 className={styles.resultTitle}>
                  {job?.file_name || "Uploaded CAD file"}
                </h3>
                <p className={styles.resultMeta}>Query file used for matching</p>
              </div>
            </div>
          </section>

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
