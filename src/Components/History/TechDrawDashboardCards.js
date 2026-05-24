"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoAddSharp } from "react-icons/io5";
import axios from "axios";
import { BASE_URL } from "@/config";
import Loading from "../CommonJsx/Loaders/Loading";
import FallbackImageClient from "../CommonJsx/FallbackImageClient";
import Pagenation from "../CommonJsx/Pagenation";
import FileStatus from "../CommonJsx/FileStatus";
import TechDrawBillingBadge from "../CommonJsx/TechDrawBillingBadge";
import { textLettersLimit } from "@/common.helper";
import { getOrCreateTechDrawUuid } from "@/api/cadDrawingPipelineApi";
import { techDrawJobHref } from "@/lib/techDraw/techDrawJobRoutes";
import styles from "./FileHistory.module.css";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function jobTitle(job) {
  const t = String(job?.title || job?.file_name || "").trim();
  return t || "Technical drawing";
}

function normalizeFileStatus(status) {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return "completed";
  if (s === "FAILED") return "failed";
  if (["PROCESSING", "UPLOADING", "RUNNING", "QUEUED"].includes(s)) return "processing";
  if (s === "PENDING") return "pending";
  return "pending";
}

function previewSrc(job) {
  const id = String(job?._id || "");
  if (!id || !job?.output_s3_prefix) return "";
  return `/api/techdraw-file?designId=${encodeURIComponent(id)}&source=user&sheet=1&ext=svg`;
}

export default function TechDrawDashboardCards({
  currentPage,
  setCurrentPage,
  totalPages,
  setTotalPages,
}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 12;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch) setCurrentPage(1);
  }, [debouncedSearch, setCurrentPage]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/v1/cad/get-file-history`, {
          params: {
            type: "CAD_TECHDRAW",
            page: currentPage,
            limit,
            search: debouncedSearch,
          },
          headers: { "user-uuid": getOrCreateTechDrawUuid() },
        });

        if (cancelled) return;

        if (response.data?.meta?.success) {
          const rows = Array.isArray(response.data.data?.techdraw_files)
            ? response.data.data.techdraw_files
            : [];
          const pagination = response.data.data?.pagination || {};
          const pages = Number(pagination.cadFilesPages || 1);

          setJobs(rows);
          setTotalPages(Math.max(1, pages));
        } else {
          setJobs([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("TechDraw dashboard list:", err);
        if (!cancelled) {
          setJobs([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentPage, debouncedSearch, setTotalPages]);

  return (
    <div className={styles.cadViewerContainerContent}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6c757d"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search 2D drawing"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <Link
          href="/tools/cad-drawing-pipeline"
          style={{
            borderRadius: "8px",
            border: "2px solid #610BEE",
            background: "white",
            color: "#610BEE",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#610BEE";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "#610BEE";
          }}
        >
          <IoAddSharp /> New file
        </Link>
      </div>

      {loading ? (
        <Loading smallScreen={true} />
      ) : jobs.length === 0 ? (
        <div
          style={{
            width: "100%",
            padding: 48,
            textAlign: "center",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: "0 0 12px", color: "#374151" }}>
            No 2D drawing jobs yet.
          </p>
          <Link href="/tools/cad-drawing-pipeline" style={{ color: "#610bee", fontWeight: 600 }}>
            Upload a STEP file to start
          </Link>
        </div>
      ) : (
        <div className={styles.historyContainer}>
          {jobs.map((job) => {
            const id = String(job._id || "");
            const href = techDrawJobHref(job);
            const title = jobTitle(job);
            const src = previewSrc(job);
            const status = String(job.status || "").toUpperCase();
            const isCompleted = status === "COMPLETED";

            return (
              <Link
                key={id}
                href={href}
                className={styles.historyItem}
                style={{ width: "310px", position: "relative" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    alignItems: "flex-start",
                  }}
                >
                  <FileStatus status={normalizeFileStatus(job.status)} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,
                  }}
                >
                  <TechDrawBillingBadge billingType={job.billing_type} />
                </div>

                {isCompleted && src ? (
                  <div
                    style={{
                      width: "100%",
                      height: 160,
                      background: "#f3f4f6",
                      borderRadius: 4,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FallbackImageClient
                      src={src}
                      alt={`${title} preview`}
                      className={styles.historyItemPreviewImg}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 160,
                      background: "#e6e4f0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 4,
                      color: "#6b7280",
                      fontSize: 13,
                    }}
                  >
                    {isCompleted ? "2D Preview" : null}
                  </div>
                )}

                <div className={styles.historyFileDetails}>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {textLettersLimit(title, 20)}
                  </span>
                </div>

                <div className={styles.historyFileDetails}>
                  <span
                    style={{
                      color: "rgba(0, 19, 37, 0.50)",
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    {formatDate(job.createdAt)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
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
