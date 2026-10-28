"use client";
import React, { useMemo, useState } from "react";
import { IMAGEURLS, toCadOutputCdnUrl } from "@/config";
import Image from "next/image";
import Loading from "../CommonJsx/Loaders/Loading";
import Link from "next/link";
import { Box, Download, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { cadConverterStatusPath } from "@/lib/cadConverterRoutes";
import CadComparisonPopup, { canViewComparison } from "./CadComparisonPopup";
import styles from "./ConverterList.module.css";

function downloadButtonLabel({ downloading, outputFmt }) {
  if (downloading) return "Downloading...";
  return `Download ${outputFmt}`;
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

function formatChipLabel(value) {
  const label = String(value || "")
    .replace(/^\./, "")
    .trim();
  return label ? label.toUpperCase() : "CAD";
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

function convertedName(file) {
  const original = file?.file_name || "converted-file";
  const dot = original.lastIndexOf(".");
  const base = dot > 0 ? original.slice(0, dot) : original;
  const ext = String(file?.output_format || "cad").replace(/^\./, "").toLowerCase();
  return `${base}.${ext}`;
}

function tidyName(name) {
  const raw = String(name || "").trim() || "CAD file";
  const stripped = raw
    .replace(/_converter_upload_\d+.*$/i, "")
    .replace(/_viewer_upload_\d+.*$/i, "");
  const dot = stripped.lastIndexOf(".");
  const base = dot > 0 ? stripped.slice(0, dot) : stripped;
  const ext = dot > 0 ? stripped.slice(dot) : "";
  if (/^[0-9a-f]{16,}$/i.test(base)) {
    return `${base.slice(0, 8)}…${base.slice(-4)}${ext}`;
  }
  return stripped;
}

function formatShortDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function glyphClass(format) {
  const key = String(format || "").toLowerCase();
  if (key === "stl" || key === "obj") return styles.glyphStl;
  if (key === "iges" || key === "igs") return styles.glyphIges;
  return "";
}

function badgeClass(format) {
  const key = String(format || "").toLowerCase();
  if (key === "stl" || key === "obj") return styles.badgeStl;
  if (key === "iges" || key === "igs") return styles.badgeIges;
  return "";
}

function snapshotUrl(raw) {
  if (!raw) return "";
  return toCadOutputCdnUrl(raw) || raw;
}

function FileThumb({ format, src, alt }) {
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return (
      <span className={styles.thumb}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} onError={() => setBroken(true)} />
      </span>
    );
  }
  return <span className={`${styles.glyph} ${glyphClass(format)}`} aria-hidden />;
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
  const [comparisonFile, setComparisonFile] = useState(null);
  const [comparisonIndex, setComparisonIndex] = useState(null);

  const files = useMemo(
    () => (Array.isArray(cadConverterFileHistory) ? cadConverterFileHistory : []),
    [cadConverterFileHistory],
  );

  const visible = useMemo(
    () => files.map((file, index) => ({ file, index })),
    [files],
  );

  const openFile = (file, index) => {
    if (canViewComparison(file)) {
      setComparisonFile(file);
      setComparisonIndex(index);
      return;
    }
    if (file?._id) router.push(cadConverterStatusPath(file._id));
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <h2>My conversions</h2>
          <p>Original and converted files stay together. Download either one at any time.</p>
        </div>
        <div className={styles.tools}>
          <label className={styles.search}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search conversions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search conversions"
            />
          </label>
        </div>
      </div>

      {loading ? (
        <Loading smallScreen={true} />
      ) : visible.length > 0 ? (
        <div className={styles.table}>
          <div className={styles.cols}>
            <span>Original file</span>
            <span className={styles.arrowHead} aria-hidden />
            <span>Converted file</span>
            <span>Status / date</span>
            <span>Actions</span>
          </div>
          {visible.map(({ file, index }) => {
            const canView = canViewComparison(file);
            const completed = String(file.status || "").toUpperCase() === "COMPLETED";
            const failed =
              String(file.status || "").toUpperCase() === "FAILED" ||
              String(file.status || "").toUpperCase() === "ERROR";
            const inputFmt = formatChipLabel(file.input_format);
            const outputFmt = formatChipLabel(file.output_format);
            const sizes = pickSizes(file);
            const statusLabel = completed ? "Completed" : failed ? "Failed" : "Converting";
            const dateLabel = formatShortDate(file.createdAt) || file.createdAtFormatted || "";
            const originalLabel = tidyName(file.file_name || "CAD file");
            const outputLabel = tidyName(convertedName(file));

            return (
              <div
                key={file._id || index}
                className={styles.row}
                role="link"
                tabIndex={0}
                onClick={() => openFile(file, index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openFile(file, index);
                  }
                }}
              >
                <div className={styles.file}>
                  <FileThumb
                    format={inputFmt}
                    src={snapshotUrl(file.input_snapshot_url)}
                    alt={`${file.file_name || inputFmt} preview`}
                  />
                  <div className={styles.fileText}>
                    <strong title={file.file_name || originalLabel}>{originalLabel}</strong>
                    <div className={styles.meta}>
                      <span className={`${styles.badge} ${badgeClass(inputFmt)}`}>{inputFmt}</span>
                      {sizes.srcSize ? <span>{sizes.srcSize}</span> : null}
                    </div>
                  </div>
                </div>

                <span className={styles.arrow} aria-hidden>→</span>
                <div className={styles.file}>
                  <FileThumb
                    format={outputFmt}
                    src={snapshotUrl(file.output_snapshot_url)}
                    alt={`${convertedName(file)} preview`}
                  />
                  <div className={styles.fileText}>
                    <strong title={convertedName(file)}>{outputLabel}</strong>
                    <div className={styles.meta}>
                      <span className={`${styles.badge} ${badgeClass(outputFmt)}`}>{outputFmt}</span>
                      {sizes.outSize ? <span>{sizes.outSize}</span> : null}
                    </div>
                  </div>
                </div>

                <div className={styles.status}>
                  <span
                    className={`${styles.pill} ${
                      completed ? styles.pillDone : failed ? styles.pillFailed : styles.pillBusy
                    }`}
                  >
                    <i />
                    {statusLabel}
                  </span>
                  {dateLabel ? <span className={styles.date}>{dateLabel}</span> : null}
                </div>

                <div
                  className={styles.actions}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className={styles.download}
                    onClick={() => {
                      if (!completed) {
                        if (file._id) router.push(cadConverterStatusPath(file._id));
                        return;
                      }
                      handleDownload(file, index);
                    }}
                    disabled={completed ? Boolean(downloading[index]) : !file._id}
                  >
                    <Download size={16} />
                    {completed
                      ? downloadButtonLabel({
                          downloading: downloading[index],
                          outputFmt,
                        })
                      : "View status"}
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    aria-label={canView ? "View comparison" : "View result"}
                    onClick={() => openFile(file, index)}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <Image src={IMAGEURLS.nofilesLogo} alt="" width={120} height={120} />
          <span>
            You don&apos;t have any conversions yet.
            <br />
            <Link href="/tools/3d-cad-file-converter">Convert a file</Link>
          </span>
        </div>
      )}

      {!loading && visible.length > 0 ? (
        <div className={styles.foot}>
          <span>
            {visible.length} conversion{visible.length === 1 ? "" : "s"} shown · Select a file to view its comparison and report.
          </span>
          <Link href="/dashboard?cad_type=USER_DOWNLOADS">
            Looking for ready-made CAD designs? Explore downloads →
          </Link>
        </div>
      ) : null}

      <div className={styles.banner}>
        <div className={styles.bannerMain}>
          <span className={styles.bannerIcon} aria-hidden>
            <Box size={18} />
          </span>
          <div>
            <strong>Need a ready-made CAD design instead?</strong>
            <p>Explore free and premium STEP, STL and DXF models in Design Downloads.</p>
          </div>
        </div>
        <Link href="/library">Explore designs →</Link>
      </div>

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
