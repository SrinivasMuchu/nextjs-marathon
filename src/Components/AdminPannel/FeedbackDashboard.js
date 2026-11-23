"use client";

import React, { useCallback, useEffect, useState } from "react";
import Pagenation from "@/Components/CommonJsx/Pagenation";
import Loading from "../CommonJsx/Loaders/Loading";
import {
  FEEDBACK_FAMILY_LABELS,
  familyLabel,
  getFeedbackRatings,
  getFeedbackSummary,
} from "@/api/adminFeedbackApi";
import styles from "./FeedbackDashboard.module.css";

const WEEK_OPTIONS = [4, 8, 12];

const MOMENT_LABELS = {
  first_impression: "First impression",
  after_use: "After use",
  failed: "Failed job",
  abandoned: "Didn't download",
};

const ABANDON_STATE_LABELS = {
  free_left: "Had free credits left",
  paywall_closed: "Closed the paywall",
};

const RATINGS_LIMIT = 20;

function fmtAvg(avg) {
  if (avg === null || avg === undefined || Number.isNaN(Number(avg))) {
    return (
      <span title="Fewer than 5 ratings">
        —<span className={styles.muted}>&lt;5 ratings</span>
      </span>
    );
  }
  return Number(avg).toFixed(2);
}

function fmtPct(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  // The summary endpoint sends response_rate as a 0–100 percentage.
  return `${n.toFixed(1)}%`;
}

function pctOf(part, whole) {
  const p = Number(part) || 0;
  const w = Number(whole) || 0;
  if (!w) return "—";
  return `${((p / w) * 100).toFixed(1)}%`;
}

function fmtNum(value) {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("en-GB");
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

function SimpleTable({ columns, rows, empty = "Nothing yet." }) {
  if (!rows || rows.length === 0) {
    return <div className={`${styles.tableWrap} ${styles.empty}`}>{empty}</div>;
  }
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.num ? styles.num : undefined}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className={c.num ? styles.num : undefined}>
                  {c.render ? c.render(row) : row[c.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children, hint }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      {children}
    </section>
  );
}

function Tile({ label, value, sub }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardValue}>{value}</span>
      {sub ? <span className={styles.cardSub}>{sub}</span> : null}
    </div>
  );
}

function LatestRatings() {
  const [family, setFamily] = useState("");
  const [moment, setMoment] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ rows: [], total: 0, page: 1, limit: RATINGS_LIMIT });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getFeedbackRatings({ page, limit: RATINGS_LIMIT, family, moment, max_rating: maxRating })
      .then((res) => {
        if (!cancelled) setData(res || { rows: [], total: 0 });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || "Could not load ratings");
          setData({ rows: [], total: 0 });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, family, moment, maxRating]);

  const totalPages = Math.max(1, Math.ceil((Number(data?.total) || 0) / (Number(data?.limit) || RATINGS_LIMIT)));
  const rows = data?.rows || [];

  const onFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <Section title={`Latest ratings (${fmtNum(data?.total || 0)})`}>
      <div className={styles.filterGroup}>
        <select className={styles.select} value={family} onChange={onFilter(setFamily)} aria-label="Family">
          <option value="">All families</option>
          {Object.entries(FEEDBACK_FAMILY_LABELS).map(([id, label]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
        <select className={styles.select} value={moment} onChange={onFilter(setMoment)} aria-label="Moment">
          <option value="">All moments</option>
          {Object.entries(MOMENT_LABELS).map(([id, label]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
        <select className={styles.select} value={maxRating} onChange={onFilter(setMaxRating)} aria-label="Max rating">
          <option value="">Any rating</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>≤ {n} stars</option>
          ))}
        </select>
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
      {loading ? (
        <div className={styles.loadingWrap}><Loading /></div>
      ) : rows.length === 0 ? (
        <div className={`${styles.tableWrap} ${styles.empty}`}>No ratings match these filters.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>When</th>
                <th>User</th>
                <th>Family / route</th>
                <th>Moment</th>
                <th className={styles.num}>Rating</th>
                <th>File</th>
                <th>Tags</th>
                <th>Details</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const user = r.user_id && typeof r.user_id === "object" ? r.user_id : null;
                const tags = [...(r.tags || []), ...(r.other_tags || [])];
                return (
                  <tr key={r._id}>
                    <td style={{ whiteSpace: "nowrap" }}>{fmtDateTime(r.updatedAt)}</td>
                    <td>
                      <div>{user?.full_name || "—"}</div>
                      <div className={styles.hint}>{user?.user_email || ""}</div>
                    </td>
                    <td>
                      <div>{familyLabel(r.route_family)}</div>
                      <div className={styles.hint}>{r.route || ""}</div>
                    </td>
                    <td>{MOMENT_LABELS[r.moment] || r.moment || "—"}</td>
                    <td className={`${styles.num} ${Number(r.rating) <= 2 ? styles.low : ""}`}>
                      {r.rating ?? "—"}
                    </td>
                    <td className={styles.wrap}>{r.file_name || "—"}</td>
                    <td>
                      {tags.length ? tags.map((t) => <span key={t} className={styles.chip}>{t}</span>) : "—"}
                    </td>
                    <td className={styles.wrap}>
                      {r.comment ? <div>“{r.comment}”</div> : null}
                      {r.purpose ? <div className={styles.hint}>Purpose: {r.purpose}</div> : null}
                      {r.software ? <div className={styles.hint}>Software: {r.software}</div> : null}
                      {r.abandon_reason ? <div className={styles.hint}>Didn&apos;t download: {r.abandon_reason}</div> : null}
                      {r.failure_reason ? <div className={styles.hint}>Failure: {r.failure_reason}</div> : null}
                      {r.source || r.channel ? (
                        <div className={styles.hint}>
                          via {[r.source, r.channel].filter(Boolean).join(" / ")}
                        </div>
                      ) : null}
                    </td>
                    <td>{r.review_status || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 ? (
        <Pagenation currentPage={page} setCurrentPage={setPage} totalPages={totalPages} />
      ) : null}
    </Section>
  );
}

function FeedbackDashboard() {
  const [weeks, setWeeks] = useState(4);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (w) => {
    setLoading(true);
    setError("");
    try {
      const data = await getFeedbackSummary({ weeks: w });
      setSummary(data || null);
    } catch (err) {
      setError(err?.message || "Could not load feedback summary");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(weeks);
  }, [weeks, load]);

  const s = summary || {};
  const cases = s.cases || {};
  const testimonials = s.testimonials || {};

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <p className={styles.hint}>
          {s.since ? `Since ${fmtDateTime(s.since)}` : "Feedback loop overview"}
        </p>
        <div className={styles.filterGroup}>
          {WEEK_OPTIONS.map((w) => (
            <button
              key={w}
              type="button"
              className={`${styles.filterBtn} ${weeks === w ? styles.filterBtnActive : ""}`}
              onClick={() => setWeeks(w)}
            >
              Last {w} weeks
            </button>
          ))}
        </div>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      {loading && !summary ? (
        <div className={styles.loadingWrap}><Loading /></div>
      ) : summary ? (
        <>
          <Section title="Routes (weakest first)">
            <p className={styles.note}>
              First impressions never rank routes — ranking uses after-use ratings.
            </p>
            <SimpleTable
              rows={s.families || []}
              columns={[
                { key: "family", label: "Family", render: (r) => familyLabel(r.family) },
                { key: "after_use_avg", label: "After-use avg", num: true, render: (r) => fmtAvg(r.after_use_avg) },
                { key: "after_use_count", label: "After-use n", num: true, render: (r) => fmtNum(r.after_use_count) },
                { key: "first_impression_avg", label: "First-impression avg", num: true, render: (r) => fmtAvg(r.first_impression_avg) },
                { key: "first_impression_count", label: "First-impression n", num: true, render: (r) => fmtNum(r.first_impression_count) },
                {
                  key: "low_count",
                  label: "Low (≤2)",
                  num: true,
                  render: (r) => <span className={Number(r.low_count) > 0 ? styles.low : ""}>{fmtNum(r.low_count)}</span>,
                },
                {
                  key: "response_rate",
                  label: "Response rate",
                  num: true,
                  render: (r) => (
                    <span title={`${fmtNum(r.rated_jobs)} rated / ${fmtNum(r.downloaded_jobs)} downloaded`}>
                      {fmtPct(r.response_rate)}
                    </span>
                  ),
                },
              ]}
            />
          </Section>

          <Section title="Cases">
            <div className={styles.cards}>
              <Tile label="Open" value={fmtNum(cases.open ?? 0)} sub={`${fmtNum(cases.opened ?? 0)} opened in period`} />
              <Tile
                label="Answered within 1 day"
                value={`${fmtNum(cases.answered_within_1_day ?? 0)} / ${fmtNum(cases.opened ?? 0)}`}
                sub={pctOf(cases.answered_within_1_day, cases.opened)}
              />
              <Tile
                label="Median reply"
                value={cases.median_reply_hours === null || cases.median_reply_hours === undefined
                  ? "—"
                  : `${Number(cases.median_reply_hours).toFixed(1)} h`}
              />
              <Tile label="Recovered users" value={fmtNum(cases.recovered_users ?? 0)} />
              <Tile label="Consented to file access" value={fmtNum(cases.consented ?? 0)} />
            </div>
          </Section>

          <Section title="Funnel">
            <SimpleTable
              rows={s.funnel || []}
              columns={[
                { key: "family", label: "Family", render: (r) => familyLabel(r.family) },
                { key: "completed", label: "Completed", num: true, render: (r) => fmtNum(r.completed) },
                { key: "viewed", label: "Viewed", num: true, render: (r) => fmtNum(r.viewed) },
                { key: "paywall_shown", label: "Paywall shown", num: true, render: (r) => fmtNum(r.paywall_shown) },
                { key: "downloaded", label: "Downloaded", num: true, render: (r) => fmtNum(r.downloaded) },
                {
                  key: "never",
                  label: "Never downloaded",
                  num: true,
                  render: (r) => pctOf((Number(r.completed) || 0) - (Number(r.downloaded) || 0), r.completed),
                },
              ]}
            />
          </Section>

          <div className={styles.grid2}>
            <Section title="Top low-rating tags">
              <SimpleTable
                rows={s.top_tags || []}
                columns={[
                  { key: "family", label: "Family", render: (r) => familyLabel(r.family) },
                  { key: "tag", label: "Tag" },
                  { key: "count", label: "Count", num: true, render: (r) => fmtNum(r.count) },
                ]}
              />
            </Section>
            <Section title="Download / payment problems">
              <SimpleTable
                rows={s.other_tags || []}
                columns={[
                  { key: "tag", label: "Problem" },
                  { key: "count", label: "Count", num: true, render: (r) => fmtNum(r.count) },
                ]}
              />
            </Section>
            <Section title="Failed jobs: what they needed it for">
              <SimpleTable
                rows={s.failed_answers || []}
                columns={[
                  { key: "family", label: "Family", render: (r) => familyLabel(r.family) },
                  { key: "purpose", label: "Purpose", render: (r) => r.purpose || "(no answer)" },
                  { key: "count", label: "Count", num: true, render: (r) => fmtNum(r.count) },
                ]}
              />
            </Section>
            <Section title="Didn't download: reasons">
              <SimpleTable
                rows={s.abandon_reasons || []}
                columns={[
                  { key: "reason", label: "Reason", render: (r) => r.reason || "(no answer)" },
                  { key: "state", label: "State", render: (r) => ABANDON_STATE_LABELS[r.state] || r.state || "—" },
                  { key: "count", label: "Count", num: true, render: (r) => fmtNum(r.count) },
                ]}
              />
            </Section>
          </div>

          <Section title="Pipeline-version trend">
            <SimpleTable
              rows={s.by_pipeline_version || []}
              columns={[
                { key: "family", label: "Family", render: (r) => familyLabel(r.family) },
                { key: "version", label: "Version", render: (r) => r.version || "(unknown)" },
                { key: "count", label: "Ratings", num: true, render: (r) => fmtNum(r.count) },
                { key: "avg", label: "Avg", num: true, render: (r) => fmtAvg(r.avg) },
              ]}
            />
          </Section>

          <div className={styles.grid2}>
            <Section title="Testimonials by status">
              <SimpleTable
                rows={Object.entries(testimonials).map(([status, count]) => ({ status, count }))}
                columns={[
                  { key: "status", label: "Status" },
                  { key: "count", label: "Count", num: true, render: (r) => fmtNum(r.count) },
                ]}
              />
            </Section>
            <Section title="Emails">
              <SimpleTable
                rows={s.emails || []}
                columns={[
                  { key: "kind", label: "Kind" },
                  { key: "status", label: "Status" },
                  { key: "count", label: "Count", num: true, render: (r) => fmtNum(r.count) },
                ]}
              />
            </Section>
          </div>
        </>
      ) : null}

      <LatestRatings />
    </div>
  );
}

export default FeedbackDashboard;
