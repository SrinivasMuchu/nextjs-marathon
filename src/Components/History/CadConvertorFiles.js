"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./FileHistory.module.css";
import { IMAGEURLS, toCadOutputCdnUrl } from "@/config";
import Image from "next/image";
import Loading from "../CommonJsx/Loaders/Loading";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import { SiConvertio } from "react-icons/si";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  buildConverterPricingDisplay,
  fetchConverterPricingInfo,
  CONVERTER_FREE_SIZE_LIMIT_BYTES,
} from "@/lib/converterPricing";
import { hasConverterCredits } from "@/lib/converterCredits";
import { cadConverterStatusPath } from "@/lib/cadConverterRoutes";
import CadComparisonPopup, { canViewComparison } from "./CadComparisonPopup";

function needsConverterCredit(converterPricing, inputFileSizeBytes) {
  if (converterPricing?.paid) return false;
  if (converterPricing?.is_free) return false;
  const size = Number(inputFileSizeBytes);
  return Number.isFinite(size) && size >= CONVERTER_FREE_SIZE_LIMIT_BYTES;
}

function downloadButtonLabel({
  downloading,
  converterPricing,
  inputFileSizeBytes,
  converterCredits,
}) {
  if (downloading) return "Downloading...";
  if (!needsConverterCredit(converterPricing, inputFileSizeBytes)) return "Download";
  if (hasConverterCredits(converterCredits)) return "Download";
  return "Download · 1 credit";
}

function formatFileSize(bytes) {
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

function formatTime(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "";
  if (n < 60) return `${parseFloat(n.toFixed(2))} sec`;
  if (n < 3600) return `${parseFloat((n / 60).toFixed(2))} min`;
  return `${parseFloat((n / 3600).toFixed(2))} hr`;
}

function formatChipLabel(value) {
  const label = String(value || "")
    .replace(/^\./, "")
    .trim();
  return label ? label.toUpperCase() : "CAD";
}

function formatDotLabel(value) {
  return `.${formatChipLabel(value)}`;
}

function summarizeChecks(checks) {
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

function CadConvertorFiles({
  loading,
  cadConverterFileHistory,
  downloading,
  downloadingReport,
  handleDownload,
  handleReportDownload,
  searchTerm,
  setSearchTerm,
  converterCredits = 0,
}) {
  const router = useRouter();
  const [pricingNoteTotal, setPricingNoteTotal] = useState("");
  const [comparisonFile, setComparisonFile] = useState(null);
  const [comparisonIndex, setComparisonIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const info = await fetchConverterPricingInfo();
        if (cancelled) return;
        const display = buildConverterPricingDisplay(info?.pricing);
        setPricingNoteTotal(display.totalLabel);
      } catch {
        if (!cancelled) setPricingNoteTotal("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const files = useMemo(
    () => (Array.isArray(cadConverterFileHistory) ? cadConverterFileHistory : []),
    [cadConverterFileHistory],
  );

  return (
    <div className={styles.cadViewerContainerContent}>
      <div className={styles.filesToolbar}>
        <label className={styles.filesSearch}>
          <Search size={16} className={styles.filesSearchIcon} />
          <input
            type="text"
            placeholder="Search project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <Link href="/tools/3d-cad-file-converter" className={styles.filesActionBtn}>
          <SiConvertio style={{ fontSize: "16px" }} />
          Convert file
        </Link>
      </div>

      {loading ? (
        <Loading smallScreen={true} />
      ) : (
        <>
          {files.length > 0 ? (
            <>
            <div className={styles.historyContainer}>
              {files.map((file, index) => {
                      const canView = canViewComparison(file);
                      const completed = file.status === "COMPLETED";
                      const failed =
                        String(file.status || "").toUpperCase() === "FAILED" ||
                        String(file.status || "").toUpperCase() === "ERROR";
                      const hasPdf = Boolean(completed && file.report_pdf_url);
                      const inputFmt = formatChipLabel(file.input_format);
                      const outputFmt = formatChipLabel(file.output_format);
                      const { passed, total } = summarizeChecks(file.quality_checks);
                      const verdict = String(file.quality_verdict || "").toLowerCase();
                      const checksOk =
                        (total > 0 && passed === total) || verdict === "pass";
                      const timeLabel = formatTime(file.time_taken_seconds);
                      const sizes = pickSizes(file);
                      const sizeLabel =
                        sizes.srcSize && sizes.outSize
                          ? `${sizes.srcSize} → ${sizes.outSize}`
                          : sizes.srcSize || sizes.outSize || "";
                      const inputPreview = snapshotUrl(file.input_snapshot_url);
                      const outputPreview = snapshotUrl(file.output_snapshot_url);
                      const statusLabel = completed
                        ? "Completed"
                        : failed
                          ? "Failed"
                          : "Converting";

                      return (
                        <article
                          key={file._id || index}
                          className={styles.compareCard}
                          role={!completed && file._id ? "link" : undefined}
                          tabIndex={!completed && file._id ? 0 : undefined}
                          onClick={() => {
                            if (!completed && file._id) {
                              router.push(cadConverterStatusPath(file._id));
                            }
                          }}
                          onKeyDown={(event) => {
                            if (
                              !completed &&
                              file._id &&
                              (event.key === "Enter" || event.key === " ")
                            ) {
                              event.preventDefault();
                              router.push(cadConverterStatusPath(file._id));
                            }
                          }}
                          style={
                            !completed && file._id ? { cursor: "pointer" } : undefined
                          }
                        >
                          <header className={styles.compareCardHeader}>
                            <div className={styles.compareCardHeaderLeft}>
                              <span className={styles.compareBrandIcon} aria-hidden>
                                <CompareArrowsIcon sx={{ fontSize: 16 }} />
                              </span>
                              <div className={styles.compareCardTitles}>
                                <h3
                                  className={styles.compareCardTitle}
                                  title={file.file_name}
                                >
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
                              <p
                                className={
                                  checksOk
                                    ? styles.compareChecksOk
                                    : styles.compareChecksWarn
                                }
                              >
                                <CheckCircleIcon sx={{ fontSize: 14 }} />
                                {checksOk ? "Passed" : "Checks"} {passed}/{total}
                              </p>
                            ) : (
                              <p
                                className={
                                  completed
                                    ? styles.compareChecksOk
                                    : styles.compareChecksWarn
                                }
                              >
                                <CheckCircleIcon sx={{ fontSize: 14 }} />
                                {completed
                                  ? "Complete"
                                  : failed
                                    ? "Failed"
                                    : "In progress"}
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

                          <div
                            className={styles.compareActions}
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                          >
                            {hasPdf ? (
                              <button
                                type="button"
                                className={styles.comparePdfBtn}
                                onClick={() => handleReportDownload(file, index)}
                                disabled={Boolean(downloadingReport?.[index])}
                                title="Download quality report PDF (free)"
                              >
                                <PictureAsPdfIcon style={{ fontSize: 16 }} />
                                {downloadingReport?.[index] ? "PDF…" : "PDF"}
                              </button>
                            ) : (
                              <span className={styles.compareActionSlot} aria-hidden />
                            )}
                            {canView ? (
                              <button
                                type="button"
                                className={styles.compareViewBtn}
                                onClick={() => {
                                  setComparisonFile(file);
                                  setComparisonIndex(index);
                                }}
                                title="View CAD comparison"
                              >
                                <VisibilityIcon style={{ fontSize: 16 }} />
                                Compare
                              </button>
                            ) : (
                              <span className={styles.compareActionSlot} aria-hidden />
                            )}
                            <button
                              type="button"
                              className={styles.compareDownloadBtn}
                              onClick={() => {
                                if (!completed) {
                                  if (file._id) {
                                    router.push(cadConverterStatusPath(file._id));
                                  }
                                  return;
                                }
                                handleDownload(file, index);
                              }}
                              disabled={completed ? Boolean(downloading[index]) : !file._id}
                            >
                              {completed
                                ? downloadButtonLabel({
                                    downloading: downloading[index],
                                    converterPricing: file.converter_pricing,
                                    inputFileSizeBytes: file.input_file_size_bytes,
                                    converterCredits,
                                  })
                                : "Status"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
            </div>
            <p className={styles.converterPricingFootnote}>
              <span aria-hidden>ℹ️</span>
              Files under 5 MB download free. Files 5 MB and above are{" "}
              {pricingNoteTotal || "a small fee"} per conversion. Quality report PDFs are
              free.
            </p>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "300px",
                textAlign: "center",
                gap: "40px",
              }}
            >
              <Image
                src={IMAGEURLS.nofilesLogo}
                alt="No files"
                width={135}
                height={135}
              />
              <span>
                You don&apos;t have any projects yet.
                <br />
                <Link href="/tools/3d-cad-file-converter" style={{ color: "blue" }}>
                  Upload
                </Link>{" "}
                your project files
              </span>
            </div>
          )}
        </>
      )}

      {comparisonFile && canViewComparison(comparisonFile) && (
        <CadComparisonPopup
          file={comparisonFile}
          onClose={() => {
            setComparisonFile(null);
            setComparisonIndex(null);
          }}
          onDownloadPdf={() => handleReportDownload(comparisonFile, comparisonIndex)}
          onDownload={() => handleDownload(comparisonFile, comparisonIndex)}
          downloadingReport={Boolean(downloadingReport?.[comparisonIndex])}
          downloading={Boolean(downloading?.[comparisonIndex])}
          converterCredits={converterCredits}
        />
      )}
    </div>
  );
}

export default CadConvertorFiles;
