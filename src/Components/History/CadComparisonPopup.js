"use client";

import React, { useMemo, useState } from "react";
import PopupWrapper from "../CommonJsx/PopupWrapper";
import { toCadOutputCdnUrl } from "@/config";
import {
  buildConverterPricingDisplay,
  CONVERTER_FREE_SIZE_LIMIT_BYTES,
} from "@/lib/converterPricing";
import { hasConverterCredits } from "@/lib/converterCredits";
import styles from "./CadComparisonPopup.module.css";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import DataObjectOutlinedIcon from "@mui/icons-material/DataObjectOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

const DRAWING_FORMATS = new Set(["dwg", "dxf"]);

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function formatMb(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${n.toFixed(2)} MB`;
}

function formatTime(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }
  const n = Number(value);
  if (n < 60) return `${parseFloat(n.toFixed(2))} sec`;
  if (n < 3600) return `${parseFloat((n / 60).toFixed(2))} min`;
  return `${parseFloat((n / 3600).toFixed(2))} hr`;
}

function formatCreatedOn(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCount(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n.toLocaleString("en-US");
}

function stemName(fileName, fallback = "part") {
  if (!fileName) return fallback;
  const i = fileName.lastIndexOf(".");
  return i > 0 ? fileName.slice(0, i) : fileName;
}

function isDrawingConversion(file) {
  const inFmt = String(file?.input_format || "").toLowerCase();
  const outFmt = String(file?.output_format || "").toLowerCase();
  if (DRAWING_FORMATS.has(inFmt) && DRAWING_FORMATS.has(outFmt)) return true;
  return Boolean(
    file?.quality_src_drawing?.readable || file?.quality_out_drawing?.readable,
  );
}

function entityMixTotal(entities) {
  if (!entities || typeof entities !== "object") return null;
  const sum = Object.values(entities).reduce((acc, n) => acc + Number(n || 0), 0);
  return Number.isFinite(sum) && sum > 0 ? sum : null;
}

function formatExtents(bbox) {
  if (!Array.isArray(bbox) || bbox.length !== 4) return null;
  const [x0, y0, x1, y1] = bbox.map(Number);
  if (![x0, y0, x1, y1].every(Number.isFinite)) return null;
  return `${x0.toFixed(1)}, ${y0.toFixed(1)} → ${x1.toFixed(1)}, ${y1.toFixed(1)}`;
}

function yesNoMatch(flag, srcN, outN) {
  if (typeof flag === "boolean") {
    if (srcN != null && outN != null) {
      return flag ? `Yes (${formatCount(srcN)} → ${formatCount(outN)})` : `No (${formatCount(srcN)} → ${formatCount(outN)})`;
    }
    return flag ? "Yes" : "No";
  }
  if (srcN != null && outN != null) {
    return Number(srcN) === Number(outN) && Number(srcN) > 0
      ? `Yes (${formatCount(srcN)} → ${formatCount(outN)})`
      : `No (${formatCount(srcN)} → ${formatCount(outN)})`;
  }
  return null;
}

function pickDrawingStats(file) {
  const src = file?.quality_src_drawing || {};
  const out = file?.quality_out_drawing || {};
  const srcDrawable =
    file?.quality_src_drawable_count ?? src.drawable ?? null;
  const outDrawable =
    file?.quality_out_drawable_count ?? out.drawable ?? null;
  const srcLayers = src.layers ?? null;
  const outLayers = out.layers ?? null;

  return {
    kind: "drawing",
    srcSize: formatMb(src.size_mb) || formatFileSize(file?.input_file_size_bytes),
    outSize: formatMb(out.size_mb),
    srcDrawable: formatCount(srcDrawable),
    outDrawable: formatCount(outDrawable),
    srcLayers: formatCount(srcLayers),
    outLayers: formatCount(outLayers),
    srcEntities: formatCount(entityMixTotal(src.entities)),
    outEntities: formatCount(entityMixTotal(out.entities)),
    entityMatch: yesNoMatch(
      file?.quality_entities_match,
      srcDrawable,
      outDrawable,
    ),
    layerMatch: yesNoMatch(file?.quality_layers_match, srcLayers, outLayers),
    extents:
      file?.quality_bbox_err_pct != null
        ? `${Number(file.quality_bbox_err_pct).toFixed(2)} %`
        : formatExtents(out.bbox) || formatExtents(src.bbox),
    srcAcad: src.acadver || null,
    outAcad: out.acadver || null,
  };
}

function pickSolidStats(file) {
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
    kind: "solid",
    srcSize: formatMb(src.size_mb) || formatFileSize(file?.input_file_size_bytes),
    outSize: formatMb(out.size_mb),
    srcVerts: formatCount(src.verts),
    outVerts: formatCount(out.verts),
    srcFaces: formatCount(src.faces || src.tris),
    outFaces: formatCount(out.faces || out.tris),
  };
}

const CHECK_GROUPS_3D = [
  { key: "source", label: "Geometry Check", test: (id) => id.startsWith("src_") },
  { key: "output", label: "Mesh Quality", test: (id) => id.startsWith("out_") },
  { key: "accuracy", label: "Dimension Check", test: (id) => id.startsWith("acc_") },
  { key: "watertight", label: "Watertight Check", test: (id) => /watertight|closed/i.test(id) },
  { key: "normals", label: "Normal Consistency", test: (id) => /uniform|degenerat|normal/i.test(id) },
  { key: "errors", label: "Error Check", test: (id) => /readable|created|extra|missing/i.test(id) },
];

const CHECK_GROUPS_DRAWING = [
  { key: "source", label: "Source Drawing", test: (id) => id.startsWith("src_") },
  { key: "output", label: "Output Drawing", test: (id) => id.startsWith("out_") },
  {
    key: "entity",
    label: "Entity Match",
    test: (id) => /entities_match/i.test(id),
  },
  {
    key: "layers",
    label: "Layer Match",
    test: (id) => /layers_match/i.test(id),
  },
  {
    key: "extents",
    label: "Extents Check",
    test: (id) => /bbox|extent/i.test(id),
  },
];

function groupChecks(checks, isDrawing) {
  if (!checks || typeof checks !== "object") return [];

  const entries = Object.entries(checks).filter(([, outcome]) => {
    const o = String(outcome || "").toLowerCase();
    return o && o !== "na" && o !== "n/a";
  });
  if (!entries.length) return [];

  const used = new Set();
  const groups = [];
  const defs = isDrawing ? CHECK_GROUPS_DRAWING : CHECK_GROUPS_3D;

  for (const group of defs) {
    const subset = entries.filter(([id]) => !used.has(id) && group.test(id));
    if (!subset.length) continue;
    subset.forEach(([id]) => used.add(id));
    const passed = subset.filter(
      ([, outcome]) => String(outcome).toLowerCase() === "pass",
    ).length;
    groups.push({
      label: group.label,
      passed,
      total: subset.length,
      ok: passed === subset.length,
    });
  }

  const leftover = entries.filter(([id]) => !used.has(id));
  if (leftover.length) {
    const passed = leftover.filter(
      ([, outcome]) => String(outcome).toLowerCase() === "pass",
    ).length;
    groups.push({
      label: isDrawing ? "Drawing Checks" : "Other Checks",
      passed,
      total: leftover.length,
      ok: passed === leftover.length,
    });
  }

  return groups;
}

function summarizeChecks(checks) {
  if (!checks || typeof checks !== "object") {
    return { passed: 0, total: 0 };
  }
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

function priceBadge(file) {
  const pricing = file?.converter_pricing;
  if (!pricing) return null;
  if (pricing.paid) return "Paid";
  if (pricing.is_free) return "Free";
  const size = Number(file?.input_file_size_bytes);
  if (Number.isFinite(size) && size < CONVERTER_FREE_SIZE_LIMIT_BYTES) {
    return "Free";
  }
  return buildConverterPricingDisplay(pricing).totalLabel;
}

function comparisonDownloadLabel(file, downloading, converterCredits) {
  if (downloading) return "Downloading…";
  const outputFmt = String(file?.output_format || "file").toUpperCase();
  const pricing = file?.converter_pricing;
  if (pricing?.paid || pricing?.is_free) return `Download ${outputFmt}`;
  const size = Number(file?.input_file_size_bytes);
  const isFree =
    Number.isFinite(size) && size > 0 && size < CONVERTER_FREE_SIZE_LIMIT_BYTES;
  if (isFree || !Number.isFinite(size) || size <= 0) return `Download ${outputFmt}`;
  if (hasConverterCredits(converterCredits)) return `Download ${outputFmt}`;
  return "Download · 1 credit";
}

export function hasComparisonPhotos(file) {
  return Boolean(file?.input_snapshot_url || file?.output_snapshot_url);
}

/** Show View popup when a quality report/summary exists (photos optional). */
export function canViewComparison(file) {
  if (file?.status !== "COMPLETED") return false;
  const checks = file?.quality_checks;
  const hasChecks =
    checks && typeof checks === "object" && Object.keys(checks).length > 0;
  return Boolean(
    file?.report_pdf_url ||
      file?.report_html_url ||
      file?.quality_verdict ||
      hasChecks ||
      hasComparisonPhotos(file),
  );
}

function AttrRow({ icon: Icon, label, value, ok }) {
  return (
    <div className={styles.attrRow}>
      <span className={styles.attrLabel}>
        <Icon sx={{ fontSize: 18 }} />
        {label}
      </span>
      <span className={`${styles.attrValue} ${ok ? styles.attrOk : ""}`}>
        {ok ? <CheckCircleIcon sx={{ fontSize: 16, color: "#16a34a" }} /> : null}
        {value}
      </span>
    </div>
  );
}

function CadComparisonPopup({
  file,
  onClose,
  onDownloadPdf,
  onDownload,
  downloadingReport,
  downloading,
  converterCredits = 0,
}) {
  const [copied, setCopied] = useState(false);
  const drawing = isDrawingConversion(file);
  const showImages = !drawing && hasComparisonPhotos(file);

  const inputUrl = useMemo(
    () => toCadOutputCdnUrl(file?.input_snapshot_url) || file?.input_snapshot_url || "",
    [file?.input_snapshot_url],
  );
  const outputUrl = useMemo(
    () => toCadOutputCdnUrl(file?.output_snapshot_url) || file?.output_snapshot_url || "",
    [file?.output_snapshot_url],
  );
  const htmlUrl = useMemo(
    () => toCadOutputCdnUrl(file?.report_html_url) || file?.report_html_url || "",
    [file?.report_html_url],
  );

  const inputFmt = String(file?.input_format || "CAD").toUpperCase();
  const outputFmt = String(file?.output_format || "CAD").toUpperCase();
  const base = stemName(file?.file_name || file?.base_name, drawing ? "drawing" : "part");
  const inputFileName = `${base}_original.${String(file?.input_format || "cad").toLowerCase()}`;
  const outputFileName = `${base}_converted.${String(file?.output_format || "cad").toLowerCase()}`;

  const stats = drawing ? pickDrawingStats(file) : pickSolidStats(file);
  const checkGroups = groupChecks(file?.quality_checks, drawing);
  const { passed, total } = summarizeChecks(file?.quality_checks);
  const allPassed = total > 0 && passed === total;
  const verdict = String(file?.quality_verdict || "").toLowerCase();
  const passedOverall = allPassed || verdict === "pass";
  const timeLabel = formatTime(file?.time_taken_seconds);
  const createdLabel = formatCreatedOn(file?.createdAt);
  const price = priceBadge(file);
  const fileId = String(file?._id || "");
  const shortId = fileId.length > 22 ? `${fileId.slice(0, 20)}…` : fileId;

  const copyId = async () => {
    if (!fileId) return;
    try {
      await navigator.clipboard.writeText(fileId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <PopupWrapper>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="CAD Comparison">
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon fontSize="small" />
        </button>

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.brandIcon} aria-hidden>
              <CompareArrowsIcon fontSize="small" />
            </span>
            <div>
              <h2 className={styles.title}>
                {drawing ? "Drawing Comparison" : "CAD Comparison"}
              </h2>
              <p className={styles.subtitle}>
                {inputFmt} → {outputFmt} Conversion
              </p>
            </div>
          </div>
          <div className={styles.headerBadges}>
            {file?.status === "COMPLETED" && (
              <span className={styles.statusBadge}>
                <CheckCircleIcon sx={{ fontSize: 15 }} />
                Completed
              </span>
            )}
            {price && <span className={styles.priceBadge}>{price}</span>}
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.mainCol}>
            {showImages ? (
              <div className={styles.previewRow}>
                <div className={styles.fileCard}>
                  <div className={styles.fileCardHead}>
                    <span className={styles.fileCardTag}>Original ({inputFmt})</span>
                    <div className={styles.fileMeta}>
                      <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                      <div>
                        <strong>{inputFileName}</strong>
                        <span>{stats.srcSize || "—"}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.filePreview}>
                    <span className={styles.cubeHint} aria-hidden>
                      <ViewInArOutlinedIcon sx={{ fontSize: 16 }} />
                    </span>
                    {inputUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={inputUrl} alt={`${inputFmt} original snapshot`} />
                    ) : (
                      <div className={styles.paneEmpty}>No input photo</div>
                    )}
                  </div>
                </div>

                <div className={styles.fileCard}>
                  <div className={styles.fileCardHead}>
                    <span className={styles.fileCardTag}>Converted ({outputFmt})</span>
                    <div className={styles.fileMeta}>
                      <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                      <div>
                        <strong>{outputFileName}</strong>
                        <span>{stats.outSize || "—"}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.filePreview}>
                    <span className={styles.cubeHint} aria-hidden>
                      <ViewInArOutlinedIcon sx={{ fontSize: 16 }} />
                    </span>
                    {outputUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={outputUrl} alt={`${outputFmt} converted snapshot`} />
                    ) : (
                      <div className={styles.paneEmpty}>No output photo</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.fileMetaRow}>
                <div className={styles.fileMetaCard}>
                  <span className={styles.fileCardTag}>Original ({inputFmt})</span>
                  <div className={styles.fileMeta}>
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                    <div>
                      <strong>{inputFileName}</strong>
                      <span>{stats.srcSize || "—"}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.fileMetaCard}>
                  <span className={styles.fileCardTag}>Converted ({outputFmt})</span>
                  <div className={styles.fileMeta}>
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                    <div>
                      <strong>{outputFileName}</strong>
                      <span>{stats.outSize || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.attrTable}>
              <AttrRow
                icon={CategoryOutlinedIcon}
                label="File Format"
                value={`${inputFmt} → ${outputFmt}`}
              />
              <AttrRow
                icon={DataObjectOutlinedIcon}
                label="File Size"
                value={`${stats.srcSize || "—"} → ${stats.outSize || "—"}`}
              />

              {drawing ? (
                <>
                  <AttrRow
                    icon={AccountTreeOutlinedIcon}
                    label="Drawable Entities"
                    value={`${stats.srcDrawable || "—"} → ${stats.outDrawable || "—"}`}
                  />
                  <AttrRow
                    icon={LayersOutlinedIcon}
                    label="Layers"
                    value={`${stats.srcLayers || "—"} → ${stats.outLayers || "—"}`}
                  />
                  <AttrRow
                    icon={HubOutlinedIcon}
                    label="Entity Match"
                    value={stats.entityMatch || "—"}
                    ok={Boolean(file?.quality_entities_match)}
                  />
                  <AttrRow
                    icon={GridOnOutlinedIcon}
                    label="Layer Match"
                    value={stats.layerMatch || "—"}
                    ok={Boolean(file?.quality_layers_match)}
                  />
                  <AttrRow
                    icon={StraightenOutlinedIcon}
                    label="Extents Error"
                    value={stats.extents || "—"}
                  />
                </>
              ) : (
                <>
                  <AttrRow
                    icon={HubOutlinedIcon}
                    label="Vertices"
                    value={`${stats.srcVerts || "—"} → ${stats.outVerts || "—"}`}
                  />
                  <AttrRow
                    icon={GridOnOutlinedIcon}
                    label="Faces"
                    value={`${stats.srcFaces || "—"} → ${stats.outFaces || "—"}`}
                  />
                </>
              )}

              <AttrRow
                icon={CheckCircleIcon}
                label="Status"
                value={file?.status === "COMPLETED" ? "Completed" : file?.status || "—"}
                ok={file?.status === "COMPLETED"}
              />
              <AttrRow
                icon={ScheduleOutlinedIcon}
                label="Conversion Time"
                value={timeLabel || "—"}
              />
              <AttrRow
                icon={CalendarMonthOutlinedIcon}
                label="Created On"
                value={createdLabel || "—"}
              />
            </div>
          </div>

          <aside className={styles.sideCol}>
            <div className={styles.reportHead}>
              <DescriptionOutlinedIcon sx={{ fontSize: 20, color: "#610bee" }} />
              <strong>{drawing ? "Drawing Report" : "Report"}</strong>
            </div>

            <ul className={styles.checkList}>
              {(checkGroups.length
                ? checkGroups
                : [{
                    label: drawing ? "Drawing Checks" : "Quality Checks",
                    passed: 0,
                    total: 0,
                    ok: false,
                  }]
              ).map((g) => (
                <li key={g.label}>
                  <CheckCircleIcon
                    sx={{ fontSize: 18, color: g.ok ? "#16a34a" : "#9ca3af" }}
                  />
                  <span>{g.label}</span>
                  <strong>
                    {g.passed}/{g.total}
                  </strong>
                </li>
              ))}
            </ul>

            <div className={passedOverall ? styles.passBox : styles.warnBox}>
              <CheckCircleIcon sx={{ fontSize: 28, color: passedOverall ? "#16a34a" : "#d97706" }} />
              <div>
                <strong>{passedOverall ? "Passed" : "Review needed"}</strong>
                <p>
                  {passedOverall
                    ? drawing
                      ? "Drawing checks completed successfully"
                      : "All checks completed successfully"
                    : total
                      ? `${passed}/${total} checks passed`
                      : "Quality report available"}
                </p>
              </div>
            </div>

            <div className={styles.generateBlock}>
              <span>Generate Report</span>
              <button
                type="button"
                className={styles.pdfBtn}
                onClick={onDownloadPdf}
                disabled={!file?.report_pdf_url || Boolean(downloadingReport)}
              >
                <PictureAsPdfIcon sx={{ fontSize: 18 }} />
                {downloadingReport ? "Downloading…" : "PDF Report"}
              </button>
            </div>
          </aside>
        </div>

        <footer className={styles.footer}>
          <button type="button" className={styles.fileIdBtn} onClick={copyId} title="Copy file ID">
            <span>File ID: {shortId || "—"}</span>
            <ContentCopyIcon sx={{ fontSize: 15 }} />
            {copied && <em>Copied</em>}
          </button>
          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.detailsBtn}
              disabled={!htmlUrl}
              onClick={() => {
                if (htmlUrl) window.open(htmlUrl, "_blank", "noopener,noreferrer");
              }}
            >
              <VisibilityIcon sx={{ fontSize: 18 }} />
              View Details
            </button>
            <button
              type="button"
              className={styles.downloadBtn}
              onClick={onDownload}
              disabled={file?.status !== "COMPLETED" || Boolean(downloading)}
            >
              <DownloadIcon sx={{ fontSize: 18 }} />
              {comparisonDownloadLabel(file, downloading, converterCredits)}
            </button>
          </div>
        </footer>
      </div>
    </PopupWrapper>
  );
}

export default CadComparisonPopup;
