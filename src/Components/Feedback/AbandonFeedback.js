"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getFeedbackContext, submitFeedback } from "@/api/feedbackApi";
import { trackFeedbackEvent } from "@/lib/feedbackAnalytics";
import { FILE_CONSENT_TEXT } from "./ConversionFeedbackForm";
import styles from "./Feedback.module.css";

/**
 * Flow 11b: "Not what you expected?" — one reason, most evidence first.
 * "The result looks wrong" opens the route's flow 1 tags and "ask an engineer" (a flow 5 case).
 * Price, later, just checking and "got it from the preview" get nothing more: no discount, no re-run offer.
 *
 * `submitFn` / `context` let the email rating page reuse this with its signed token.
 */
export default function AbandonFeedback({
  jobId,
  jobType = "converter",
  source = "abandon_link",
  context: contextProp = null,
  submitFn = null,
  title = "Not what you expected?",
  onDone,
  onClose,
}) {
  const [context, setContext] = useState(contextProp);
  const [reason, setReason] = useState("");
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState("");
  const [askEngineer, setAskEngineer] = useState(false);
  const [consentFile, setConsentFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (contextProp || !jobId) return undefined;
    let alive = true;
    getFeedbackContext(jobId, jobType)
      .then((data) => { if (alive) setContext(data); })
      .catch(() => {});
    return () => { alive = false; };
  }, [contextProp, jobId, jobType]);

  if (!context?.content) return <p className={styles.muted}>Loading…</p>;
  const { job, content } = context;
  const reasons = content.abandon_reasons || [];
  const wrong = reason === "result_looks_wrong";
  const consentEnabled = Boolean(context.consent_enabled) && !submitFn;
  const previous = context.feedback?.abandoned;

  async function send() {
    if (!reason) return;
    setSaving(true);
    try {
      const payload = {
        job_id: job._id,
        job_type: job.job_type || jobType,
        kind: "abandoned",
        source,
        abandon_reason: reason,
        tags: wrong ? tags : [],
        comment: comment || undefined,
        ask_engineer: wrong && askEngineer,
        consent_file: wrong && askEngineer && consentEnabled ? consentFile : false,
      };
      const data = await (submitFn ? submitFn(payload) : submitFeedback(payload));
      const given = {
        event_label: `${source}:${reason}`,
        source,
        route_family: job.route_family || "",
        job_type: job.job_type || jobType,
        reason,
      };
      trackFeedbackEvent("converter_abandon_reason", given);
      trackFeedbackEvent("feedback_given", given);
      setResult({ reason, degraded: Boolean(data?.degraded) });
      onDone?.(reason);
    } catch (err) {
      trackFeedbackEvent("feedback_error", {
        event_label: `${source}:save`,
        source,
        job_type: job.job_type || jobType,
        reason: String(err?.message || "save_failed").slice(0, 100),
      });
      toast.error(err?.message || "Couldn't send that. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (result) {
    let msg = "Thanks — that helps us.";
    if (result.reason === "result_looks_wrong") {
      msg = askEngineer
        ? "Thanks. An engineer will look at it and email you within one working day."
        : "Thanks. We'll use this to fix the converter.";
      if (result.degraded) {
        msg += " This file took a fallback path in our converter, so some detail may be lost — that's on us, not your file.";
      }
    } else if (result.reason === "checkout_failed") {
      msg = "Sorry about that. We've told the person who looks after payments.";
    } else if (result.reason === "other_settings_format") {
      msg = "Thanks — we keep a list of what people ask for, and it decides what we build next.";
    }
    return (
      <div className={styles.thanks} role="status">
        <p className={styles.thanksTitle}>Got it.</p>
        <p className={styles.muted}>{msg}</p>
        {onClose ? <button type="button" className={styles.secondaryBtn} onClick={onClose}>Close</button> : null}
      </div>
    );
  }

  return (
    <div className={styles.form}>
      <div>
        <p className={styles.title}>{title}</p>
        <p className={styles.muted}>
          {job.file_name ? <span className={styles.fileName}>{job.file_name}</span> : null}
          {job.file_name ? " · " : null}What kept you from downloading it?
        </p>
        {previous?.abandon_reason ? <p className={styles.note}>You already told us about this file; you can change your answer.</p> : null}
      </div>

      <div className={styles.reasonList} role="radiogroup" aria-label="Reason">
        {reasons.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={reason === r.id}
            className={`${styles.reason} ${reason === r.id ? styles.reasonOn : ""}`}
            onClick={() => setReason(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {wrong ? (
        <>
          <fieldset className={styles.group}>
            <legend className={styles.label}>What looks wrong? <span className={styles.muted}>(optional)</span></legend>
            <div className={styles.chips}>
              {(content.low_tags || []).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.chip} ${tags.includes(t.id) ? styles.chipOn : ""}`}
                  aria-pressed={tags.includes(t.id)}
                  onClick={() => setTags(tags.includes(t.id) ? tags.filter((x) => x !== t.id) : [...tags, t.id])}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
          <textarea
            className={styles.textarea}
            rows={2}
            maxLength={2000}
            aria-label="Anything else?"
            placeholder={content.low_example || "What looks wrong?"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
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
        </>
      ) : null}

      {reason === "other_settings_format" || reason === "checkout_failed" ? (
        <textarea
          className={styles.textarea}
          rows={2}
          maxLength={2000}
          aria-label="Tell us more"
          placeholder={reason === "checkout_failed" ? "What happened at checkout?" : "Which settings or format did you need?"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      ) : null}

      <div className={styles.actionsRow}>
        {onClose ? <button type="button" className={styles.secondaryBtn} onClick={onClose} disabled={saving}>Close</button> : null}
        <button type="button" className={styles.primaryBtn} onClick={send} disabled={!reason || saving}>
          {saving ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
