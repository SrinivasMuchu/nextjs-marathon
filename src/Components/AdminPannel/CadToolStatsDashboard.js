"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Eye } from "lucide-react";
import { toast } from "react-toastify";
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
  getAdminCadToolInputDownload,
  rerunAdminCadTool,
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

const SUMMARY_STATS = [
  { id: "conversion", label: "Conversions", statKey: "conversion" },
  { id: "conversion_downloads", label: "Downloads", statKey: "conversion_downloads", downloadedOnly: true },
  { id: "viewer", label: "Viewer", statKey: "viewer" },
  { id: "techdraw", label: "TechDraw", statKey: "techdraw" },
  { id: "stepbom", label: "STEP BOM", statKey: "stepbom" },
  { id: "failed", label: "Failed", statKey: "failed", failedOnly: true },
];

const FAILED_TYPES = [
  { id: "conversion", label: "Conversions", countKey: "conversion_failed" },
  { id: "viewer", label: "Viewer", countKey: "viewer_failed" },
  { id: "techdraw", label: "TechDraw", countKey: "techdraw_failed" },
  { id: "stepbom", label: "STEP BOM", countKey: "stepbom_failed" },
];

function preferredFailedType(bucket) {
  const found = FAILED_TYPES.find((item) => Number(bucket?.[item.countKey]) > 0);
  return found?.id || "conversion";
}

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

function CountButton({ value, onClick, tone }) {
  const count = Number(value) || 0;
  const failedTone = tone === "failed" && count > 0 ? styles.countBtnFailed : "";
  return (
    <button type="button" className={`${styles.countBtn} ${failedTone}`} onClick={onClick}>
      {count}
    </button>
  );
}

// How a conversion was billed (backend `billing`): first-N free conversions, credit, paid, sample.
const CONVERSION_BILLING_LABELS = {
  free_conversion: "Free conversion",
  credit: "Credit",
  paid: "Paid",
  sample: "Sample (free)",
  unpaid: "Not paid",
};

// How a paid conversion was paid on Razorpay (backend `payment_method`). Only Apple Pay is
// called out; other methods (card, upi, ...) stay plain "Paid".
const PAYMENT_METHOD_LABELS = {
  apple_pay: "Apple Pay",
};

function conversionBillingLabel(row) {
  const base = CONVERSION_BILLING_LABELS[row?.billing];
  if (!base) return "—";
  const method = row.billing === "paid" ? PAYMENT_METHOD_LABELS[row.payment_method] : null;
  return method ? `${base} · ${method}` : base;
}

function downloadStatusLabel(row) {
  if (!row?.downloaded) return "No";
  const count = Number(row.download_count) || 1;
  return count > 1 ? `Yes · ${count}` : "Yes";
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
  const [downloadingId, setDownloadingId] = useState("");
  const [rerunningId, setRerunningId] = useState("");

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
          downloaded: Boolean(selected.downloadedOnly),
          failed: Boolean(selected.failedOnly),
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

  const openDetail = (type, date, downloadedOnly = false, failedOnly = false) => {
    setDetailPage(1);
    setSelected({
      type: downloadedOnly ? "conversion" : type,
      date: date || null,
      downloadedOnly: Boolean(downloadedOnly),
      failedOnly: Boolean(failedOnly) && !downloadedOnly,
    });
  };

  const summaryActive = (item) => {
    if (!selected || selected.date) return false;
    if (item.failedOnly) return Boolean(selected.failedOnly);
    if (selected.failedOnly) return false;
    if (item.downloadedOnly) return selected.type === "conversion" && selected.downloadedOnly;
    return selected.type === item.id && !selected.downloadedOnly;
  };

  const rerunFailed = async (row) => {
    const fileId = String(row.file_id || row._id || "");
    if (!fileId || !selected?.type || rerunningId) return;
    setRerunningId(fileId);
    try {
      await rerunAdminCadTool({ type: selected.type, fileId });
      toast.success("Rerun queued. The job is pending again.");
      setDetail((current) => {
        if (!current?.rows) return current;
        return {
          ...current,
          rows: current.rows.map((item) => {
            const id = String(item.file_id || item._id || "");
            if (id !== fileId) return item;
            return { ...item, status: "PENDING", rerun_queued: true, error_message: "" };
          }),
        };
      });
    } catch (error) {
      toast.error(error?.message || "Could not rerun this job.");
    } finally {
      setRerunningId("");
    }
  };

  const downloadInputFile = async (row) => {
    const fileId = String(row.file_id || row._id || "");
    if (!fileId || !selected?.type || downloadingId) return;
    setDownloadingId(fileId);
    try {
      const data = await getAdminCadToolInputDownload({
        type: selected.type,
        fileId,
      });
      if (!data?.url) throw new Error("Input file is not available.");
      const link = document.createElement("a");
      link.href = data.url;
      link.target = "_blank";
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(error?.message || "Could not download the input file.");
    } finally {
      setDownloadingId("");
    }
  };

  const selectedLabel = selected?.failedOnly
    ? `Failed ${STAT_TYPES.find((item) => item.id === selected?.type)?.label || ""}`
    : selected?.downloadedOnly
      ? "Downloads"
      : STAT_TYPES.find((item) => item.id === selected?.type)?.label || "";
  const rangeLabel = RANGE_OPTIONS.find((item) => item.id === rangeFilter)?.label || "Today";
  const totals = stats?.totals || {
    conversion: 0,
    conversion_downloads: 0,
    viewer: 0,
    techdraw: 0,
    stepbom: 0,
    failed: 0,
  };
  const isConversion = selected?.type === "conversion";
  const isViewer = selected?.type === "viewer";
  const showEye = isConversion || isViewer;
  const detailColSpan = 6 + (isConversion ? 6 : 0) + (showEye ? 1 : 0);
  const failedBucket = selected?.date
    ? (stats?.days || []).find((row) => row.date === selected.date) || {}
    : totals;

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
            {SUMMARY_STATS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.card} ${summaryActive(item) ? styles.cardActive : ""}`}
                onClick={() => (
                  item.failedOnly
                    ? openDetail(preferredFailedType(totals), null, false, true)
                    : openDetail(item.statKey, null, Boolean(item.downloadedOnly))
                )}
              >
                <span className={styles.cardLabel}>{item.label}</span>
                <span className={`${styles.cardValue} ${item.failedOnly ? styles.cardValueFailed : ""}`}>
                  {totals[item.statKey] || 0}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  {SUMMARY_STATS.map((item) => (
                    <th key={item.id}>{item.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(stats?.days || []).length === 0 ? (
                  <tr>
                    <td colSpan={SUMMARY_STATS.length + 1} className={styles.empty}>
                      No activity in this range.
                    </td>
                  </tr>
                ) : (
                  (stats?.days || []).map((row) => (
                    <tr key={row.date}>
                      <td>{row.date}</td>
                      {SUMMARY_STATS.map((item) => (
                        <td key={item.id}>
                          <CountButton
                            value={row[item.statKey]}
                            tone={item.failedOnly ? "failed" : ""}
                            onClick={() => (
                              item.failedOnly
                                ? openDetail(preferredFailedType(row), row.date, false, true)
                                : openDetail(item.statKey, row.date, Boolean(item.downloadedOnly))
                            )}
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
            {selected.failedOnly ? (
              <div className={styles.filterGroup}>
                {FAILED_TYPES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.filterBtn} ${selected.type === item.id ? styles.filterBtnActive : ""}`}
                    onClick={() => openDetail(item.id, selected.date, false, true)}
                  >
                    {item.label} ({Number(failedBucket[item.countKey]) || 0})
                  </button>
                ))}
              </div>
            ) : null}
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
                      <th>Email</th>
                      <th>Input file</th>
                      {isConversion ? (
                        <>
                          <th>Conversion</th>
                          <th>Time taken</th>
                          <th>Quality checks</th>
                          <th>Input size</th>
                          <th>Billing</th>
                          <th>Downloaded</th>
                        </>
                      ) : null}
                      {showEye ? <th>View</th> : null}
                      <th>Rerun</th>
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
                        const rowId = String(row.file_id || row._id || "");
                        const failed = String(row.status || "").toUpperCase() === "FAILED";
                        const queued = Boolean(row.rerun_queued);
                        const quality = isConversion ? qualitySummary(row) : null;
                        const route = isConversion ? conversionRouteLabel(row) : "";
                        const takenSeconds = Number(row.time_taken_seconds);
                        const timeLabel = isConversion && takenSeconds > 0 ? formatTime(takenSeconds) : "";
                        const sizeLabel = isConversion ? formatFileSize(row.input_file_size_bytes) : "";
                        return (
                          <tr key={rowId}>
                            <td className={styles.mono}>{rowId || "—"}</td>
                            <td className={styles.mono}>{String(row.org_id || "—")}</td>
                            <td>
                              <span className={statusClass(row.status)}>{row.status || "—"}</span>
                              {row.error_message ? (
                                <div className={styles.errorNote} title={row.error_message}>
                                  {row.error_message}
                                </div>
                              ) : null}
                            </td>
                            <td>{row.user_email || "—"}</td>
                            <td>
                              <button
                                type="button"
                                className={styles.downloadBtn}
                                disabled={downloadingId === rowId}
                                onClick={() => downloadInputFile(row)}
                              >
                                {downloadingId === rowId
                                  ? "Downloading…"
                                  : "Download"}
                              </button>
                            </td>
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
                                <td>{conversionBillingLabel(row)}</td>
                                <td>
                                  <span
                                    className={row.downloaded ? styles.downloadedYes : styles.downloadedNo}
                                    title={row.downloaded && row.downloaded_at
                                      ? `First saved ${new Date(row.downloaded_at).toLocaleString()}`
                                      : undefined}
                                  >
                                    {downloadStatusLabel(row)}
                                  </span>
                                </td>
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
                            <td>
                              {failed || queued ? (
                                <button
                                  type="button"
                                  className={styles.rerunBtn}
                                  disabled={!failed || rerunningId === rowId}
                                  onClick={() => rerunFailed(row)}
                                >
                                  {rerunningId === rowId ? "Rerunning…" : queued ? "Queued" : "Rerun"}
                                </button>
                              ) : (
                                "—"
                              )}
                            </td>
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
              <strong>{preview.row.file_name || "CAD file"}</strong>
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
