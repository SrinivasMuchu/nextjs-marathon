"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Footer from "@/Components/HomePages/Footer/Footer";
import {
  getOrCreateStepBomUuid,
  pollStepBomJob,
  uploadStepBomFile,
} from "@/api/stepBomApi";
import { boxMeshFromBbox, mergeMeshes, renderMeshThumb } from "./meshThumb";
import styles from "./StepBomTreePage.module.css";

const STEP_EXT = /\.(step|stp)$/i;
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

function formatMb(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatNumber(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function formatSize(bbox) {
  if (!bbox) return "—";
  const x = Number(bbox.x);
  const y = Number(bbox.y);
  const z = Number(bbox.z);
  if (![x, y, z].every(Number.isFinite)) return "—";
  return `${formatNumber(x, 1)} × ${formatNumber(y, 1)} × ${formatNumber(z, 1)} mm`;
}

function statusLabel(status) {
  if (status === "PENDING") return "Queued on Kafka topic sample_step";
  if (status === "PROCESSING") return "FreeCAD is reading the STEP assembly";
  if (status === "COMPLETED") return "BOM tree ready";
  if (status === "FAILED") return "Extraction failed";
  return "Waiting";
}

function collectPreviewIds(node, into = []) {
  if (!node) return into;
  if (node.preview_id) into.push(node.preview_id);
  for (const child of node.children || []) collectPreviewIds(child, into);
  return into;
}

function round1(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(1) : "0.0";
}

function repairMojibake(value) {
  const text = String(value || "");
  if (!text) return "";
  try {
    const bytes = Uint8Array.from([...text].map((ch) => ch.charCodeAt(0)));
    if (bytes.some((b) => b > 255)) return text;
    if (!bytes.some((b) => b >= 128)) return text;
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes) || text;
  } catch {
    return text;
  }
}

function stripInstanceSuffix(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[\s._-]*\d{3,}$/u, "")
    .trim();
}

function canonicalName(value) {
  let text = repairMojibake(String(value || "")).replace(/\s+/g, " ").trim();
  let previous = "";
  while (text && text !== previous) {
    previous = text;
    text = text
      .replace(/\s*\(\s*solid\s+\d+\s*\)\s*$/i, "")
      .replace(/[._][A-Za-z]*\d{3,}$/i, "")
      .replace(/\s+[A-Za-z][A-Za-z0-9_-]*\d{3,}$/i, "")
      .replace(/[\s._-]*\d{3,}$/u, "")
      .trim();
  }
  return text || stripInstanceSuffix(repairMojibake(value)) || "Part";
}

function isGenericName(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return true;
  if (/^open\s+cascade\s+step\s+translator(?:\s+[\d.]+)*(?:\s+\d+)*$/i.test(text)) return true;
  if (/^(part|solid|compound|shape|body|imported\s*part)(?:[\s._-]*\d+)*$/i.test(text)) return true;
  if (/^part\s+\d/i.test(text)) return true;
  return false;
}

function partLabel(node) {
  if (isGenericName(node?.name)) {
    const size = formatSize(node?.bbox_mm);
    return size !== "—" ? `Part ${size}` : "Part";
  }
  const cleaned = canonicalName(node?.name);
  if (!cleaned || isGenericName(cleaned)) {
    const size = formatSize(node?.bbox_mm);
    return size !== "—" ? `Part ${size}` : "Part";
  }
  return cleaned;
}

function isAssemblyNode(node) {
  return node?.type === "assembly" || (Array.isArray(node?.children) && node.children.length > 0);
}

function instanceSuffix(value) {
  const match = String(value || "").trim().match(/(\d{2,})\s*$/);
  return match ? match[1] : "";
}

function assemblyLabel(node) {
  const raw = String(node?.name || "").trim();
  if (raw && !isGenericName(raw)) return canonicalName(raw);
  const inst = instanceSuffix(raw) || instanceSuffix(node?.source_name);
  return inst ? `Assembly ${inst}` : "Assembly";
}

function nodeLabel(node) {
  return isAssemblyNode(node) ? assemblyLabel(node) : partLabel(node);
}

function geomKey(node) {
  const box = node?.bbox_mm || {};
  const dims = [Number(box.x) || 0, Number(box.y) || 0, Number(box.z) || 0]
    .map((value) => (Math.round(value * 2) / 2).toFixed(1))
    .sort((left, right) => Number(left) - Number(right));
  const vol = Math.abs(Number(node?.volume_mm3) || 0);
  const volKey = vol >= 50 ? String(Math.round(vol)) : vol.toFixed(1);
  return `${volKey}|${dims.join("x")}`;
}

function mergeUniquePartList(parts) {
  const grouped = new Map();
  for (const part of parts || []) {
    const key = geomKey(part);
    const qty = Number(part.quantity) || 1;
    const existing = grouped.get(key);
    if (existing) {
      existing.quantity += qty;
      if (!existing.preview_id && part.preview_id) existing.preview_id = part.preview_id;
      continue;
    }
    grouped.set(key, {
      ...part,
      name: partLabel(part),
      quantity: qty,
    });
  }
  return Array.from(grouped.values());
}

function indexMeshesByGeom(node, partsById, previewParts = [], into = {}) {
  if (node) {
    if (node.preview_id && partsById[node.preview_id]) {
      const key = geomKey(node);
      if (!into[key]) into[key] = partsById[node.preview_id];
    }
    for (const child of node.children || []) indexMeshesByGeom(child, partsById, [], into);
  }
  for (const part of previewParts) {
    if (!part?.id || !partsById[part.id]) continue;
    if (part.bbox_mm || part.volume_mm3) {
      const key = geomKey(part);
      if (!into[key]) into[key] = partsById[part.id];
    }
  }
  return into;
}

function childMergeKey(node) {
  if (isAssemblyNode(node)) {
    return `asm|${node?.source_name || ""}|${node?.name || ""}`;
  }
  return `part|${geomKey(node)}`;
}

function collapseNode(node) {
  if (!node) return node;
  const grouped = new Map();
  let assemblyIndex = 0;
  for (const child of node.children || []) {
    const collapsed = collapseNode(child);
    if (isAssemblyNode(collapsed)) {
      grouped.set(`asm|${assemblyIndex}|${collapsed.source_name || collapsed.name || assemblyIndex}`, {
        ...collapsed,
        name: assemblyLabel(collapsed),
        quantity: Number(collapsed.quantity) || 1,
      });
      assemblyIndex += 1;
      continue;
    }
    const key = `part|${geomKey(collapsed)}`;
    const qty = Number(collapsed.quantity) || 1;
    const existing = grouped.get(key);
    if (existing) {
      existing.quantity = (Number(existing.quantity) || 1) + qty;
      if (!existing.preview_id && collapsed.preview_id) existing.preview_id = collapsed.preview_id;
      continue;
    }
    grouped.set(key, {
      ...collapsed,
      name: partLabel(collapsed),
      quantity: qty,
    });
  }
  const children = Array.from(grouped.values());
  return {
    ...node,
    name: nodeLabel({ ...node, children }),
    quantity: Number(node.quantity) || 1,
    children,
  };
}

function flattenCollapsed(node, level = 0, parentQty = 1, rows = []) {
  if (!node) return rows;
  const qty = Number(node.quantity) || 1;
  const total = qty * (Number(parentQty) || 1);
  const box = node.bbox_mm || {};
  rows.push({
    level,
    name: nodeLabel(node),
    type: node.type === "assembly" ? "Assembly" : "Part",
    quantity: qty,
    total_quantity: total,
    size_x: Number(box.x) || 0,
    size_y: Number(box.y) || 0,
    size_z: Number(box.z) || 0,
    volume_mm3: Number(node.volume_mm3) || 0,
    area_mm2: Number(node.area_mm2) || 0,
    solid_count: Number(node.solid_count) || 0,
    bbox_mm: node.bbox_mm || null,
    preview_id: node.preview_id || "",
  });
  for (const child of node.children || []) {
    flattenCollapsed(child, level + 1, total, rows);
  }
  return rows;
}

function styleHeader(row) {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1F2937" },
  };
  row.alignment = { vertical: "middle" };
}

async function downloadBomExcel({ fileName, summary, uniqueParts, treeRows }) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Marathon STEP BOM";
  workbook.created = new Date();

  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { header: "Field", key: "field", width: 28 },
    { header: "Value", key: "value", width: 40 },
  ];
  styleHeader(summarySheet.getRow(1));
  [
    ["File", fileName || "step-bom"],
    ["Assemblies", summary?.assembly_count || 0],
    ["Unique parts", uniqueParts.length],
    ["Total quantity", summary?.total_part_quantity || uniqueParts.reduce((sum, part) => sum + (Number(part.quantity) || 0), 0)],
    ["Tree nodes", treeRows.length || summary?.node_count || 0],
  ].forEach(([field, value]) => summarySheet.addRow({ field, value }));

  const partsSheet = workbook.addWorksheet("Parts");
  partsSheet.columns = [
    { header: "Name", key: "name", width: 42 },
    { header: "Qty", key: "quantity", width: 10 },
    { header: "Size X (mm)", key: "size_x", width: 14 },
    { header: "Size Y (mm)", key: "size_y", width: 14 },
    { header: "Size Z (mm)", key: "size_z", width: 14 },
    { header: "Volume (mm³)", key: "volume_mm3", width: 16 },
    { header: "Area (mm²)", key: "area_mm2", width: 14 },
  ];
  styleHeader(partsSheet.getRow(1));
  uniqueParts.forEach((part) => {
    const box = part.bbox_mm || {};
    partsSheet.addRow({
      name: partLabel(part),
      quantity: Number(part.quantity) || 1,
      size_x: Number(box.x) || 0,
      size_y: Number(box.y) || 0,
      size_z: Number(box.z) || 0,
      volume_mm3: Number(part.volume_mm3) || 0,
      area_mm2: Number(part.area_mm2) || 0,
    });
  });

  const treeSheet = workbook.addWorksheet("Assembly tree");
  treeSheet.columns = [
    { header: "Level", key: "level", width: 10 },
    { header: "Name", key: "name", width: 48 },
    { header: "Type", key: "type", width: 12 },
    { header: "Qty", key: "quantity", width: 10 },
    { header: "Total qty", key: "total_quantity", width: 12 },
    { header: "Size X (mm)", key: "size_x", width: 14 },
    { header: "Size Y (mm)", key: "size_y", width: 14 },
    { header: "Size Z (mm)", key: "size_z", width: 14 },
    { header: "Volume (mm³)", key: "volume_mm3", width: 16 },
    { header: "Area (mm²)", key: "area_mm2", width: 14 },
    { header: "Solids", key: "solid_count", width: 10 },
  ];
  styleHeader(treeSheet.getRow(1));
  treeRows.forEach((row) => {
    const added = treeSheet.addRow({
      ...row,
      name: `${"  ".repeat(row.level)}${row.name}`,
    });
    if (row.type === "Assembly") {
      added.font = { bold: true };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(fileName || "step-bom").replace(/\.[^.]+$/, "")}-bom.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}

function meshForNode(node, partsById, geomIndex) {
  if (node?.preview_id && partsById[node.preview_id]) return partsById[node.preview_id];
  const byGeom = geomIndex?.[geomKey(node)];
  if (byGeom) return byGeom;
  const parts = collectPreviewIds(node)
    .map((id) => partsById[id])
    .filter(Boolean);
  if (parts.length === 1) return parts[0];
  if (parts.length > 1) return mergeMeshes(parts);
  if (node?.bbox_mm) return boxMeshFromBbox(node.bbox_mm, `bbox-${geomKey(node)}`);
  return null;
}

function PartThumb({ mesh, bbox, size = 72, alt, className, onOpen }) {
  const src = useMemo(() => {
    const fromMesh = mesh ? renderMeshThumb(mesh, size) : "";
    if (fromMesh) return fromMesh;
    if (bbox) return renderMeshThumb(boxMeshFromBbox(bbox, `bbox-${size}`), size);
    return "";
  }, [bbox, mesh, size]);
  if (!src) {
    return (
      <div
        className={styles.thumbPlaceholder}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }
  if (onOpen) {
    return (
      <button type="button" className={styles.thumbBtn} onClick={onOpen} title={alt || "Part image"}>
        <img src={src} alt={alt || ""} width={size} height={size} className={className || styles.thumb} />
      </button>
    );
  }
  return <img src={src} alt={alt || ""} width={size} height={size} className={className || styles.thumb} />;
}

function BomNode({ node, depth = 0, partsById, geomIndex, onOpenPhoto }) {
  const [open, setOpen] = useState(depth < 2);
  const children = Array.isArray(node?.children) ? node.children : [];
  const hasChildren = children.length > 0;
  const qty = Number(node?.quantity) || 1;
  const mesh = meshForNode(node, partsById, geomIndex);
  const label = nodeLabel(node);

  return (
    <li className={styles.treeItem} style={{ "--depth": depth }}>
      <div className={styles.treeRow}>
        {hasChildren ? (
          <button
            type="button"
            className={styles.treeToggleBtn}
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
            title={open ? "Collapse" : "Expand"}
          >
            <svg className={`${styles.treeChevron} ${open ? styles.treeChevronOpen : ""}`} viewBox="0 0 24 24" aria-hidden>
              <path d="M8 4.5 17 12 8 19.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <span className={styles.treeLeafSlot} aria-hidden />
        )}
        <PartThumb
          mesh={mesh}
          bbox={node?.bbox_mm}
          size={72}
          alt={label}
          className={styles.thumb}
          onOpen={mesh ? () => onOpenPhoto?.(mesh, label) : undefined}
        />
        <div className={styles.treeBody}>
          <div className={styles.treeTitleRow}>
            <span className={`${styles.typeChip} ${node?.type === "assembly" ? styles.typeAssembly : styles.typePart}`}>
              {node?.type === "assembly" ? "ASM" : "PRT"}
            </span>
            <span className={styles.treeName}>{label || "Untitled"}</span>
            <span className={styles.treeQty}>×{qty}</span>
          </div>
          <div className={styles.treeDetails}>
            <span>Size {formatSize(node?.bbox_mm)}</span>
            {node?.volume_mm3 ? <span>Volume {formatNumber(node.volume_mm3)} mm³</span> : null}
            {node?.area_mm2 ? <span>Area {formatNumber(node.area_mm2)} mm²</span> : null}
            {node?.solid_count ? <span>{node.solid_count} solid{Number(node.solid_count) === 1 ? "" : "s"}</span> : null}
          </div>
        </div>
      </div>
      {hasChildren && open ? (
        <ul className={styles.treeList}>
          {children.map((child, index) => (
            <BomNode
              key={`${childMergeKey(child)}-${index}`}
              node={child}
              depth={depth + 1}
              partsById={partsById}
              geomIndex={geomIndex}
              onOpenPhoto={onOpenPhoto}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function StepBomTreePage() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const fileInputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    getOrCreateStepBomUuid();
    return () => abortRef.current?.abort();
  }, []);

  const summary = job?.bom_summary || null;
  const tree = job?.bom_tree || null;
  const displayTree = useMemo(() => (tree ? collapseNode(tree) : null), [tree]);
  const flat = useMemo(
    () => (Array.isArray(job?.bom_flat) ? job.bom_flat : []),
    [job],
  );
  const previewParts = useMemo(
    () => (Array.isArray(job?.preview_parts) ? job.preview_parts.filter((part) => part?.id) : []),
    [job],
  );
  const partsById = useMemo(() => {
    const map = {};
    for (const part of previewParts) map[part.id] = part;
    return map;
  }, [previewParts]);
  const geomIndex = useMemo(
    () => indexMeshesByGeom(tree, partsById, previewParts),
    [partsById, previewParts, tree],
  );

  const uniqueParts = useMemo(() => {
    const fromFlat = flat
      .filter((row) => row?.type === "part")
      .map((row) => ({
        ...row,
        quantity: Number(row.total_quantity) || Number(row.quantity) || 1,
      }));
    const fromSummary = Array.isArray(summary?.unique_parts) ? summary.unique_parts : [];
    return mergeUniquePartList(fromFlat.length ? fromFlat : fromSummary);
  }, [flat, summary]);

  const openPhoto = useCallback((mesh, name) => {
    if (!mesh) return;
    setLightbox({ src: renderMeshThumb(mesh, 320), name: name || "Part" });
  }, []);

  const pickFile = useCallback((nextFile) => {
    if (!nextFile) return;
    if (!STEP_EXT.test(nextFile.name)) {
      toast.error("Only .step or .stp files are allowed.");
      return;
    }
    if (nextFile.size > MAX_UPLOAD_BYTES) {
      toast.error(`File is ${formatMb(nextFile.size)}. Maximum size is 100 MB.`);
      return;
    }
    setFile(nextFile);
    setError("");
    setJob(null);
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragOver(false);
      pickFile(event.dataTransfer.files?.[0]);
    },
    [pickFile],
  );

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!file || submitting) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setSubmitting(true);
      setError("");
      setJob({ status: "PENDING", file_name: file.name });
      try {
        const data = await uploadStepBomFile(file);
        const created = data?.job || data;
        setJob(created);
        const jobId = created?.job_id;
        if (!jobId) throw new Error("Job was queued but no id was returned.");
        const finished = await pollStepBomJob(jobId, {
          signal: controller.signal,
          onUpdate: setJob,
        });
        if (finished?.status === "FAILED") {
          setError(finished.error_message || "BOM extraction failed.");
        }
      } catch (err) {
        const message = err?.message || "Could not start STEP BOM extraction.";
        setError(message);
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [file, submitting],
  );

  const treeRows = useMemo(
    () => (displayTree ? flattenCollapsed(displayTree) : []),
    [displayTree],
  );

  const downloadExcel = useCallback(async () => {
    if (!displayTree) return;
    try {
      await downloadBomExcel({
        fileName: file?.name || "step-bom",
        summary,
        uniqueParts,
        treeRows,
      });
    } catch (err) {
      const message = err?.message || "Could not download Excel.";
      toast.error(message);
    }
  }, [displayTree, file, summary, treeRows, uniqueParts]);

  return (
    <div className={styles.root}>
      <main className={styles.page}>
        <p className={styles.badge}>Sample · Kafka topic sample_step</p>
        <h1 className={styles.title}>STEP file BOM tree</h1>
        <p className={styles.lede}>
          Upload a STEP assembly. The API publishes a message on <code>sample_step</code>,
          a dockerized FreeCAD worker reads the product structure, and each BOM row shows
          that part’s image, name, size, and quantities — without uploading part images to S3.
        </p>

        <form className={styles.panel} onSubmit={onSubmit}>
          <input
            ref={fileInputRef}
            className={styles.fileInputHidden}
            type="file"
            accept=".step,.stp,application/step"
            onChange={(event) => pickFile(event.target.files?.[0])}
          />
          <div
            className={`${styles.dropzone} ${dragOver ? styles.dropzoneDrag : ""} ${file ? styles.dropzoneFilled : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
            }}
          >
            {file ? (
              <div className={styles.fileRow}>
                <span className={styles.fileBadge}>STEP</span>
                <div>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileSize}>{formatMb(file.size)}</div>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={(event) => {
                    event.stopPropagation();
                    setFile(null);
                    setJob(null);
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className={styles.dropHeadline}>Drag &amp; drop a .step / .stp file</p>
                <p className={styles.dropSub}>or click to browse · max 100 MB</p>
              </div>
            )}
          </div>

          <button className={styles.submitBtn} type="submit" disabled={!file || submitting}>
            {submitting ? "Extracting BOM…" : "Get BOM tree"}
          </button>
        </form>

        {job ? (
          <section className={styles.statusCard} aria-live="polite">
            <div className={styles.statusRow}>
              <span className={`${styles.statusDot} ${styles[`status_${job.status || "PENDING"}`]}`} />
              <strong>{statusLabel(job.status)}</strong>
            </div>
            {job.time_taken_seconds ? (
              <p className={styles.statusMeta}>Finished in {formatNumber(job.time_taken_seconds, 2)}s</p>
            ) : null}
            {error ? <p className={styles.error}>{error}</p> : null}
          </section>
        ) : null}

        {summary ? (
          <section className={styles.summaryGrid}>
            <div>
              <span>Assemblies</span>
              <strong>{summary.assembly_count || 0}</strong>
            </div>
            <div>
              <span>Unique parts</span>
              <strong>{uniqueParts.length}</strong>
            </div>
            <div>
              <span>Total qty</span>
              <strong>{summary.total_part_quantity || 0}</strong>
            </div>
            <div>
              <span>Nodes</span>
              <strong>{summary.node_count || 0}</strong>
            </div>
          </section>
        ) : null}

        {displayTree ? (
          <section className={styles.resultPanel}>
            <div className={styles.resultHeader}>
              <h2>Assembly tree</h2>
              <button type="button" className={styles.jsonBtn} onClick={downloadExcel}>
                Download Excel
              </button>
            </div>
            <ul className={styles.treeList}>
              <BomNode node={displayTree} partsById={partsById} geomIndex={geomIndex} onOpenPhoto={openPhoto} />
            </ul>
          </section>
        ) : null}

        {uniqueParts.length ? (
          <section className={styles.resultPanel}>
            <h2>Parts</h2>
            <div className={styles.photoGrid}>
              {uniqueParts.map((part) => {
                const mesh = meshForNode(part, partsById, geomIndex);
                return (
                  <figure key={`${part.name}-${geomKey(part)}`} className={styles.photoCard}>
                    <PartThumb
                      mesh={mesh}
                      bbox={part.bbox_mm}
                      size={180}
                      alt={part.name}
                      className={styles.cardThumb}
                      onOpen={mesh ? () => openPhoto(mesh, part.name) : undefined}
                    />
                    <figcaption>
                      <strong>{part.name}</strong>
                      <span>×{part.quantity || 1}</span>
                      <small>Size {formatSize(part.bbox_mm)}</small>
                      {part.volume_mm3 ? <small>Volume {formatNumber(part.volume_mm3)} mm³</small> : null}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        ) : null}

        {treeRows.length ? (
          <section className={styles.resultPanel}>
            <h2>Flat BOM</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Total qty</th>
                    <th>Volume (mm³)</th>
                  </tr>
                </thead>
                <tbody>
                  {treeRows.map((row, index) => {
                    const mesh = meshForNode(row, partsById, geomIndex);
                    return (
                      <tr key={`${row.name}-${index}`}>
                        <td>
                          <PartThumb
                            mesh={mesh}
                            bbox={row.bbox_mm}
                            size={56}
                            alt={row.name}
                            className={styles.thumb}
                            onOpen={mesh ? () => openPhoto(mesh, row.name) : undefined}
                          />
                        </td>
                        <td style={{ paddingLeft: 12 + Number(row.level || 0) * 14 }}>
                          <div className={styles.tableName}>{row.name}</div>
                          {row.area_mm2 ? (
                            <div className={styles.treeMeta}>Area {formatNumber(row.area_mm2)} mm²</div>
                          ) : null}
                        </td>
                        <td>{row.type}</td>
                        <td>{formatSize(row.bbox_mm)}</td>
                        <td>{row.quantity}</td>
                        <td>{row.total_quantity}</td>
                        <td>{formatNumber(row.volume_mm3)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {lightbox ? (
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.name}
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox.src} alt={lightbox.name} />
            <p>{lightbox.name}</p>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
