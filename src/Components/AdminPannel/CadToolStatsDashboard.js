"use client";

import React, { useEffect, useState } from "react";
import Pagenation from "@/Components/CommonJsx/Pagenation";
import Loading from "../CommonJsx/Loaders/Loading";
import {
  getAdminCadToolStats,
  getAdminCadToolStatsDetail,
} from "@/api/adminCadToolStatsApi";
import panelStyles from "./AdminPannel.module.css";
import styles from "./CadToolStatsDashboard.module.css";

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

  const openDetail = (type, date) => {
    setDetailPage(1);
    setSelected({ type, date: date || null });
  };

  const selectedLabel = STAT_TYPES.find((item) => item.id === selected?.type)?.label || "";
  const rangeLabel = RANGE_OPTIONS.find((item) => item.id === rangeFilter)?.label || "Today";
  const totals = stats?.totals || { conversion: 0, viewer: 0, techdraw: 0, stepbom: 0 };

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
                    </tr>
                  </thead>
                  <tbody>
                    {(detail?.rows || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.empty}>
                          No files for this selection.
                        </td>
                      </tr>
                    ) : (
                      (detail?.rows || []).map((row) => (
                        <tr key={String(row.file_id || row._id)}>
                          <td className={styles.mono}>{String(row.file_id || row._id || "—")}</td>
                          <td className={styles.mono}>{String(row.org_id || "—")}</td>
                          <td>
                            <span className={statusClass(row.status)}>{row.status || "—"}</span>
                          </td>
                          <td>{row.user_name || "—"}</td>
                          <td>{row.user_email || "—"}</td>
                        </tr>
                      ))
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
    </div>
  );
}

export default CadToolStatsDashboard;
