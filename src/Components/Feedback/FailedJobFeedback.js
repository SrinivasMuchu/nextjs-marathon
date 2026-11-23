"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { getFeedbackContext, submitFeedback } from "@/api/feedbackApi";
import { sendGAtagEvent } from "@/common.helper";
import { techDrawFreeRetryUploadPath } from "@/lib/techDraw/techDrawJobRoutes";
import { FILE_CONSENT_TEXT } from "./ConversionFeedbackForm";
import styles from "./Feedback.module.css";

/**
 * Flow 3: a failed or stuck job gets one question and no stars — a failed job is already a 1.
 * "What were you trying to do?" (per conversion family) · "Ask an engineer to look" · Send feedback / Close.
 * `cancelled`: the user stopped waiting. That only stops polling; the job keeps running, so it isn't a failure.
 */
export default function FailedJobFeedback({
  jobId,
  jobType = "converter",
  cancelled = false,
  fileName: fileNameProp,
  variant = "page", // page | corner
  context: contextProp = null,
  onClose,
}) {
  const [context, setContext] = useState(contextProp);
  const [purpose, setPurpose] = useState("");
  const [other, setOther] = useState("");
  const [askEngineer, setAskEngineer] = useState(false);
  const [consentFile, setConsentFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (contextProp || !jobId) return undefined;
    let alive = true;
    getFeedbackContext(jobId, jobType)
      .then((data) => { if (alive) setContext(data); })
      .catch(() => {});
    return () => { alive = false; };
  }, [contextProp, jobId, jobType]);

  if (!context?.content) return null;
  const { job, content, failure, feedback } = context;
  if (job.sample_file) return null;
  const state = job.state;
  const isFailure = state === "failed" || state === "stuck";
  if (!isFailure && !(cancelled && state === "running")) return null;
  if (feedback?.failed && !done) return null; // asked once per job

  const isDrawing = jobType === "drawing";
  const name = job.file_name || fileNameProp || "your file";
  const purposes = content.failed_purposes || [];
  const consentEnabled = Boolean(context.consent_enabled);

  let title;
  let helper;
  if (cancelled && !isFailure) {
    title = "You stopped waiting";
    helper = "Your file may still finish; we'll email you.";
  } else if (isDrawing) {
    title = `We couldn't make the drawing for ${name}`;
    helper = failure?.free_retry_available
      ? "Nothing was charged. You can try again free, or ask us to look."
      : "Nothing was charged. You can upload it again or ask us to look.";
  } else {
    title = state === "stuck" ? `${name} is taking far too long` : `We couldn't convert ${name}`;
    helper = "Nothing was charged and no free file was used. You can upload it again or ask us to look.";
  }

  async function send() {
    setSaving(true);
    try {
      await submitFeedback({
        job_id: job._id,
        job_type: jobType,
        kind: "failed",
        cancelled: cancelled && !isFailure,
        purpose: purpose || undefined,
        comment: purpose === "other" || other ? other : undefined,
        ask_engineer: askEngineer,
        consent_file: askEngineer && consentEnabled ? consentFile : false,
      });
      sendGAtagEvent({
        event_name: "feedback_details_sent",
        event_category: "FEEDBACK",
        event_label: `failed:${job.route_family}:${purpose || "none"}`,
      });
      setDone(true);
    } catch (err) {
      toast.error(err?.message || "Couldn't send that. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const wrapClass = variant === "page" ? styles.failedCard : styles.form;

  if (done) {
    return (
      <div className={wrapClass} role="status">
        <p className={styles.thanksTitle}>Thanks for telling us.</p>
        <p className={styles.muted}>
          {askEngineer ? "An engineer will look at it and email you within one working day." : "We read every answer."}
        </p>
        {onClose ? <button type="button" className={styles.secondaryBtn} onClick={onClose}>Close</button> : null}
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <div className={styles.form}>
        <div>
          <p className={styles.title}>{title}</p>
          <p className={styles.muted}>{helper}</p>
        </div>

        {isDrawing && failure?.free_retry_available ? (
          <div>
            <Link href={techDrawFreeRetryUploadPath(job._id)} className={styles.primaryBtn} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              Try again free
            </Link>
          </div>
        ) : null}

        <fieldset className={styles.group}>
          <legend className={styles.label}>What were you trying to do?</legend>
          <div className={styles.chips}>
            {[...purposes, { id: "other", label: "Other…" }].map((p) => (
              <button
                key={p.id}
                type="button"
                className={`${styles.chip} ${purpose === p.id ? styles.chipOn : ""}`}
                aria-pressed={purpose === p.id}
                onClick={() => setPurpose(purpose === p.id ? "" : p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>

        {purpose === "other" ? (
          <textarea
            className={styles.textarea}
            rows={2}
            maxLength={2000}
            aria-label="What were you trying to do?"
            placeholder="Tell us in a few words"
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
        ) : null}

        <label className={styles.check}>
          <input type="checkbox" checked={askEngineer} onChange={(e) => setAskEngineer(e.target.checked)} />
          <span>Ask an engineer to look, and email me</span>
        </label>
        {askEngineer && consentEnabled ? (
          <label className={styles.check}>
            <input type="checkbox" checked={consentFile} onChange={(e) => setConsentFile(e.target.checked)} />
            <span>{FILE_CONSENT_TEXT}</span>
          </label>
        ) : null}

        <div className={styles.actionsRow}>
          {onClose ? (
            <button type="button" className={styles.secondaryBtn} onClick={onClose} disabled={saving}>Close</button>
          ) : null}
          <button type="button" className={styles.primaryBtn} onClick={send} disabled={saving || (!purpose && !askEngineer)}>
            {saving ? "Sending…" : "Send feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
