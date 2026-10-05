"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import HoverImageSequence from "@/Components/CommonJsx/RotatedImages";
import {
  TextMatchPollError,
  getTextMatchJobStatus,
  similarityPercent,
  waitForTextMatchJob,
} from "@/api/textMatchApi";
import styles from "./TextMatch.module.css";

function statusBadgeClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return styles.badgeDone;
  if (s === "FAILED") return styles.badgeFail;
  return styles.badgeRunning;
}

export default function TextMatchStatus({ jobId }) {
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!jobId || startedRef.current) return undefined;
    startedRef.current = true;
    const ac = new AbortController();

    (async () => {
      try {
        const first = await getTextMatchJobStatus(jobId);
        setJob(first);
        setLoading(false);
        const st = String(first?.status || "").toUpperCase();
        if (st === "COMPLETED" || st === "FAILED") {
          if (st === "FAILED") setError(first?.error_message || "Match failed.");
          return;
        }
        const done = await waitForTextMatchJob(jobId, {
          signal: ac.signal,
          onUpdate: (j) => setJob(j),
        });
        setJob(done);
      } catch (err) {
        if (ac.signal.aborted) return;
        const msg =
          err instanceof TextMatchPollError
            ? err.message
            : err?.message || "Could not load match status.";
        setError(msg);
        if (err?.job) setJob(err.job);
        toast.error(msg);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [jobId]);

  const status = String(job?.status || (loading ? "PENDING" : "")).toUpperCase();
  const matches = Array.isArray(job?.matches)
    ? [...job.matches].sort((a, b) => Number(b?.score || 0) - Number(a?.score || 0))
    : [];
  const isRunning = status === "PENDING" || status === "PROCESSING";
  const showResults =
    status === "COMPLETED" || (status === "FAILED" && matches.length > 0);
  const query = job?.query_text || job?.part_name || "";

  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <div className={styles.statusHeader}>
          <div className={styles.statusLabel}>Part Name Match</div>
          <h1 className={styles.statusTitle}>
            {status === "COMPLETED"
              ? matches.length > 0
                ? "Matching designs"
                : "No matches found"
              : status === "FAILED"
                ? "Match failed"
                : "Finding designs…"}
          </h1>
          <div className={styles.statusRow}>
            <span className={`${styles.badge} ${statusBadgeClass(status)}`}>
              {status || "…"}
            </span>
            {query ? <span className={styles.queryChip}>Query: {query}</span> : null}
            {status === "COMPLETED" && job?.designs_searched != null ? (
              <span>Scanned {job.designs_searched} candidates</span>
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
              Searching indexed GLB part names across live library designs…
            </p>
          </div>
        ) : null}

        {error ? <div className={styles.error}>{error}</div> : null}

        {showResults || status === "COMPLETED" ? (
          <section className={styles.matchesSection} aria-label="Matched designs">
            <div className={styles.sectionHeading}>
              <h2>Matched designs</h2>
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
                          {[m.file_type, m.part_name, m.matched_field]
                            .filter(Boolean)
                            .join(" · ") || "Library design"}
                        </p>
                        {m.matched_value ? (
                          <p className={styles.resultMeta}>
                            Matched: {m.matched_value}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : status === "COMPLETED" ? (
              <div className={`${styles.card} ${styles.empty}`}>
                {job?.error_message ||
                  "No designs matched this GLB part name. Try a shorter label or another part name from the metadata JSON."}
              </div>
            ) : null}
          </section>
        ) : null}

        <div className={styles.actions} style={{ marginTop: 24 }}>
          <Link href="/tools/part-name-match" className={styles.btnGhost}>
            <Search size={14} /> Search another part name
          </Link>
        </div>
      </div>
    </div>
  );
}
