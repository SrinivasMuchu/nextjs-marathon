"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import {
  getAbandonedFiles, getReviewInvite, recordReviewInviteEvent,
} from "@/api/feedbackApi";
import { sendGAtagEvent } from "@/common.helper";
import AbandonFeedback from "./AbandonFeedback";
import FeedbackDialog from "./FeedbackDialog";
import styles from "./Feedback.module.css";

function fmtDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

/**
 * 11d: the in-app twin of the day-6 deletion email, only for files never downloaded:
 * download it, or tell us what wasn't right.
 */
function AbandonedFilesCard() {
  const [files, setFiles] = useState([]);
  const [asking, setAsking] = useState(null);

  useEffect(() => {
    let alive = true;
    getAbandonedFiles().then((list) => { if (alive) setFiles(list || []); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  if (!files.length) return null;
  const soonest = files.reduce((min, file) => {
    const at = new Date(file.deletes_at).getTime();
    return Number.isFinite(at) && at < min ? at : min;
  }, Infinity);
  const days = Number.isFinite(soonest) ? Math.ceil((soonest - Date.now()) / (24 * 60 * 60 * 1000)) : 1;
  const when = days <= 1 ? "tomorrow" : `in ${days} days`;

  return (
    <section className={styles.dashCard} aria-label="Files about to be deleted">
      <p className={styles.dashTitle}>
        {files.length === 1 ? `This file is deleted ${when}` : `These files are deleted ${when}`}
      </p>
      <p className={styles.dashText}>You never downloaded {files.length === 1 ? "it" : "them"}. Download now, or tell us what wasn&apos;t right.</p>
      <ul className={styles.dashFiles}>
        {files.map((f) => (
          <li key={f._id} className={styles.dashFile}>
            <span className={styles.dashFileName} title={f.file_name}>
              {f.file_name || "Your file"}
              {f.output_format ? ` → ${String(f.output_format).toUpperCase()}` : ""}
              <span className={styles.muted}> · deleted {fmtDate(f.deletes_at)}</span>
            </span>
            <span className={styles.dashActions}>
              <Link
                className={styles.linkBtn}
                href={f.job_type === "drawing"
                  ? `/dashboard/2d-technical-drawing/${encodeURIComponent(f._id)}`
                  : "/dashboard?cad_type=CAD_CONVERTER"}
              >
                Download
              </Link>
              <button type="button" className={styles.linkBtn} onClick={() => setAsking(f)}>
                What wasn&apos;t right?
              </button>
            </span>
          </li>
        ))}
      </ul>
      {asking ? (
        <FeedbackDialog label="What wasn't right?" onClose={() => setAsking(null)}>
          <AbandonFeedback
            jobId={asking._id}
            jobType={asking.job_type}
            source="day6_card"
            title="Before it's deleted: what wasn't right?"
            onDone={() => setFiles((prev) => prev.filter((x) => x._id !== asking._id))}
            onClose={() => setAsking(null)}
          />
        </FeedbackDialog>
      ) : null}
    </section>
  );
}

/**
 * 7b: G2 invite at the user's 3rd job (whatever the outcome) or 30 days after sign-up.
 * Text button only, no logo, nothing offered in return. The server decides who sees it and never reads ratings.
 */
function ReviewInviteCard() {
  const [invite, setInvite] = useState(null);

  useEffect(() => {
    let alive = true;
    getReviewInvite()
      .then((data) => {
        if (!alive || !data?.show || !data.url) return;
        setInvite(data);
        recordReviewInviteEvent("shown");
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  if (!invite) return null;
  const dismiss = () => {
    recordReviewInviteEvent("dismissed");
    setInvite(null);
  };

  return (
    <section className={styles.dashCard} aria-label="Review Marathon OS">
      <button type="button" className={styles.close} aria-label="Dismiss" onClick={dismiss}>
        <X size={16} />
      </button>
      <p className={styles.dashTitle}>Would you review Marathon OS on G2?</p>
      <p className={styles.dashText}>
        {invite.jobs >= 2 ? `You've used Marathon for ${invite.jobs} files. ` : ""}
        An honest review, good or bad, helps other engineers decide. It takes about five minutes.
      </p>
      <div className={styles.dashActions}>
        <a
          className={styles.linkBtn}
          href={invite.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            recordReviewInviteEvent("clicked");
            sendGAtagEvent({ event_name: "review_site_clicked", event_category: "FEEDBACK", event_label: "g2:dashboard" });
            setInvite(null);
          }}
        >
          Write a review on G2
        </a>
      </div>
    </section>
  );
}

/** Feedback cards under the dashboard's credits / latest-file row. Renders nothing when neither applies. */
export default function DashboardFeedbackCards({ className = "" }) {
  return (
    <div className={className}>
      <AbandonedFilesCard />
      <ReviewInviteCard />
    </div>
  );
}
