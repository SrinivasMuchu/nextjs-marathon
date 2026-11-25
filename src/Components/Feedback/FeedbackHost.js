"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { getFeedbackContext, getPendingFeedback, recordFeedbackPromptEvent } from "@/api/feedbackApi";
import { FEEDBACK_PROMPT_DELAY_MS, FEEDBACK_PROMPT_EVENT } from "@/lib/feedbackPrompt";
import { trackFeedbackEvent } from "@/lib/feedbackAnalytics";
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

/** Centered dialog — same card and backdrop as the dashboard star popup. */
function CenteredFeedback({ label, onClose, children }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.centerOverlay}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={label}>
        <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/**
 * Rating dialog (flow 1a/1e). Mounted once in the app layout.
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
  const ratedRef = useRef(false);
  const promptRef = useRef(null);

  const show = useCallback((context, source) => {
    if (!context?.prompt?.eligible || !context.rateable || !context.content) return;
    showing.current = true;
    ratedRef.current = false;
    setRated(false);
    setPrompt({ context, source });
    recordFeedbackPromptEvent({ jobId: context.job._id, jobType: context.job.job_type, event: "shown", source });
    const route = context.job.route_family || "";
    trackFeedbackEvent("feedback_prompt_shown", {
      event_label: route,
      source,
      route_family: route,
      job_type: context.job.job_type,
    });
    trackFeedbackEvent("feedback_popup_opened", {
      event_label: `${source}:${route}`,
      source,
      route_family: route,
      job_type: context.job.job_type,
    });
  }, []);

  const dismiss = useCallback(() => {
    const current = promptRef.current;
    if (current && current.kind !== "stopped" && !ratedRef.current) {
      const { context, source } = current;
      recordFeedbackPromptEvent({
        jobId: context.job._id,
        jobType: context.job.job_type,
        event: "dismissed",
        source,
      });
      trackFeedbackEvent("feedback_closed_without_rating", {
        event_label: `${source}:${context.job.route_family || ""}`,
        source,
        route_family: context.job.route_family || "",
        job_type: context.job.job_type,
      });
    }
    showing.current = false;
    setPrompt(null);
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
        if (context?.content && !context.feedback?.failed && !context.job?.sample_file
          && ["running", "failed", "stuck"].includes(context.job?.state)) {
          showing.current = true;
          ratedRef.current = false;
          setPrompt({ context, source: "failed_job", kind: "stopped" });
          trackFeedbackEvent("feedback_popup_opened", {
            event_label: `failed_job:${context.job.route_family || ""}`,
            source: "failed_job",
            route_family: context.job.route_family || "",
            job_type: context.job.job_type,
          });
        }
        return;
      }
      show(context, source);
    } catch (err) {
      // A failed prompt never interrupts the download.
      trackFeedbackEvent("feedback_error", {
        event_label: `${source || "prompt"}:load`,
        source: source || "prompt",
        reason: String(err?.message || "context_load_failed").slice(0, 100),
      });
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
      } catch (err) {
        trackFeedbackEvent("feedback_error", {
          event_label: "dashboard_card:load",
          source: "dashboard_card",
          reason: String(err?.message || "pending_load_failed").slice(0, 100),
        });
      } finally {
        busy.current = false;
        const next = queued.current;
        queued.current = null;
        if (next && !showing.current) openForJobRef.current?.(next);
      }
    }, FEEDBACK_PROMPT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, show]);

  promptRef.current = prompt;

  if (!prompt || !mounted) return null;
  const { context, source, kind } = prompt;

  if (kind === "stopped") {
    return (
      <CenteredFeedback label="Tell us what you needed" onClose={dismiss}>
        <FailedJobFeedback
          variant="corner"
          context={context}
          jobId={context.job._id}
          jobType={context.job.job_type}
          cancelled
          onClose={dismiss}
        />
      </CenteredFeedback>
    );
  }

  return (
    <CenteredFeedback label="Rate your conversion" onClose={dismiss}>
      <ConversionFeedbackForm
        compact
        context={context}
        source={source}
        header={<CardHeader context={context} />}
        onCancel={rated ? dismiss : undefined}
        onSaved={(feedback) => {
          ratedRef.current = true;
          setRated(true);
          window.dispatchEvent(new CustomEvent(FEEDBACK_SAVED_EVENT, {
            detail: { jobId: context.job._id, jobType: context.job.job_type, feedback },
          }));
        }}
      />
    </CenteredFeedback>
  );
}
