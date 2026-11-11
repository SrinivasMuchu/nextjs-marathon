"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagenation from "@/Components/CommonJsx/Pagenation";
import Loading from "../CommonJsx/Loaders/Loading";
import { getAdminUserTrack, getAdminUserTrackDetail } from "@/api/adminUserTrackApi";
import panelStyles from "./AdminPannel.module.css";
import tableStyles from "./CadToolStatsDashboard.module.css";
import styles from "./UserTrackPanel.module.css";

const SECTIONS = [
  { id: "conversion", label: "CAD conversion" },
  { id: "viewer", label: "Viewer" },
  { id: "techdraw", label: "TechDraw" },
  { id: "stepbom", label: "STEP BOM" },
  { id: "payments", label: "Payments" },
];

const WINDOWS = [
  { id: "all", label: "Till now" },
  { id: "last7", label: "Last 7 days" },
];

const STATUSES = [
  { id: "all", label: "All", key: "total" },
  { id: "success", label: "Success", key: "success" },
  { id: "failed", label: "Failed", key: "failed" },
];

const PAYMENT_STATUSES = [
  ...STATUSES,
  { id: "initiated", label: "Initiated", key: "initiated" },
];

const PAYMENT_TYPE_LABELS = {
  CAD_LIBRARY: "Library",
  CAD_TECHDRAW: "TechDraw",
  CAD_CONVERTER: "Converter",
  CAD_CONVERTER_PACK: "Converter pack",
  CAD_2D_LIBRARY: "2D library",
};

function formatWhen(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(amounts) {
  const paid = (amounts || []).filter((row) => Number(row.amount));
  if (!paid.length) return "";
  return paid
    .map((row) => {
      const amount = Number(row.amount) || 0;
      try {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: row.currency || "USD",
          maximumFractionDigits: 2,
        }).format(amount);
      } catch {
        return `${row.currency || ""} ${amount}`;
      }
    })
    .join(" · ");
}

function statusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed" || normalized === "success") {
    return `${panelStyles.badge} ${panelStyles.badgeSuccess}`;
  }
  if (normalized === "failed") return `${panelStyles.badge} ${panelStyles.badgeDanger}`;
  if (
    normalized === "pending" ||
    normalized === "processing" ||
    normalized === "uploading" ||
    normalized === "initiated"
  ) {
    return `${panelStyles.badge} ${panelStyles.badgeWarn}`;
  }
  return `${panelStyles.badge} ${panelStyles.badgeInfo}`;
}

function paymentStatusLabel(status) {
  if (status === "success") return "Success";
  if (status === "failed") return "Failed";
  if (status === "initiated") return "Initiated";
  return status || "—";
}

function TrackCard({ section, bucket, windowId, selected, onSelect }) {
  const isPaymentCard = section.id === "payments";
  const stats = isPaymentCard ? PAYMENT_STATUSES : STATUSES;
  const paid = isPaymentCard ? formatMoney(bucket?.amounts) : "";
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{section.label}</span>
      {stats.map((item) => {
        const active =
          selected?.section === section.id &&
          selected?.window === windowId &&
          selected?.status === item.id;
        return (
          <div key={item.id} className={styles.statRow}>
            <span className={styles.statLabel}>{item.label}</span>
            <button
              type="button"
              className={`${styles.statBtn} ${active ? styles.statBtnActive : ""}`}
              onClick={() => onSelect(section.id, windowId, item.id)}
            >
              {bucket?.[item.key] || 0}
            </button>
          </div>
        );
      })}
      {paid ? <span className={styles.amount}>Success {paid}</span> : null}
      {!isPaymentCard && (bucket?.pending || 0) > 0 ? (
        <span className={styles.amount}>{bucket.pending} other</span>
      ) : null}
    </div>
  );
}

function UserTrackPanel() {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const search = async (event) => {
    event?.preventDefault();
    const term = query.trim();
    if (!term) {
      setError("Enter a user id or email.");
      setTrack(null);
      return;
    }
    setLoading(true);
    setError("");
    setSelected(null);
    setDetail(null);
    setPage(1);
    try {
      const data = await getAdminUserTrack(term);
      setTrack(data);
    } catch (err) {
      setTrack(null);
      setError(err?.message || "Could not load this user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selected || !track?.user?._id) {
      setDetail(null);
      return undefined;
    }
    let cancelled = false;
    const load = async () => {
      setDetailLoading(true);
      try {
        const data = await getAdminUserTrackDetail({
          orgId: track.user._id,
          section: selected.section,
          window: selected.window,
          status: selected.status,
          page,
          limit: 20,
        });
        if (!cancelled) setDetail(data);
      } catch (err) {
        console.error("Error fetching user track detail:", err);
        if (!cancelled) {
          setDetail(null);
          toast.error(err?.message || "Could not load these records.");
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selected, page, track?.user?._id]);

  const openDetail = (section, windowId, status) => {
    setPage(1);
    setSelected({ section, window: windowId, status });
  };

  const selectedSection = SECTIONS.find((item) => item.id === selected?.section);
  const selectedWindow = WINDOWS.find((item) => item.id === selected?.window);
  const selectedStatus = PAYMENT_STATUSES.find((item) => item.id === selected?.status);
  const isPayments = selected?.section === "payments";

  return (
    <div className={styles.page}>
      <form className={styles.searchRow} onSubmit={search}>
        <input
          className={styles.searchInput}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="User _id or email"
          aria-label="User id or email"
        />
        <button type="submit" className={styles.searchBtn} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}

      {loading ? (
        <div className={tableStyles.loadingWrap}>
          <Loading />
        </div>
      ) : null}

      {!loading && track?.user ? (
        <>
          <div className={styles.userCard}>
            <h3 className={styles.userName}>{track.user.full_name || track.user.username || "User"}</h3>
            <p className={styles.userMeta}>{track.user.user_email || "No email"}</p>
            <p className={`${styles.userMeta} ${styles.mono}`}>{String(track.user._id)}</p>
            <p className={styles.userMeta}>Joined {formatWhen(track.user.createdAt)}</p>
          </div>

          {WINDOWS.map((windowItem) => (
            <section key={windowItem.id} className={styles.sectionBlock}>
              <div>
                <h3 className={styles.sectionTitle}>{windowItem.label}</h3>
                <p className={styles.sectionHint}>
                  {windowItem.id === "last7"
                    ? `${track.last7_start} to ${track.last7_end} · ${track.timezone || "Asia/Kolkata"}`
                    : "Every record still stored. STEP BOM jobs are removed about 8 days after they are created."}
                </p>
              </div>
              <div className={styles.cards}>
                {SECTIONS.map((section) => (
                  <TrackCard
                    key={section.id}
                    section={section}
                    bucket={track.sections?.[section.id]?.[windowItem.id]}
                    windowId={windowItem.id}
                    selected={selected}
                    onSelect={openDetail}
                  />
                ))}
              </div>
            </section>
          ))}

          {selected ? (
            <div>
              <div className={tableStyles.detailHead}>
                <h3 className={tableStyles.detailTitle}>
                  {selectedSection?.label} · {selectedWindow?.label} · {selectedStatus?.label}
                  {detail?.total != null ? ` (${detail.total})` : ""}
                </h3>
              </div>

              {detailLoading ? (
                <div className={tableStyles.loadingWrap}>
                  <Loading />
                </div>
              ) : (
                <>
                  <div className={tableStyles.tableWrap}>
                    <table className={tableStyles.table}>
                      <thead>
                        <tr>
                          {isPayments ? (
                            <>
                              <th>When</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Amount</th>
                              <th>Method</th>
                              <th>Razorpay ID</th>
                            </>
                          ) : (
                            <>
                              <th>When</th>
                              <th>File</th>
                              <th>Status</th>
                              <th>Format</th>
                              <th>Time</th>
                              <th>Error</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {(detail?.rows || []).length === 0 ? (
                          <tr>
                            <td colSpan={6} className={tableStyles.empty}>
                              No records for this selection.
                            </td>
                          </tr>
                        ) : (
                          (detail?.rows || []).map((row) =>
                            isPayments ? (
                              <tr key={row._id}>
                                <td>{formatWhen(row.createdAt)}</td>
                                <td>{PAYMENT_TYPE_LABELS[row.payment_type] || row.payment_type || "—"}</td>
                                <td>
                                  <span className={statusClass(row.status)}>{paymentStatusLabel(row.status)}</span>
                                </td>
                                <td>
                                  {row.amount == null
                                    ? "—"
                                    : formatMoney([{ currency: row.currency, amount: row.amount }])}
                                </td>
                                <td>{row.payment_method || "—"}</td>
                                <td className={styles.mono}>{row.razorpay_payment_id || "—"}</td>
                              </tr>
                            ) : (
                              <tr key={row._id}>
                                <td>{formatWhen(row.createdAt)}</td>
                                <td className={styles.fileName} title={row.file_name || ""}>
                                  {row.file_name || "—"}
                                </td>
                                <td>
                                  <span className={statusClass(row.status)}>{row.status || "—"}</span>
                                </td>
                                <td>{row.input_format || "—"}</td>
                                <td>
                                  {row.time_taken_seconds == null ? "—" : `${row.time_taken_seconds}s`}
                                </td>
                                <td className={styles.errorText} title={row.error_message || ""}>
                                  {row.error_message || "—"}
                                </td>
                              </tr>
                            ),
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {(detail?.totalPages || 1) > 1 ? (
                    <Pagenation
                      currentPage={page}
                      setCurrentPage={setPage}
                      totalPages={detail.totalPages}
                    />
                  ) : null}
                </>
              )}
            </div>
          ) : (
            <p className={styles.sectionHint}>Click a count to open the matching records.</p>
          )}
        </>
      ) : null}

      {!loading && !track && !error ? (
        <p className={styles.empty}>Search a user id or email to see their CAD and payment history.</p>
      ) : null}
    </div>
  );
}

export default UserTrackPanel;
