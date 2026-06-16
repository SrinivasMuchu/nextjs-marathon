"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import { formatDate } from "@/common.helper";
import Pagenation from "@/Components/CommonJsx/Pagenation";
import Loading from "../CommonJsx/Loaders/Loading";
import {
  adminTechDrawDesignPath,
  adminTechDrawPipelineStatusPath,
  getAdminTechDrawJobs,
} from "@/api/adminTechDrawApi";
import { isTechDrawJobComplete } from "@/lib/techDraw/techDrawJobRoutes";
import styles from "./CadServiceRequestsTable.module.css";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "UPLOADING", label: "Uploading" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

const STATUS_COLORS = {
  COMPLETED: "#059669",
  FAILED: "#dc2626",
  PROCESSING: "#2563eb",
  UPLOADING: "#2563eb",
  PENDING: "#d97706",
};

function StatusBadge({ status }) {
  const normalized = String(status || "PENDING").toUpperCase();
  const color = STATUS_COLORS[normalized] || "#6b7280";

  return (
    <span
      className={styles.statusBadge}
      style={{
        color,
        backgroundColor: `${color}1a`,
        borderColor: `${color}59`,
      }}
    >
      <span className={styles.statusDot} style={{ backgroundColor: color }} />
      {normalized}
    </span>
  );
}

function jobTitle(job) {
  const t = String(job?.title || job?.file_name || "").trim();
  return t || "Technical drawing";
}

function TechDrawJobsTable() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusCounts, setStatusCounts] = useState({});
  const [totalCount, setTotalCount] = useState(0);

  const fetchJobs = async (page = 1, q = "", action = "all") => {
    setIsLoading(true);
    try {
      const respData = await getAdminTechDrawJobs({ page, limit, q, action });
      setJobs(respData.jobs || []);
      setTotalPages(respData.totalPages || 1);
      setStatusCounts(respData.statusCounts || {});
      setTotalCount(respData.total || 0);
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page);
      }
    } catch (error) {
      console.error("Error fetching TechDraw jobs:", error);
      setJobs([]);
      setTotalPages(1);
      toast.error("Failed to load TechDraw uploads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage, searchTerm, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const getFilterCount = (filterValue) => {
    if (filterValue === "all") return totalCount;
    return statusCounts[filterValue] || 0;
  };

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrap}>
          <h3 className={styles.sectionTitle}>User TechDraw uploads</h3>
          <span className={styles.sectionSubtitle}>{totalCount} jobs</span>
        </div>
      </div>

      <div className={styles.filtersRow}>
        <div className={`${styles.filterPills} ${styles.filterPillsDesktop}`}>
          {STATUS_OPTIONS.map((filter) => {
            const count = getFilterCount(filter.value);
            const label =
              filter.value === "all" ? filter.label : `${filter.label} (${count})`;
            return (
              <button
                key={filter.value}
                type="button"
                className={`${styles.filterPill} ${statusFilter === filter.value ? styles.filterPillActive : ""}`}
                onClick={() => handleFilterChange(filter.value)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className={styles.statusFilterRow}>
          <label className={styles.statusFilterLabel} htmlFor="techdraw-status-filter">
            Filter by status
          </label>
          <select
            id="techdraw-status-filter"
            className={styles.statusDropdown}
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            {STATUS_OPTIONS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
                {filter.value !== "all"
                  ? ` (${getFilterCount(filter.value)})`
                  : ` (${totalCount})`}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInputWrap}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search title, file, email, job id..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
          {searchTerm ? (
            <button type="button" onClick={handleClearSearch} className={styles.clearBtn}>
              Clear
            </button>
          ) : null}
        </form>
      </div>

      <div className={styles.desktopTable}>
        <div className={styles.tableScroll}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title / File</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Logs</th>
                  <th>Design</th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>
                      <Loading />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyCell}>
                        No TechDraw uploads found
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => {
                      const id = String(job._id || "");
                      const complete = isTechDrawJobComplete(job);
                      return (
                        <tr key={id}>
                          <td>
                            <div>{jobTitle(job)}</div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                              {id}
                            </div>
                          </td>
                          <td>
                            <div>{job.user_name || "—"}</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                              {job.user_email || "—"}
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={job.status} />
                          </td>
                          <td>{formatDate(job.createdAt)}</td>
                          <td>
                            <Link
                              href={adminTechDrawPipelineStatusPath(id)}
                              className={styles.viewBtn}
                              title="View pipeline logs"
                              aria-label="View pipeline logs"
                            >
                              <TerminalOutlinedIcon fontSize="small" />
                            </Link>
                          </td>
                          <td>
                            {complete ? (
                              <Link
                                href={adminTechDrawDesignPath(id)}
                                className={styles.viewBtn}
                                title="View design as user sees it"
                                aria-label="View design"
                              >
                                <VisibilityOutlinedIcon fontSize="small" />
                              </Link>
                            ) : (
                              <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      <div className={styles.mobileCards}>
        {isLoading ? (
          <div className={styles.mobileEmpty}>
            <Loading />
          </div>
        ) : jobs.length === 0 ? (
          <div className={styles.mobileEmpty}>No TechDraw uploads found</div>
        ) : (
          jobs.map((job) => {
            const id = String(job._id || "");
            const complete = isTechDrawJobComplete(job);
            return (
              <article key={id} className={styles.requestCard}>
                <div className={styles.requestCardHeader}>
                  <div>
                    <h4 className={styles.requestCardName}>{jobTitle(job)}</h4>
                    <p className={styles.requestCardEmail}>{job.user_email || "—"}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                <div className={styles.requestCardMeta}>
                  <div className={styles.requestCardField}>
                    <span className={styles.requestCardLabel}>User</span>
                    <span className={styles.requestCardValue}>{job.user_name || "—"}</span>
                  </div>
                  <div className={styles.requestCardField}>
                    <span className={styles.requestCardLabel}>Submitted</span>
                    <span className={styles.requestCardValue}>{formatDate(job.createdAt)}</span>
                  </div>
                </div>

                <div className={styles.requestCardActions} style={{ gap: 12 }}>
                  <Link href={adminTechDrawPipelineStatusPath(id)} className={styles.viewBtn}>
                    <TerminalOutlinedIcon fontSize="small" /> Logs
                  </Link>
                  {complete ? (
                    <Link href={adminTechDrawDesignPath(id)} className={styles.viewBtn}>
                      <VisibilityOutlinedIcon fontSize="small" /> Design
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>

      {totalPages > 1 ? (
        <div className={styles.paginationWrap}>
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </div>
  );
}

export default TechDrawJobsTable;
