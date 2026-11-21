"use client";

import React, { useEffect, useState } from "react";
import { getFeedbackContext } from "@/api/feedbackApi";
import { markFeedbackInline } from "@/lib/feedbackPrompt";
import ConversionFeedbackForm from "./ConversionFeedbackForm";
import { FEEDBACK_SAVED_EVENT } from "./FeedbackHost";
import styles from "./Feedback.module.css";

/**
 * Stars on the shared download success screen (flow 1a): "How did the conversion turn out?".
 * Picking a star expands the form in place. While this is on screen the corner card stays away for this job.
 */
export default function SuccessFeedbackPanel({ jobId, jobType = "converter" }) {
  const [context, setContext] = useState(null);

  useEffect(() => markFeedbackInline(jobId), [jobId]);

  useEffect(() => {
    if (!jobId) return undefined;
    let alive = true;
    getFeedbackContext(jobId, jobType)
      .then((data) => {
        if (alive && data?.rateable && data?.content) setContext(data);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [jobId, jobType]);

  if (!context) return null;
  const isDrawing = jobType === "drawing";
  const afterUse = context.moment === "after_use";
  const title = afterUse
    ? `How did the ${isDrawing ? "drawing" : "conversion"} hold up?`
    : `How did the ${isDrawing ? "drawing" : "conversion"} turn out?`;

  return (
    <div className={styles.inlinePanel}>
      <ConversionFeedbackForm
        compact
        centered
        context={context}
        source="download_success"
        header={<p className={styles.inlineTitle}>{title}</p>}
        onSaved={(feedback) => {
          window.dispatchEvent(new CustomEvent(FEEDBACK_SAVED_EVENT, { detail: { jobId, jobType, feedback } }));
        }}
      />
    </div>
  );
}
