"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { getFeedbackContext, getPendingFeedback, recordFeedbackPromptEvent } from "@/api/feedbackApi";
import { FEEDBACK_PROMPT_DELAY_MS, FEEDBACK_PROMPT_EVENT } from "@/lib/feedbackPrompt";
import { sendGAtagEvent } from "@/common.helper";
import ConversionFeedbackForm from "./ConversionFeedbackForm";
import FailedJobFeedback from "./FailedJobFeedback";
import styles from "./Feedback.module.css";

export const FEEDBACK_SAVED_EVENT = "marathon:feedback-saved";

function fmt(ext) {
  return String(ext || "").replace(/^\./, "").toUpperCase();
}

/** "How did bracket_v3.step → STL turn out?" + helper line, with the output format as the badge. */
export function CardHeader({ context }) {
  const { job, moment } = context;
  const afterUse = moment === "after_use";
  const isDrawing = job.job_type === "drawing";
  const name = job.file_name || (isDrawing ? "your drawing" : "your file");
  const out = fmt(job.output_format);
  const verb = afterUse ? "hold up" : "turn out";
  const title = isDrawing
    ? `How did the ${name} drawing ${verb}?`
    : job.library && !afterUse
      ? "How did this model convert?"
      : out
      ? `How did ${name} → ${out} ${verb}?`
      : `How did ${name} ${verb}?`;
  const help = afterUse
    ? "Now that you've used it — takes 10 seconds."
    : "Takes 10 seconds. It helps us improve conversions.";
  return (
    <div className={styles.cardHead}>
      <span className={styles.formatBadge} aria-hidden>{isDrawing ? "2D" : out || "CAD"}</span>
      <div>
        <p className={styles.cardTitle}>{title}</p>
        <p className={styles.cardHelp}>{help}</p>
      </div>
    </div>
  );
}

/**
 * Rating corner card (flow 1a/1e). Mounted once in the app layout; it never blocks the page.
 * Shown when a free or credit download finishes, and when the dashboard opens on a downloaded
 * file that hasn't been rated. The server decides if this user may be asked now.
 */
export default function FeedbackHost() {
  const pathname = usePathname();
  const [prompt, setPrompt] = useState(null); // { context, source }
  const [rated, setRated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const busy = useRef(false);
  const showing = useRef(false);
  const pendingChecked = useRef(false);
  const queued = useRef(null);
  const openForJobRef = useRef(null);

  const show = useCallback((context, source) => {
    if (!context?.prompt?.eligible || !context.rateable || !context.content) return;
    showing.current = true;
    setRated(false);
    setPrompt({ context, source });
    recordFeedbackPromptEvent({ jobId: context.job._id, jobType: context.job.job_type, event: "shown", source });
    sendGAtagEvent({ event_name: "feedback_prompt_shown", event_category: "FEEDBACK", event_label: context.job.route_family });
  }, []);

  const openForJob = useCallback(async (detail) => {
    const { jobId, jobType, source, kind } = detail || {};
    if (showing.current) return;
    // A dashboard check in flight used to drop the download prompt. Keep the latest one and open it after.
    if (busy.current) {
      if (jobId) queued.current = detail;
      return;
    }
    busy.current = true;
    try {
      const context = await getFeedbackContext(jobId, jobType);
      if (kind === "stopped") {
        // Flow 3 "stopped waiting": one question, asked once per job, no star pacing.
        if (context?.content && !context.feedback?.failed && !context.stopped_asked && !context.job?.sample_file
          && ["running", "failed", "stuck"].includes(context.job?.state)) {
          showing.current = true;
          setPrompt({ context, source: "failed_job", kind: "stopped" });
          recordFeedbackPromptEvent({
            jobId, jobType, event: "shown", source: "failed_job",
          }).catch(() => {});
        }
        return;
      }
      show(context, source);
    } catch {
      // A failed prompt never interrupts the download.
    } finally {
      busy.current = false;
      const next = queued.current;
      queued.current = null;
      if (next && !showing.current) openForJobRef.current?.(next);
    }
  }, [show]);

  useEffect(() => {
    openForJobRef.current = openForJob;
  }, [openForJob]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onPrompt = (e) => openForJob(e.detail || {});
    window.addEventListener(FEEDBACK_PROMPT_EVENT, onPrompt);
    return () => window.removeEventListener(FEEDBACK_PROMPT_EVENT, onPrompt);
  }, [openForJob]);

  // Dashboard: a downloaded file without a rating gets the same card, once per page load.
  useEffect(() => {
    if (pendingChecked.current || !pathname?.startsWith("/dashboard")) return undefined;
    if (typeof window === "undefined" || !localStorage.getItem("uuid")) return undefined;
    pendingChecked.current = true;
    const timer = window.setTimeout(async () => {
      if (busy.current || showing.current) return;
      busy.current = true;
      try {
        const context = await getPendingFeedback();
        if (context) show(context, "dashboard_card");
      } catch {
        // ignore
      } finally {
        busy.current = false;
        const next = queued.current;
        queued.current = null;
        if (next && !showing.current) openForJobRef.current?.(next);
      }
    }, FEEDBACK_PROMPT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, show]);

  if (!prompt || !mounted) return null;
  const { context, source, kind } = prompt;

  if (kind === "stopped") {
    const close = () => { showing.current = false; setPrompt(null); };
    return createPortal(
      <aside className={styles.corner} aria-label="Tell us what you needed">
        <button type="button" className={styles.close} aria-label="Close" onClick={close}>
          <X size={18} />
        </button>
        <FailedJobFeedback
          variant="corner"
          context={context}
          jobId={context.job._id}
          jobType={context.job.job_type}
          cancelled
          onClose={close}
        />
      </aside>,
      document.body,
    );
  }

  const dismiss = () => {
    if (!rated) {
      recordFeedbackPromptEvent({ jobId: context.job._id, jobType: context.job.job_type, event: "dismissed", source });
    }
    showing.current = false;
    setPrompt(null);
  };

  return createPortal(
    <aside className={styles.corner} aria-label="Rate your conversion">
      <button type="button" className={styles.close} aria-label="Close" onClick={dismiss}>
        <X size={18} />
      </button>
      <ConversionFeedbackForm
        compact
        context={context}
        source={source}
        header={<CardHeader context={context} />}
        onCancel={rated ? dismiss : undefined}
        onSaved={(feedback) => {
          setRated(true);
          window.dispatchEvent(new CustomEvent(FEEDBACK_SAVED_EVENT, {
            detail: { jobId: context.job._id, jobType: context.job.job_type, feedback },
          }));
        }}
      />
    </aside>,
    document.body,
  );
}
