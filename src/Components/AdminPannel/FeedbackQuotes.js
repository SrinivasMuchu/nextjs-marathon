"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../CommonJsx/Loaders/Loading";
import {
  familyLabel,
  getFeedbackTestimonials,
  moderateFeedbackTestimonial,
} from "@/api/adminFeedbackApi";
import base from "./FeedbackDashboard.module.css";
import styles from "./FeedbackQuotes.module.css";

const STATUSES = [
  { id: "pending", label: "Pending" },
  { id: "published", label: "Published" },
  { id: "awaiting_confirmation", label: "Awaiting confirmation" },
  { id: "rejected", label: "Rejected" },
  { id: "withdrawn", label: "Withdrawn" },
  { id: "dropped", label: "Dropped" },
  { id: "all", label: "All" },
];

const FLAG_INFO = {
  copies_example: "Looks copied from the example text we show — ask for their own words.",
  banned_claim: "Contains a claim we can't support (speed, file size, “always”, “unlimited”).",
  personal_data: "May contain personal data (email, phone, address, names of other people).",
  too_short: "Too short to be a useful quote.",
};

const REJECT_REASONS = [
  { id: "personal_data", label: "Personal data" },
  { id: "unsupported_claim", label: "Claim we can't support" },
  { id: "not_a_real_job", label: "Doesn't match a real job" },
  { id: "staff_or_partner", label: "Staff, partner or relative" },
  { id: "copies_example", label: "Copies the example" },
  { id: "other", label: "Other" },
];

function fmtDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function QuoteCard({ item, onDone }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState("");
  const published = item.status === "published";
  const canModerate = item.status === "pending" || item.status === "awaiting_confirmation" || published;

  const act = async (action) => {
    if (action === "reject" && !reason) {
      toast.info("Pick a rejection reason first.");
      return;
    }
    const question = action === "publish"
      ? "Publish this quote on the site?"
      : published
        ? "Take this quote down from the site?"
        : "Reject this quote?";
    if (!window.confirm(question)) return;
    setBusy(action);
    try {
      await moderateFeedbackTestimonial(item._id, { action, reason: action === "reject" ? reason : undefined });
      toast.success(action === "publish" ? "Published" : published ? "Taken down" : "Rejected");
      onDone();
    } catch (err) {
      toast.error(err?.message || "Request failed");
    } finally {
      setBusy("");
    }
  };

  const user = item.user_id && typeof item.user_id === "object" ? item.user_id : null;
  const author = [item.display_name, item.role, item.company].filter(Boolean).join(" · ");
  const flags = Array.isArray(item.moderation_flags) ? item.moderation_flags : [];

  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.status}>{item.status}</span>
        <span>{familyLabel(item.route_family)}{item.route ? ` · ${item.route}` : ""}</span>
      </div>

      <blockquote className={styles.quote}>{item.text}</blockquote>

      <div className={styles.author}>
        <strong>{author || "(no display name)"}</strong>
        {user ? <div className={base.hint}>{user.full_name || ""} {user.user_email ? `<${user.user_email}>` : ""}</div> : null}
      </div>

      <div className={styles.meta}>
        <span>Source rating: {item.source_rating ?? "—"}</span>
        <span>Confirmed rating: {item.confirmed_rating ?? "—"}</span>
        {item.feedback?.moment ? <span>Moment: {item.feedback.moment}</span> : null}
        {item.feedback?.job_id ? <span>Job: {String(item.feedback.job_id)}</span> : null}
        {fmtDate(item.consent_at) ? <span>Consent: {fmtDate(item.consent_at)}</span> : null}
        {fmtDate(item.published_at) ? <span>Published: {fmtDate(item.published_at)}</span> : null}
      </div>

      {flags.length ? (
        <div className={styles.flags}>
          {flags.map((f) => (
            <div key={f} className={styles.flag}>
              <span className={styles.flagChip}>{f}</span>
              <span>{FLAG_INFO[f] || "Flagged by automatic checks."}</span>
            </div>
          ))}
        </div>
      ) : null}

      <ul className={styles.checklist}>
        <li>No personal data.</li>
        <li>Matches a real job.</li>
        <li>No claim we can&apos;t support — banned: speed, file size, “always”, “unlimited”.</li>
        <li>Author isn&apos;t staff, a partner or a relative.</li>
        <li>Rejection never depends on the rating.</li>
      </ul>

      {canModerate ? (
        <div className={styles.actions}>
          {!published ? (
            <button type="button" className={styles.btn} disabled={!!busy} onClick={() => act("publish")}>
              {busy === "publish" ? "Publishing…" : "Publish"}
            </button>
          ) : null}
          <select
            className={base.select}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            aria-label="Rejection reason"
          >
            <option value="">Reason…</option>
            {REJECT_REASONS.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            disabled={!!busy}
            onClick={() => act("reject")}
          >
            {busy === "reject" ? "Saving…" : published ? "Take down" : "Reject"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function FeedbackQuotes() {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getFeedbackTestimonials({ status });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Could not load quotes");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className={base.page}>
      <div className={base.toolbar}>
        <div className={base.filterGroup}>
          {STATUSES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${base.filterBtn} ${status === s.id ? base.filterBtnActive : ""}`}
              onClick={() => setStatus(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" className={base.filterBtn} onClick={load}>Refresh</button>
      </div>

      {error ? <div className={base.error}>{error}</div> : null}

      {loading ? (
        <div className={base.loadingWrap}><Loading /></div>
      ) : items.length === 0 ? (
        <div className={`${base.tableWrap} ${base.empty}`}>No quotes with this status.</div>
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <QuoteCard key={item._id} item={item} onDone={load} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackQuotes;
