"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import PopupWrapper from "@/Components/CommonJsx/PopupWrapper";
import { getFeedbackContext } from "@/api/feedbackApi";
import { trackFeedbackEvent } from "@/lib/feedbackAnalytics";
import ConversionFeedbackForm from "./ConversionFeedbackForm";
import { FEEDBACK_SAVED_EVENT } from "./FeedbackHost";
import styles from "./Feedback.module.css";

/** Rate or change a rating from the dashboard row's star button (flow 1a "A", 10b). */
export default function FeedbackModal({ jobId, jobType = "converter", source = "dashboard_row", onClose, onSaved }) {
  const [context, setContext] = useState(null);
  const [error, setError] = useState("");
  const saved = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const close = () => {
    if (!saved.current) {
      trackFeedbackEvent("feedback_closed_without_rating", {
        event_label: `${source}:${jobType}`,
        source,
        job_type: jobType,
      });
    }
    onCloseRef.current?.();
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    let alive = true;
    getFeedbackContext(jobId, jobType)
      .then((data) => {
        if (!alive) return;
        if (!data?.rateable || !data?.content) {
          setError("This file can't be rated.");
          trackFeedbackEvent("feedback_error", {
            event_label: `${source}:not_rateable`,
            source,
            job_type: jobType,
            reason: "not_rateable",
          });
        } else setContext(data);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message || "Couldn't load this file.");
        trackFeedbackEvent("feedback_error", {
          event_label: `${source}:load`,
          source,
          job_type: jobType,
          reason: String(err?.message || "load_failed").slice(0, 100),
        });
      });
    return () => { alive = false; };
  }, [jobId, jobType, source]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <PopupWrapper>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Rate this conversion">
        <button type="button" className={styles.close} aria-label="Close" onClick={close}>
          <X size={18} />
        </button>
        {error ? <p className={styles.muted}>{error}</p> : null}
        {!error && !context ? <p className={styles.muted}>Loading…</p> : null}
        {context ? (
          <ConversionFeedbackForm
            context={context}
            source={source}
            onCancel={close}
            onSaved={(feedback) => {
              saved.current = true;
              onSaved?.(feedback);
              window.dispatchEvent(new CustomEvent(FEEDBACK_SAVED_EVENT, { detail: { jobId, jobType, feedback } }));
            }}
          />
        ) : null}
      </div>
    </PopupWrapper>
  );
}
