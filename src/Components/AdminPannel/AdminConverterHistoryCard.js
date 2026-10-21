"use client";

import React, { useState } from "react";
import styles from "../History/FileHistory.module.css";
import { toCadOutputCdnUrl } from "@/config";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";

export function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function formatMb(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `${n.toFixed(2)} MB`;
}

export function formatTime(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "";
  if (n < 60) return `${parseFloat(n.toFixed(2))} sec`;
  if (n < 3600) return `${parseFloat((n / 60).toFixed(2))} min`;
  return `${parseFloat((n / 3600).toFixed(2))} hr`;
}

export function formatChipLabel(value) {
  const label = String(value || "")
    .replace(/^\./, "")
    .trim();
  return label ? label.toUpperCase() : "CAD";
}

function formatDotLabel(value) {
  return `.${formatChipLabel(value)}`;
}

export function summarizeChecks(checks) {
  if (!checks || typeof checks !== "object") return { passed: 0, total: 0 };
  const entries = Object.values(checks).filter((outcome) => {
    const o = String(outcome || "").toLowerCase();
    return o && o !== "na" && o !== "n/a";
  });
  const total = entries.length;
  const passed = entries.filter(
    (outcome) => String(outcome).toLowerCase() === "pass",
  ).length;
  return { passed, total };
}

export function conversionRouteLabel(file) {
  const from = String(file?.input_format || "").replace(/^\./, "").trim();
  const to = String(file?.output_format || "").replace(/^\./, "").trim();
  if (!from && !to) return "";
  return `${(from || "—").toUpperCase()} → ${(to || "—").toUpperCase()}`;
}

function pickSizes(file) {
  const stl = file?.quality_stl || {};
  const srcMesh = file?.quality_src_mesh || {};
  const outMesh = file?.quality_out_mesh || {};
  const srcSolid = file?.quality_src_solid || {};
  const outSolid = file?.quality_out_solid || {};
  const step = file?.quality_step_stats || {};
  const inFmt = String(file?.input_format || "").toLowerCase();
  const outFmt = String(file?.output_format || "").toLowerCase();
  const meshIn = ["stl", "obj", "ply", "off"].includes(inFmt);
  const meshOut = ["stl", "obj", "ply", "off"].includes(outFmt);

  let src = {};
  let out = {};
  if (meshIn && !meshOut) {
    src = { ...stl, ...srcMesh };
    out = { ...step, ...outSolid };
  } else if (!meshIn && meshOut) {
    src = { ...srcSolid, ...step };
    out = { ...outMesh, ...stl };
  } else if (meshIn && meshOut) {
    src = { ...srcMesh };
    out = { ...outMesh };
  } else {
    src = { ...srcSolid, ...step };
    out = { ...outSolid, ...step };
  }

  return {
    srcSize: formatMb(src.size_mb) || formatFileSize(file?.input_file_size_bytes),
    outSize: formatMb(out.size_mb),
  };
}

function snapshotUrl(raw) {
  if (!raw) return "";
  return toCadOutputCdnUrl(raw) || raw;
}

function PreviewPane({ label, format, src }) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;

  return (
    <div className={styles.comparePane}>
      <span className={styles.comparePaneTag}>{label}</span>
      <div className={styles.comparePaneMedia}>
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`${format} preview`}
            className={styles.comparePaneImg}
            onError={() => setBroken(true)}
          />
        ) : (
          <div className={styles.comparePlaceholder}>
            <BrokenImageOutlinedIcon className={styles.comparePlaceholderIcon} />
            <strong className={styles.comparePlaceholderFormat}>
              {formatDotLabel(format)}
            </strong>
            <span className={styles.comparePlaceholderRule} aria-hidden />
            <span className={styles.comparePlaceholderHint}>No preview available</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ConverterHistoryCard({ file, onOpenStatus, children }) {
  const completed = file.status === "COMPLETED";
  const failed =
    String(file.status || "").toUpperCase() === "FAILED" ||
    String(file.status || "").toUpperCase() === "ERROR";
  const inputFmt = formatChipLabel(file.input_format);
  const outputFmt = formatChipLabel(file.output_format);
  const { passed, total } = summarizeChecks(file.quality_checks);
  const verdict = String(file.quality_verdict || "").toLowerCase();
  const checksOk = (total > 0 && passed === total) || verdict === "pass";
  const timeLabel = formatTime(file.time_taken_seconds);
  const sizes = pickSizes(file);
  const sizeLabel =
    sizes.srcSize && sizes.outSize
      ? `${sizes.srcSize} → ${sizes.outSize}`
      : sizes.srcSize || sizes.outSize || "";
  const inputPreview = snapshotUrl(file.input_snapshot_url);
  const outputPreview = snapshotUrl(file.output_snapshot_url);
  const statusLabel = completed ? "Completed" : failed ? "Failed" : "Converting";
  const clickable = Boolean(onOpenStatus) && !completed && file._id;

  return (
    <article
      className={styles.compareCard}
      role={clickable ? "link" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={() => {
        if (clickable) onOpenStatus();
      }}
      onKeyDown={(event) => {
        if (clickable && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpenStatus();
        }
      }}
      style={clickable ? { cursor: "pointer" } : undefined}
    >
      <header className={styles.compareCardHeader}>
        <div className={styles.compareCardHeaderLeft}>
          <span className={styles.compareBrandIcon} aria-hidden>
            <CompareArrowsIcon sx={{ fontSize: 16 }} />
          </span>
          <div className={styles.compareCardTitles}>
            <h3 className={styles.compareCardTitle} title={file.file_name}>
              {file.file_name || "CAD Comparison"}
            </h3>
            <p className={styles.compareCardSubtitle}>
              {inputFmt} → {outputFmt}
            </p>
          </div>
        </div>
        <span
          className={
            completed
              ? styles.compareStatusDone
              : failed
                ? styles.compareStatusFailed
                : styles.compareStatusBusy
          }
        >
          {completed ? (
            <CheckCircleIcon sx={{ fontSize: 13 }} />
          ) : (
            <span className={styles.compareStatusDot} aria-hidden />
          )}
          {statusLabel}
        </span>
      </header>

      <div className={styles.comparePreviewRow}>
        <PreviewPane
          label={`${inputFmt} (Original)`}
          format={inputFmt}
          src={inputPreview}
        />
        <span className={styles.compareSwap} aria-hidden>
          <CompareArrowsIcon sx={{ fontSize: 14 }} />
        </span>
        <PreviewPane
          label={`${outputFmt} (Converted)`}
          format={outputFmt}
          src={outputPreview}
        />
      </div>

      <div className={styles.compareStatusLines}>
        <p className={styles.compareConversionLine}>
          <AutoAwesomeIcon sx={{ fontSize: 14 }} />
          {inputFmt} → {outputFmt}
        </p>
        {total > 0 ? (
          <p className={checksOk ? styles.compareChecksOk : styles.compareChecksWarn}>
            <CheckCircleIcon sx={{ fontSize: 14 }} />
            {checksOk ? "Passed" : "Checks"} {passed}/{total}
          </p>
        ) : (
          <p className={completed ? styles.compareChecksOk : styles.compareChecksWarn}>
            <CheckCircleIcon sx={{ fontSize: 14 }} />
            {completed ? "Complete" : failed ? "Failed" : "In progress"}
          </p>
        )}
      </div>

      <div className={styles.compareMetrics}>
        <span title={timeLabel || undefined}>
          <ScheduleOutlinedIcon sx={{ fontSize: 14 }} />
          {timeLabel || "—"}
        </span>
        <span title={sizeLabel || undefined}>
          <StorageOutlinedIcon sx={{ fontSize: 14 }} />
          {sizeLabel || formatFileSize(file.input_file_size_bytes) || "—"}
        </span>
        <span>
          <VerifiedUserOutlinedIcon sx={{ fontSize: 14 }} />
          {checksOk || completed ? "OK" : failed ? "Fail" : "…"}
        </span>
      </div>

      {children ? (
        <div
          className={styles.compareActions}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      ) : null}
    </article>
  );
}

export default ConverterHistoryCard;
