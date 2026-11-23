"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { submitTestimonial } from "@/api/feedbackApi";
import { sendGAtagEvent } from "@/common.helper";
import styles from "./Feedback.module.css";

/** Shown in the consent text; bump CONSENT_TEXT_VERSION on the server when this changes. */
export const QUOTE_CONSENT_TEXT =
  "Marathon OS may show this review, exactly as you wrote it, on its website with the name you pick. " +
  "You can stop sharing it any time in Account settings, and we take it down within 24 hours.";

const NAME_OPTIONS = [
  { id: "first_name_initial", label: "First name and initial" },
  { id: "full_name", label: "Full name" },
  { id: "anonymous", label: "Don't show my name" },
];

/**
 * Flow 6b: the thank-you screen adds one question after a 4–5 review.
 * Role and company are typed here; accounts have no company field and nothing is pre-filled.
 */
export default function QuoteConsent({ feedback, onDone }) {
  const [nameOption, setNameOption] = useState("first_name_initial");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [answered, setAnswered] = useState(null); // "yes" | "no"

  if (!feedback?._id || !feedback?.comment) return null;

  if (answered) {
    return (
      <p className={styles.muted} role="status">
        {answered === "yes"
          ? "Thank you. A person checks every review before it goes on our site."
          : "No problem. Your review stays private."}
      </p>
    );
  }

  async function yes() {
    if (!agree) return;
    setSaving(true);
    try {
      await submitTestimonial({
        feedback_id: feedback._id,
        consent: true,
        display_name_option: nameOption,
        role: role.trim() || undefined,
        company: company.trim() || undefined,
      });
      sendGAtagEvent({ event_name: "testimonial_consented", event_category: "FEEDBACK" });
      setAnswered("yes");
      onDone?.("yes");
    } catch (err) {
      toast.error(err?.message || "Couldn't save that. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.quoteBox}>
      <p className={styles.label}>Can we quote your review?</p>
      <blockquote className={styles.quoteText}>{feedback.comment}</blockquote>
      <fieldset className={styles.group}>
        <legend className={styles.label}>Show it with</legend>
        <div className={styles.chips}>
          {NAME_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`${styles.chip} ${nameOption === o.id ? styles.chipOn : ""}`}
              aria-pressed={nameOption === o.id}
              onClick={() => setNameOption(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className={styles.twoCol}>
        <label className={styles.field}>
          <span className={styles.label}>Role <span className={styles.muted}>(optional)</span></span>
          <input className={styles.input} maxLength={80} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Design engineer" />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Company <span className={styles.muted}>(optional)</span></span>
          <input className={styles.input} maxLength={80} value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>
      <label className={styles.check}>
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>{QUOTE_CONSENT_TEXT}</span>
      </label>
      <div className={styles.actionsRow}>
        <button type="button" className={styles.secondaryBtn} onClick={() => { setAnswered("no"); onDone?.("no"); }} disabled={saving}>
          No thanks
        </button>
        <button type="button" className={styles.primaryBtn} onClick={yes} disabled={!agree || saving}>
          {saving ? "Saving…" : "Yes, quote me"}
        </button>
      </div>
    </div>
  );
}
