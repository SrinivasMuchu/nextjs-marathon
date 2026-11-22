"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../CommonJsx/Loaders/Loading";
import {
  familyLabel,
  getFeedbackCases,
  markFeedbackCaseFixed,
  replyFeedbackCase,
  updateFeedbackCase,
} from "@/api/adminFeedbackApi";
import base from "./FeedbackDashboard.module.css";
import styles from "./FeedbackCases.module.css";

const STATUSES = [
  { id: "open", label: "Open" },
  { id: "looking", label: "Looking" },
  { id: "reply_sent", label: "Reply sent" },
  { id: "fixed", label: "Fixed" },
  { id: "wont_fix", label: "Won't fix" },
];
const STATUS_LABEL = Object.fromEntries(STATUSES.map((s) => [s.id, s.label]));

const OWNERS = [
  { id: "", label: "All owners" },
  { id: "converter", label: "Converter (Srinivas)" },
  { id: "drawing", label: "Drawing (Karishma)" },
];

const ORIGIN_LABELS = {
  low_rating: "Low rating",
  failed_job: "Failed job",
  abandon_wrong: "Didn't download: something wrong",
  email_reply: "Email reply",
};

const CLOSED = new Set(["reply_sent", "fixed", "wont_fix"]);
const DAY_MS = 24 * 60 * 60 * 1000;

// Milliseconds between two dates, counting only Monday–Friday.
function workingMsBetween(from, to) {
  if (!(from instanceof Date) || Number.isNaN(from.getTime()) || to <= from) return 0;
  let total = 0;
  let cursor = new Date(from);
  while (cursor < to) {
    const nextMidnight = new Date(cursor);
    nextMidnight.setHours(24, 0, 0, 0);
    const end = nextMidnight < to ? nextMidnight : to;
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) total += end - cursor;
    cursor = end;
  }
  return total;
}

function ageLabel(createdAt) {
  const ms = Date.now() - new Date(createdAt).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const hours = ms / 3_600_000;
  if (hours < 1) return `${Math.max(1, Math.round(ms / 60_000))}m`;
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

function isLate(c) {
  if (c.replied_at || CLOSED.has(c.status)) return false;
  return workingMsBetween(new Date(c.createdAt), new Date()) > DAY_MS;
}

function priorityScore(p) {
  if (p === true) return 2;
  if (typeof p === "number") return p;
  if (typeof p === "string") {
    const v = p.toLowerCase();
    if (v === "high" || v === "urgent" || v === "true") return 2;
    if (v === "normal" || v === "medium") return 1;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function isPriority(p) {
  return p === true || (typeof p === "string" && ["high", "urgent", "true"].includes(p.toLowerCase()))
    || (typeof p === "number" && p > 1);
}

function fmtDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function joinList(list) {
  return Array.isArray(list) && list.length ? list.join(", ") : null;
}

function CaseDetail({ item, onUpdated }) {
  const [status, setStatus] = useState(item.status || "open");
  const [note, setNote] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState("");

  const run = async (key, fn, successMsg) => {
    setBusy(key);
    try {
      const res = await fn();
      toast.success(successMsg);
      onUpdated(res);
      return true;
    } catch (err) {
      toast.error(err?.message || "Request failed");
      return false;
    } finally {
      setBusy("");
    }
  };

  const saveStatus = async () => {
    const changed = status !== item.status;
    if (!changed && !note.trim()) {
      toast.info("Change the status or add a note first.");
      return;
    }
    const ok = await run(
      "status",
      () => updateFeedbackCase(item._id, { status: changed ? status : undefined, note: note.trim() || undefined }),
      "Case updated",
    );
    if (ok) setNote("");
  };

  const sendReply = async () => {
    const message = reply.trim();
    if (!message) return;
    const email = item.user_id?.user_email || "the user";
    if (!window.confirm(`Send this reply by email to ${email}?`)) return;
    const ok = await run("reply", () => replyFeedbackCase(item._id, message), "Reply sent");
    if (ok) setReply("");
  };

  const markFixed = async (sendEmail) => {
    const email = item.user_id?.user_email || "the user";
    const question = sendEmail
      ? `Mark fixed and email ${email} "It's fixed: upload it again"?`
      : "Mark fixed WITHOUT emailing the user?";
    if (!window.confirm(question)) return;
    const ok = await run(
      sendEmail ? "fixedEmail" : "fixedQuiet",
      () => markFeedbackCaseFixed(item._id, { send_email: sendEmail, note: note.trim() || undefined }),
      sendEmail ? "Marked fixed and emailed" : "Marked fixed",
    );
    if (ok) setNote("");
  };

  const user = item.user_id && typeof item.user_id === "object" ? item.user_id : null;
  const fields = [
    ["User", user ? `${user.full_name || ""} <${user.user_email || ""}>` : String(item.user_id || "—")],
    ["Job", item.job_id ? `${item.job_id} (${item.job_type || "?"})` : null],
    ["File", item.file_name],
    ["Route", item.route ? `${item.route} · ${familyLabel(item.route_family)}` : familyLabel(item.route_family)],
    ["Rating", item.rating ?? null],
    ["Tags", joinList(item.tags)],
    ["Other tags", joinList(item.other_tags)],
    ["Purpose", item.purpose],
    ["Software", item.software],
    ["Comment", item.comment],
    ["Failure reason", item.failure_reason],
    ["Abandon reason", item.abandon_reason],
    ["Contact OK", item.contact_ok === undefined ? null : item.contact_ok ? "Yes" : "No"],
    ["File access", item.consent_file ? "Consented" : "Not consented"],
    ["Owner", item.owner],
    ["Created", fmtDateTime(item.createdAt)],
    ["Replied", item.replied_at ? fmtDateTime(item.replied_at) : null],
    ["Reply text", item.reply_text],
    ["Fixed", item.fixed_at ? fmtDateTime(item.fixed_at) : null],
    ["Fixed email sent", item.fixed_email_sent_at ? fmtDateTime(item.fixed_email_sent_at) : null],
  ].filter(([, v]) => v !== null && v !== undefined && v !== "");

  return (
    <div className={styles.detailGrid}>
      <dl className={styles.fields}>
        {fields.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt>{k}</dt>
            <dd>{String(v)}</dd>
          </React.Fragment>
        ))}
      </dl>

      <div className={styles.panel}>
        <h4 className={styles.panelTitle}>History</h4>
        {item.events && item.events.length ? (
          <ul className={styles.events}>
            {item.events.map((ev, i) => (
              <li key={i}>
                <strong>{STATUS_LABEL[ev.status] || ev.status || "note"}</strong>
                {" · "}
                {fmtDateTime(ev.at)}
                {ev.by ? ` · ${ev.by}` : ""}
                {ev.note ? <div>{ev.note}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className={base.hint}>No events yet.</p>
        )}
      </div>

      <div className={styles.panel}>
        <h4 className={styles.panelTitle}>Status</h4>
        <select className={base.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <input
          className={styles.input}
          placeholder="Internal note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className={styles.actions}>
          <button type="button" className={styles.btn} disabled={!!busy} onClick={saveStatus}>
            {busy === "status" ? "Saving…" : "Save"}
          </button>
        </div>

        <h4 className={styles.panelTitle}>Mark fixed</h4>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGreen}`}
            disabled={!!busy}
            onClick={() => markFixed(true)}
          >
            {busy === "fixedEmail" ? "Sending…" : "Mark fixed & email 'upload it again'"}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost}`}
            disabled={!!busy}
            onClick={() => markFixed(false)}
          >
            {busy === "fixedQuiet" ? "Saving…" : "Mark fixed without email"}
          </button>
        </div>
      </div>

      <div className={styles.panel}>
        <h4 className={styles.panelTitle}>Reply to user</h4>
        <p className={base.hint}>Sent by email to {user?.user_email || "the user"}; sets status to “Reply sent”.</p>
        <textarea
          className={styles.textarea}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply…"
        />
        <div className={styles.actions}>
          <button type="button" className={styles.btn} disabled={!!busy || !reply.trim()} onClick={sendReply}>
            {busy === "reply" ? "Sending…" : "Send reply"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackCases() {
  const [statuses, setStatuses] = useState(["open", "looking"]);
  const [owner, setOwner] = useState("");
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  const statusKey = statuses.join(",");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getFeedbackCases({ status: statusKey || undefined, owner: owner || undefined });
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Could not load cases");
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [statusKey, owner]);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => {
    return [...cases].sort((a, b) => {
      const p = priorityScore(b.priority) - priorityScore(a.priority);
      if (p) return p;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }, [cases]);

  const toggleStatus = (id) => {
    setStatuses((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const onUpdated = (res) => {
    const updated = res && typeof res === "object" && res._id ? res : res?.case;
    if (updated && updated._id) {
      setCases((prev) => prev.map((c) => (c._id === updated._id
        ? { ...c, ...updated, user_id: typeof updated.user_id === "object" ? updated.user_id : c.user_id }
        : c)));
    } else {
      load();
    }
  };

  return (
    <div className={base.page}>
      <div className={base.toolbar}>
        <div className={base.filterGroup}>
          {STATUSES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${base.filterBtn} ${statuses.includes(s.id) ? base.filterBtnActive : ""}`}
              onClick={() => toggleStatus(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={base.filterGroup}>
          <select className={base.select} value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Owner">
            {OWNERS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
          <button type="button" className={base.filterBtn} onClick={load}>Refresh</button>
        </div>
      </div>
      <p className={base.hint}>
        Owners: converter cases → Srinivas, drawing cases → Karishma. Priority cases are listed first.
        Age turns red after 1 working day without a reply.
      </p>

      {error ? <div className={base.error}>{error}</div> : null}

      {loading ? (
        <div className={base.loadingWrap}><Loading /></div>
      ) : sorted.length === 0 ? (
        <div className={`${base.tableWrap} ${base.empty}`}>No cases match these filters.</div>
      ) : (
        <div className={base.tableWrap}>
          <table className={base.table}>
            <thead>
              <tr>
                <th>Age</th>
                <th>Status</th>
                <th>Origin</th>
                <th>User</th>
                <th>Family / file</th>
                <th className={base.num}>Rating</th>
                <th>Summary</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => {
                const open = expanded === c._id;
                const user = c.user_id && typeof c.user_id === "object" ? c.user_id : null;
                const summary = c.comment || c.failure_reason || c.abandon_reason || joinList(c.tags) || "";
                return (
                  <React.Fragment key={c._id}>
                    <tr
                      className={`${styles.row} ${open ? styles.rowOpen : ""}`}
                      onClick={() => setExpanded(open ? null : c._id)}
                    >
                      <td className={isLate(c) ? styles.ageLate : ""} title={fmtDateTime(c.createdAt)}>
                        {ageLabel(c.createdAt)}
                      </td>
                      <td>
                        {isPriority(c.priority) ? <div><span className={styles.priority}>Priority</span></div> : null}
                        <span className={`${styles.badge} ${styles[`status_${c.status}`] || ""}`}>
                          {STATUS_LABEL[c.status] || c.status}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeOrigin}`}>
                          {ORIGIN_LABELS[c.origin] || c.origin || "—"}
                        </span>
                        {c.consent_file ? (
                          <span className={`${styles.badge} ${styles.badgeConsent}`}>Consented to file access</span>
                        ) : null}
                      </td>
                      <td>
                        <div>{user?.full_name || "—"}</div>
                        <div className={base.hint}>{user?.user_email || ""}</div>
                      </td>
                      <td>
                        <div>{familyLabel(c.route_family)}</div>
                        <div className={base.hint}>{c.file_name || ""}</div>
                      </td>
                      <td className={base.num}>{c.rating ?? "—"}</td>
                      <td className={base.wrap}>{summary || "—"}</td>
                      <td>{c.owner || "—"}</td>
                    </tr>
                    {open ? (
                      <tr>
                        <td colSpan={8} className={styles.detail}>
                          <CaseDetail key={`${c._id}-${c.status}`} item={c} onUpdated={onUpdated} />
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FeedbackCases;
