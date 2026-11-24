"use client";

import React, { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { submitFeedback } from "@/api/feedbackApi";
import { sendGAtagEvent } from "@/common.helper";
import QuoteConsent from "./QuoteConsent";
import MarkProblem from "./MarkProblem";
import { getDrawingSheets } from "@/lib/feedbackPrompt";
import styles from "./Feedback.module.css";

/** 1d — shown only while the server says the consented-file store and its 30-day deletion exist (D8). */
export const FILE_CONSENT_TEXT =
  "Our engineers may copy and open this file to find the problem, and email me. " +
  "We use it only for this fix, never for training, and delete our copy within 30 days.";

const STAR_LABELS = ["", "Unusable", "Poor", "OK", "Good", "Excellent"];
const FEEDBACK_EVENT = "FEEDBACK";

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.chipOn : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function StarRow({ value, onChange, size = 30, label = "Rate this file", centered = false }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className={`${styles.starBlock} ${centered ? styles.centered : ""}`}>
      <div className={styles.stars} role="radiogroup" aria-label={label} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}: ${STAR_LABELS[n]}`}
            className={styles.starBtn}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => onChange(n)}
          >
            <Star
              size={size}
              strokeWidth={1.6}
              className={n <= shown ? styles.starOn : styles.starOff}
              fill={n <= shown ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
      <span className={styles.starLabel} aria-live="polite">{shown ? STAR_LABELS[shown] : " "}</span>
    </div>
  );
}

function toggle(list, id) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

/**
 * The rating form shared by the post-download corner card and the dashboard modal (flow 1/2).
 * `context` is GET /v1/cad/feedback/context. 1–3 stars → what went wrong; 4–5 → write a short review first,
 * "improve next" chips optional below it. After use (moment = after_use) the earlier review is offered to edit.
 */
export default function ConversionFeedbackForm({
  context,
  source,
  initialRating = 0,
  compact = false,
  /** Replaces the default title block (corner card / success-screen panel). */
  header = null,
  /** Center the stars until a rating is picked (success-screen panel). */
  centered = false,
  onSaved,
  onCancel,
  /** The email rating page saves through its own signed-token endpoint. */
  submitFn = submitFeedback,
  channel = "in_app",
  /** Hide the "change it from your dashboard" hint (email page, logged out). */
  dashboardHint = true,
}) {
  const { job, content, moment, feedback } = context;
  const isDrawing = job.job_type === "drawing";
  const earlier = feedback?.first_impression || null;
  const current = (moment === "after_use" ? feedback?.after_use : feedback?.first_impression) || null;
  const isAfterUse = moment === "after_use";

  const [rating, setRating] = useState(initialRating || current?.rating || 0);
  const [purpose, setPurpose] = useState(current?.purpose || earlier?.purpose || "");
  const [tags, setTags] = useState(current?.tags || []);
  const [otherTags, setOtherTags] = useState(current?.other_tags || []);
  const [software, setSoftware] = useState(current?.software || "");
  const [comment, setComment] = useState(
    current?.comment ?? (isAfterUse && earlier?.rating >= 4 ? earlier?.comment || "" : ""),
  );
  const [contactOk, setContactOk] = useState(Boolean(current?.contact_ok));
  const [hideReview, setHideReview] = useState(Boolean(current?.hide_review));
  const [consentFile, setConsentFile] = useState(false);
  const [marks, setMarks] = useState([]);
  const sheets = useMemo(() => (isDrawing ? getDrawingSheets(job._id) : []), [isDrawing, job._id]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(null);
  const [quoteAsk, setQuoteAsk] = useState(false);
  const consentEnabled = Boolean(context.consent_enabled) && channel === "in_app";

  const low = rating > 0 && rating <= 3;
  const high = rating >= 4;
  const fileLabel = job.file_name || "your file";

  const lowTagIds = useMemo(() => new Set((content?.low_tags || []).map((t) => t.id)), [content]);
  const improveIds = useMemo(() => new Set((content?.improve_tags || []).map((t) => t.id)), [content]);

  const pickRating = (n) => {
    if (!rating) {
      sendGAtagEvent({ event_name: "feedback_rated", event_category: FEEDBACK_EVENT, event_label: `${job.route_family}:${n}` });
    }
    // Low and high chip sets are different; drop chips that don't belong to the new side.
    if (n <= 3) setTags((prev) => prev.filter((id) => lowTagIds.has(id)));
    else setTags((prev) => prev.filter((id) => improveIds.has(id)));
    setRating(n);
  };

  const groupedLowTags = useMemo(() => {
    const list = content?.low_tags || [];
    if (!list.some((t) => t.group)) return [{ key: "all", title: null, tags: list }];
    const titles = { views: "Views", dimensions: "Dimensions", sheet: "Sheet and files" };
    // Flow 2: the chip order follows the purpose. Laser/CNC → 1:1 DXF first; Quote / Machining → callouts and
    // missing dimensions first.
    const first = {
      laser_cnc: { groups: ["sheet", "dimensions", "views"], tags: ["dxf_not_1to1"] },
      quote: { groups: ["dimensions", "views", "sheet"], tags: ["hole_thread_callouts", "dims_missing"] },
      machining: { groups: ["dimensions", "views", "sheet"], tags: ["hole_thread_callouts", "dims_missing"] },
    }[purpose] || { groups: ["views", "dimensions", "sheet"], tags: [] };
    const rank = (t) => {
      const i = first.tags.indexOf(t.id);
      return i === -1 ? first.tags.length : i;
    };
    return first.groups.map((g) => ({
      key: g,
      title: titles[g],
      tags: list.filter((t) => t.group === g).map((t, i) => ({ t, i }))
        .sort((a, b) => rank(a.t) - rank(b.t) || a.i - b.i).map(({ t }) => t),
    })).filter((g) => g.tags.length);
  }, [content, purpose]);

  async function save() {
    if (!rating) return;
    setSaving(true);
    try {
      const data = await submitFn({
        job_id: job._id,
        job_type: job.job_type,
        rating,
        source,
        channel,
        purpose: purpose || undefined,
        tags,
        other_tags: low ? otherTags : [],
        software: software || undefined,
        comment,
        contact_ok: low ? contactOk : false,
        hide_review: high && isAfterUse ? hideReview : false,
        consent_file: low && consentEnabled ? consentFile : false,
        marks: low && isDrawing ? marks : [],
      });
      sendGAtagEvent({ event_name: "feedback_details_sent", event_category: FEEDBACK_EVENT, event_label: job.route_family });
      setSavedFeedback(data?.feedback || null);
      setQuoteAsk(Boolean(data?.quote_ask));
      setDone(true);
      onSaved?.(data?.feedback);
    } catch (err) {
      toast.error(err?.message || "Couldn't save your rating. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className={`${styles.thanks} ${centered ? styles.centeredThanks : ""}`} role="status">
        <p className={styles.thanksTitle}>Thanks — that helps us fix the right things.</p>
        <p className={styles.muted}>
          {low
            ? contactOk || consentFile
              ? "An engineer will read this and may email you about it."
              : dashboardHint ? "We read every rating. You can change it from your dashboard." : "We read every rating."
            : dashboardHint ? "You can change your rating any time from your dashboard." : null}
        </p>
        {high && quoteAsk ? <QuoteConsent feedback={savedFeedback} /> : null}
        {onCancel ? (
          <button type="button" className={styles.secondaryBtn} onClick={onCancel}>Close</button>
        ) : null}
      </div>
    );
  }

  const title = isAfterUse
    ? "How did it hold up?"
    : isDrawing
      ? "Was this drawing usable?"
      : job.library
        ? "How did this model convert?"
        : "How did your file turn out?";

  return (
    <div className={`${styles.form} ${compact ? styles.compact : ""}`}>
      {header || (
        <div>
          <p className={styles.title}>{title}</p>
          <p className={styles.subtitle} title={fileLabel}>
            <span className={styles.fileName}>{fileLabel}</span>
            {content?.family_label ? <span className={styles.muted}> · {content.family_label}</span> : null}
          </p>
        </div>
      )}

      {isDrawing && content?.purposes?.length ? (
        <fieldset className={styles.group}>
          <legend className={styles.label}>What was it for?</legend>
          <div className={styles.chips}>
            {content.purposes.map((p) => (
              <Chip key={p.id} selected={purpose === p.id} onClick={() => setPurpose(purpose === p.id ? "" : p.id)}>
                {p.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      ) : null}

      <StarRow value={rating} onChange={pickRating} size={compact ? 26 : 30} centered={centered && !rating} />

      {isAfterUse && earlier && low && earlier.rating >= 4 && earlier.comment ? (
        <p className={styles.note}>We won&apos;t show your earlier review.</p>
      ) : null}

      {low ? (
        <>
          {groupedLowTags.map((g) => (
            <fieldset key={g.key} className={styles.group}>
              <legend className={styles.label}>{g.title || "What went wrong?"}</legend>
              <div className={styles.chips}>
                {g.tags.map((t) => (
                  <Chip key={t.id} selected={tags.includes(t.id)} onClick={() => setTags(toggle(tags, t.id))}>
                    {t.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
          ))}
          <fieldset className={styles.group}>
            <legend className={styles.label}>Download or payment</legend>
            <div className={styles.chips}>
              {(content?.other_tags || []).map((t) => (
                <Chip key={t.id} selected={otherTags.includes(t.id)} onClick={() => setOtherTags(toggle(otherTags, t.id))}>
                  {t.label}
                </Chip>
              ))}
            </div>
          </fieldset>
        </>
      ) : null}

      {low && isDrawing && sheets.length ? (
        <MarkProblem sheets={sheets} marks={marks} onChange={setMarks} />
      ) : null}

      {high ? (
        <div className={styles.group}>
          <label className={styles.label} htmlFor={`fb-review-${job._id}`}>
            {isAfterUse && earlier?.comment ? "Your review" : "Write a short review"}
          </label>
          {isAfterUse && earlier?.comment ? (
            <p className={styles.muted}>Change anything that&apos;s different now you&apos;ve used the file.</p>
          ) : null}
          <textarea
            id={`fb-review-${job._id}`}
            className={styles.textarea}
            rows={compact ? 3 : 4}
            maxLength={2000}
            placeholder={content?.review_example || "What worked well?"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <p className={styles.muted}>We&apos;ll ask before we show it anywhere.</p>
        </div>
      ) : null}

      {high && content?.improve_tags?.length ? (
        <fieldset className={styles.group}>
          <legend className={styles.label}>What should we improve next? <span className={styles.muted}>(optional)</span></legend>
          <div className={styles.chips}>
            {content.improve_tags.map((t) => (
              <Chip key={t.id} selected={tags.includes(t.id)} onClick={() => setTags(toggle(tags, t.id))}>
                {t.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      ) : null}

      {rating ? (
        <fieldset className={styles.group}>
          <legend className={styles.label}>Which software did you open it in?</legend>
          <div className={styles.chips}>
            {(content?.software || []).map((s) => (
              <Chip key={s} selected={software === s} onClick={() => setSoftware(software === s ? "" : s)}>
                {s}
              </Chip>
            ))}
          </div>
        </fieldset>
      ) : null}

      {low ? (
        <div className={styles.group}>
          <label className={styles.label} htmlFor={`fb-comment-${job._id}`}>Anything else? <span className={styles.muted}>(optional)</span></label>
          <textarea
            id={`fb-comment-${job._id}`}
            className={styles.textarea}
            rows={3}
            maxLength={2000}
            placeholder={content?.low_example || "What happened?"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <label className={styles.check}>
            <input type="checkbox" checked={contactOk} onChange={(e) => setContactOk(e.target.checked)} />
            <span>You can email me about this problem</span>
          </label>
          {consentEnabled ? (
            <label className={styles.check}>
              <input type="checkbox" checked={consentFile} onChange={(e) => setConsentFile(e.target.checked)} />
              <span>{FILE_CONSENT_TEXT}</span>
            </label>
          ) : null}
        </div>
      ) : null}

      {high && isAfterUse && earlier?.comment ? (
        <label className={styles.check}>
          <input type="checkbox" checked={hideReview} onChange={(e) => setHideReview(e.target.checked)} />
          <span>Don&apos;t show my review</span>
        </label>
      ) : null}

      {rating ? (
        <div className={styles.actionsRow}>
          {onCancel ? (
            <button type="button" className={styles.secondaryBtn} onClick={onCancel} disabled={saving}>
              Cancel
            </button>
          ) : null}
          <button type="button" className={styles.primaryBtn} onClick={save} disabled={saving}>
            {saving ? "Saving…" : channel === "email" ? "Save rating" : current ? "Update rating" : "Send"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
