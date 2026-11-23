"use client";

import React, { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import FailedJobFeedback from "./FailedJobFeedback";
import FeedbackDialog from "./FeedbackDialog";
import styles from "./Feedback.module.css";

/** Dashboard row for a failed job (flow 3): "What did you need?" opens the one-question card. */
export default function FailedJobButton({ jobId, jobType = "converter", fileName }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={styles.rateBtn}
        aria-label="Tell us what you needed this file for"
        title="Tell us what you needed"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
      >
        <MessageCircleQuestion size={15} />
      </button>
      {open ? (
        <FeedbackDialog label="Tell us what you needed" onClose={() => setOpen(false)}>
          <FailedJobFeedback variant="corner" jobId={jobId} jobType={jobType} fileName={fileName} onClose={() => setOpen(false)} />
        </FeedbackDialog>
      ) : null}
    </>
  );
}
