"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Eye } from "lucide-react";
import Pagenation from "@/Components/CommonJsx/Pagenation";
import Loading from "../CommonJsx/Loaders/Loading";
import PopupWrapper from "../CommonJsx/PopupWrapper";
import ConverterHistoryCard, {
  conversionRouteLabel,
  formatFileSize,
  formatTime,
  summarizeChecks,
} from "./AdminConverterHistoryCard";
import {
  getAdminCadToolStats,
  getAdminCadToolStatsDetail,
} from "@/api/adminCadToolStatsApi";
import panelStyles from "./AdminPannel.module.css";
import styles from "./CadToolStatsDashboard.module.css";

const ViewerHistoryCard = dynamic(
  () => import("./AdminViewerHistoryCard"),
  { ssr: false, loading: () => <Loading /> },
);

const STAT_TYPES = [
  { id: "conversion", label: "Conversions" },
  { id: "viewer", label: "Viewer" },
  { id: "techdraw", label: "TechDraw" },
  { id: "stepbom", label: "STEP BOM" },
];

const RANGE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last3", label: "Last 3 days" },
  { id: "last5", label: "Last 5 days" },
  { id: "last7", label: "Last 7 days" },
];

function statusClass(status) {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "COMPLETED") return `${panelStyles.badge} ${panelStyles.badgeSuccess}`;
  if (normalized === "FAILED") return `${panelStyles.badge} ${panelStyles.badgeDanger}`;
  if (normalized === "PENDING") return `${panelStyles.badge} ${panelStyles.badgeWarn}`;
  return `${panelStyles.badge} ${panelStyles.badgeInfo}`;
}

function qualitySummary(row) {
  const { passed, total } = summarizeChecks(row?.quality_checks);
  const verdict = String(row?.quality_verdict || "").trim();
  if (!total) {
    if (!verdict) return null;
    return { text: verdict, ok: verdict.toLowerCase() === "pass" };
  }
  const ok = passed === total || verdict.toLowerCase() === "pass";
  return { text: `${ok ? "Passed" : "Checks"} ${passed}/${total}`, ok };
}

function CountButton({ value, onClick }) {
  const count = Number(value) || 0;
  return (
    <button type="button" className={styles.countBtn} onClick={onClick}>
      {count}
    </button>
  );
}

function CadToolStatsDashboard() {
  const [rangeFilter, setRangeFilter] = useState("today");
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailPage, setDetailPage] = useState(1);
  const [detailLoading, setDetailLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminCadToolStats({ range: rangeFilter });
        if (!cancelled) setStats(data);
      } catch (error) {
        console.error("Error fetching CAD tool stats:", error);
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [rangeFilter]);

  useEffect(() => {
    if (!selected) {
      setDetail(null);
      return undefined;
    }
    let cancelled = false;
    const load = async () => {
      setDetailLoading(true);
      try {
        const data = await getAdminCadToolStatsDetail({
          type: selected.type,
          date: selected.date,
          range: rangeFilter,
          page: detailPage,
          limit: 20,
        });
        if (!cancelled) setDetail(data);
      } catch (error) {
        console.error("Error fetching CAD tool stats detail:", error);
        if (!cancelled) setDetail(null);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selected, rangeFilter, detailPage]);

  useEffect(() => {
    setPreview(null);
  }, [selected, rangeFilter, detailPage]);

  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  const openDetail = (type, date) => {
    setDetailPage(1);
    setSelected({ type, date: date || null });
  };

  const selectedLabel = STAT_TYPES.find((item) => item.id === selected?.type)?.label || "";
  const rangeLabel = RANGE_OPTIONS.find((item) => item.id === rangeFilter)?.label || "Today";
  const totals = stats?.totals || { conversion: 0, viewer: 0, techdraw: 0, stepbom: 0 };
  const isConversion = selected?.type === "conversion";
  const isViewer = selected?.type === "viewer";
  const showEye = isConversion || isViewer;
  const detailColSpan = 5 + (isConversion ? 4 : 0) + (showEye ? 1 : 0);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <p className={styles.hint}>{rangeLabel} · click a count to open files</p>
        <div className={styles.filterGroup}>
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.filterBtn} ${rangeFilter === option.id ? styles.filterBtnActive : ""}`}
              onClick={() => {
                setRangeFilter(option.id);
                setSelected(null);
                setDetailPage(1);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingWrap}>
          <Loading />
        </div>
      ) : (
        <>
          <div className={styles.cards}>
            {STAT_TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.card} ${selected?.type === item.id && !selected?.date ? styles.cardActive : ""}`}
                onClick={() => openDetail(item.id, null)}
              >
                <span className={styles.cardLabel}>{item.label}</span>
                <span className={styles.cardValue}>{totals[item.id] || 0}</span>
              </button>
            ))}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  {STAT_TYPES.map((item) => (
                    <th key={item.id}>{item.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(stats?.days || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No activity in this range.
                    </td>
                  </tr>
                ) : (
                  (stats?.days || []).map((row) => (
                    <tr key={row.date}>
                      <td>{row.date}</td>
                      {STAT_TYPES.map((item) => (
                        <td key={item.id}>
                          <CountButton
                            value={row[item.id]}
                            onClick={() => openDetail(item.id, row.date)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selected ? (
        <div>
          <div className={styles.detailHead}>
            <h3 className={styles.detailTitle}>
              {selectedLabel}
              {selected.date ? ` · ${selected.date}` : ` · ${rangeLabel.toLowerCase()}`}
              {detail?.total != null ? ` (${detail.total})` : ""}
            </h3>
          </div>

          {detailLoading ? (
            <div className={styles.loadingWrap}>
              <Loading />
            </div>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>File ID</th>
                      <th>Org ID</th>
                      <th>Status</th>
                      <th>User name</th>
                      <th>Email</th>
                      {isConversion ? (
                        <>
                          <th>Conversion</th>
                          <th>Time taken</th>
                          <th>Quality checks</th>
                          <th>Input size</th>
                        </>
                      ) : null}
                      {showEye ? <th>View</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {(detail?.rows || []).length === 0 ? (
                      <tr>
                        <td colSpan={detailColSpan} className={styles.empty}>
                          No files for this selection.
                        </td>
                      </tr>
                    ) : (
                      (detail?.rows || []).map((row) => {
                        const quality = isConversion ? qualitySummary(row) : null;
                        const route = isConversion ? conversionRouteLabel(row) : "";
                        const takenSeconds = Number(row.time_taken_seconds);
                        const timeLabel = isConversion && takenSeconds > 0 ? formatTime(takenSeconds) : "";
                        const sizeLabel = isConversion ? formatFileSize(row.input_file_size_bytes) : "";
                        return (
                          <tr key={String(row.file_id || row._id)}>
                            <td className={styles.mono}>{String(row.file_id || row._id || "—")}</td>
                            <td className={styles.mono}>{String(row.org_id || "—")}</td>
                            <td>
                              <span className={statusClass(row.status)}>{row.status || "—"}</span>
                            </td>
                            <td>{row.user_name || "—"}</td>
                            <td>{row.user_email || "—"}</td>
                            {isConversion ? (
                              <>
                                <td>{route || "—"}</td>
                                <td>{timeLabel || "—"}</td>
                                <td>
                                  {quality ? (
                                    <span className={quality.ok ? styles.checksOk : styles.checksWarn}>
                                      {quality.text}
                                    </span>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                                <td>{sizeLabel || "—"}</td>
                              </>
                            ) : null}
                            {showEye ? (
                              <td>
                                <button
                                  type="button"
                                  className={styles.eyeBtn}
                                  aria-label={isConversion ? "View conversion card" : "View file card"}
                                  onClick={() => setPreview({ type: selected.type, row })}
                                >
                                  <Eye size={16} />
                                </button>
                              </td>
                            ) : null}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {(detail?.totalPages || 1) > 1 ? (
                <Pagenation
                  currentPage={detailPage}
                  setCurrentPage={setDetailPage}
                  totalPages={detail.totalPages}
                />
              ) : null}
            </>
          )}
        </div>
      ) : null}

      {preview?.row ? (
        <PopupWrapper>
          <div className={styles.previewFrame} role="dialog" aria-modal="true" aria-label={preview.type === "conversion" ? "Conversion card" : "Viewer card"}>
            <button
              type="button"
              className={styles.previewClose}
              onClick={() => setPreview(null)}
              aria-label="Close"
            >
              ×
            </button>
            <p className={styles.previewMeta}>
              <strong>{preview.row.user_name || "Unknown user"}</strong>
              {preview.row.user_email ? <span>{preview.row.user_email}</span> : null}
            </p>
            {preview.type === "conversion" ? (
              <ConverterHistoryCard file={preview.row} />
            ) : (
              <ViewerHistoryCard file={preview.row} />
            )}
          </div>
        </PopupWrapper>
      ) : null}
    </div>
  );
}

export default CadToolStatsDashboard;
