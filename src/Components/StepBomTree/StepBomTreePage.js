"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Footer from "@/Components/HomePages/Footer/Footer";
import {
  getOrCreateStepBomUuid,
  pollStepBomJob,
  uploadStepBomFile,
} from "@/api/stepBomApi";
import { mergeMeshes, renderMeshThumb } from "./meshThumb";
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

function geomKey(node) {
  const box = node?.bbox_mm || {};
  return `${round1(node?.volume_mm3)}|${round1(box.x)}|${round1(box.y)}|${round1(box.z)}|${round1(node?.area_mm2)}`;
}

function indexMeshesByGeom(node, partsById, into = {}) {
  if (!node) return into;
  if (node.preview_id && partsById[node.preview_id]) {
    const key = geomKey(node);
    if (!into[key]) into[key] = partsById[node.preview_id];
  }
  for (const child of node.children || []) indexMeshesByGeom(child, partsById, into);
  return into;
}

function meshForNode(node, partsById, geomIndex) {
  if (node?.preview_id && partsById[node.preview_id]) return partsById[node.preview_id];
  const byGeom = geomIndex?.[geomKey(node)];
  if (byGeom) return byGeom;
  const parts = collectPreviewIds(node)
    .map((id) => partsById[id])
    .filter(Boolean);
  if (!parts.length) return null;
  if (parts.length === 1) return parts[0];
  return mergeMeshes(parts);
}

function PartThumb({ mesh, size = 72, alt, className, onOpen }) {
  const src = useMemo(() => (mesh ? renderMeshThumb(mesh, size) : ""), [mesh, size]);
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

  return (
    <li className={styles.treeItem} style={{ "--depth": depth }}>
      <div className={styles.treeRow}>
        <button
          type="button"
          className={styles.treeToggleBtn}
          onClick={() => hasChildren && setOpen((prev) => !prev)}
          aria-expanded={hasChildren ? open : undefined}
        >
          <span className={`${styles.treeToggle} ${hasChildren ? "" : styles.treeToggleLeaf}`}>
            {hasChildren ? (open ? "▾" : "▸") : "•"}
          </span>
        </button>
        <PartThumb
          mesh={mesh}
          size={72}
          alt={node?.name}
          className={styles.thumb}
          onOpen={mesh ? () => onOpenPhoto?.(mesh, node?.name) : undefined}
        />
        <div className={styles.treeBody}>
          <div className={styles.treeTitleRow}>
            <span className={`${styles.typeChip} ${node?.type === "assembly" ? styles.typeAssembly : styles.typePart}`}>
              {node?.type === "assembly" ? "ASM" : "PRT"}
            </span>
            <span className={styles.treeName}>{node?.name || "Untitled"}</span>
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
              key={`${child?.source_name || child?.name || "node"}-${index}`}
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
    () => indexMeshesByGeom(tree, partsById),
    [partsById, tree],
  );

  const uniqueParts = useMemo(() => {
    const raw = summary?.unique_parts;
    if (Array.isArray(raw) && raw.length) return raw;
    const grouped = new Map();
    for (const row of flat) {
      if (row?.type !== "part") continue;
      const entry = grouped.get(row.name) || {
        name: row.name,
        quantity: 0,
        preview_id: row.preview_id || "",
        volume_mm3: row.volume_mm3,
        area_mm2: row.area_mm2,
        solid_count: row.solid_count,
        bbox_mm: row.bbox_mm,
      };
      entry.quantity += Number(row.total_quantity) || 1;
      if (!entry.preview_id && row.preview_id) entry.preview_id = row.preview_id;
      grouped.set(row.name, entry);
    }
    return Array.from(grouped.values());
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

  const downloadJson = useCallback(() => {
    if (!tree) return;
    const blob = new Blob([JSON.stringify({ tree, flat, summary }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(file?.name || "step-bom").replace(/\.[^.]+$/, "")}-bom.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [file, flat, summary, tree]);

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
              <strong>{summary.unique_part_count || uniqueParts.length}</strong>
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

        {tree ? (
          <section className={styles.resultPanel}>
            <div className={styles.resultHeader}>
              <h2>Assembly tree</h2>
              <button type="button" className={styles.jsonBtn} onClick={downloadJson}>
                Download JSON
              </button>
            </div>
            <ul className={styles.treeList}>
              <BomNode node={tree} partsById={partsById} geomIndex={geomIndex} onOpenPhoto={openPhoto} />
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
                  <figure key={part.name} className={styles.photoCard}>
                    <PartThumb
                      mesh={mesh}
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

        {flat.length ? (
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
                  {flat.map((row, index) => {
                    const mesh = meshForNode(row, partsById, geomIndex);
                    return (
                      <tr key={`${row.name}-${index}`}>
                        <td>
                          <PartThumb
                            mesh={mesh}
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
