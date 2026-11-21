"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { FEEDBACK_SAVED_EVENT } from "./FeedbackHost";
import styles from "./Feedback.module.css";

/**
 * Star button for dashboard rows, next to the eye (flow 1a "A").
 * Unrated: plain star. Rated: "★ 2/5"; clicking it changes the rating.
 * `feedback` comes from GET /v1/cad/get-file-history (each job's latest rating).
 */
export default function RateJobButton({ jobId, jobType = "converter", feedback, className = "" }) {
  const [current, setCurrent] = useState(feedback || null);
  const [open, setOpen] = useState(false);

  useEffect(() => setCurrent(feedback || null), [feedback]);

  // Keep the row in sync when the same job is rated from the corner card.
  useEffect(() => {
    const onSaved = (e) => {
      const d = e.detail || {};
      if (String(d.jobId) === String(jobId) && d.jobType === jobType && d.feedback) {
        setCurrent({ rating: d.feedback.rating, moment: d.feedback.moment });
      }
    };
    window.addEventListener(FEEDBACK_SAVED_EVENT, onSaved);
    return () => window.removeEventListener(FEEDBACK_SAVED_EVENT, onSaved);
  }, [jobId, jobType]);

  const rated = Boolean(current?.rating);
  const label = rated ? `Your rating: ${current.rating} of 5. Change rating` : "Rate this conversion";

  return (
    <>
      <button
        type="button"
        className={`${styles.rateBtn} ${rated ? styles.rateBtnRated : ""} ${className}`}
        aria-label={label}
        title={rated ? `You rated ${current.rating}/5` : "Rate this conversion"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Star size={15} fill={rated ? "currentColor" : "none"} />
        {rated ? <span>{current.rating}/5</span> : null}
      </button>
      {open ? (
        // React events from the portal still bubble through the row / <Link> card: stop them here.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <span style={{ display: "contents" }} onClick={(e) => { e.stopPropagation(); }}>
        <FeedbackModal
          jobId={jobId}
          jobType={jobType}
          source="dashboard_row"
          onClose={() => setOpen(false)}
          onSaved={(fb) => setCurrent({ rating: fb.rating, moment: fb.moment })}
        />
        </span>
      ) : null}
    </>
  );
}
