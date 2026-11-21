"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import PopupWrapper from "@/Components/CommonJsx/PopupWrapper";
import { getFeedbackContext } from "@/api/feedbackApi";
import ConversionFeedbackForm from "./ConversionFeedbackForm";
import { FEEDBACK_SAVED_EVENT } from "./FeedbackHost";
import styles from "./Feedback.module.css";

/** Rate or change a rating from the dashboard row's star button (flow 1a "A", 10b). */
export default function FeedbackModal({ jobId, jobType = "converter", source = "dashboard_row", onClose, onSaved }) {
  const [context, setContext] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    getFeedbackContext(jobId, jobType)
      .then((data) => {
        if (!alive) return;
        if (!data?.rateable || !data?.content) setError("This file can't be rated.");
        else setContext(data);
      })
      .catch((err) => alive && setError(err?.message || "Couldn't load this file."));
    return () => { alive = false; };
  }, [jobId, jobType]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <PopupWrapper>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Rate this conversion">
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>
        {error ? <p className={styles.muted}>{error}</p> : null}
        {!error && !context ? <p className={styles.muted}>Loading…</p> : null}
        {context ? (
          <ConversionFeedbackForm
            context={context}
            source={source}
            onCancel={onClose}
            onSaved={(feedback) => {
              onSaved?.(feedback);
              window.dispatchEvent(new CustomEvent(FEEDBACK_SAVED_EVENT, { detail: { jobId, jobType, feedback } }));
            }}
          />
        ) : null}
      </div>
    </PopupWrapper>
  );
}
