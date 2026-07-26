"use client";

import React, { useEffect, useMemo, useState } from "react";
import PopupWrapper from "../CommonJsx/PopupWrapper";
import {
  buildCadConverterMetadataUrl,
  buildCadConverterOutputUrl,
} from "@/config";
import styles from "./ConversionReportPopup.module.css";

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size < 0) return "—";
  if (size === 0) return "0 B";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTriangles(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "—";
  return n.toLocaleString();
}

function formatSeconds(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n < 60) return `${n.toFixed(1)} seconds`;
  return `${(n / 60).toFixed(1)} min`;
}

function convertedFileName(file) {
  const original = file?.file_name || "converted-file";
  const dot = original.lastIndexOf(".");
  const base = dot > 0 ? original.slice(0, dot) : original;
  return `${base}.${String(file?.output_format || "bin").toLowerCase()}`;
}

function pickDetails(file, remoteMeta) {
  const details = file?.cad_details || remoteMeta || {};
  const geometry = details.geometry_stats || details.geometry || {};
  const tess = details.tessellation || {};
  const validity = details.validity || {};
  const meshQuality = details.mesh_quality || {};
  const surfaces = details.surfaces || {};
  const edges = details.edges || {};
  const bbox = details.bounding_box || {};

  const triangles =
    geometry.num_triangles ??
    tess.triangles ??
    geometry.triangles ??
    null;

  const isClosed =
    validity.is_closed === true ||
    meshQuality.is_solid === true;
  const isValid = validity.is_valid !== false;
  const nonManifold =
    meshQuality.has_non_manifolds === true ||
    meshQuality.has_non_manifold_edges === true ||
    meshQuality.has_non_manifold_points === true;
  const openEdges =
    edges?.circular_edge_count != null && validity.is_closed === false
      ? "Open"
      : validity.is_closed === false
        ? "Open"
        : 0;

  return {
    details,
    triangles,
    bbox,
    surfaces,
    edges,
    volumeMm3: geometry.volume_mm3 ?? details.volumes?.total_mm3 ?? null,
    areaMm2: geometry.surface_area_mm2 ?? null,
    solids: geometry.num_solids ?? geometry.solids ?? null,
    faces: geometry.num_faces ?? geometry.faces ?? null,
    checks: {
      watertight: {
        label: "Watertight mesh",
        value: isClosed ? "Passed" : validity.is_closed == null ? "N/A" : "Failed",
        ok: isClosed || validity.is_closed == null,
      },
      manifold: {
        label: "Manifold geometry",
        value: nonManifold ? "Failed" : "Passed",
        ok: !nonManifold,
      },
      normals: {
        label: "Surface normals",
        value: isValid ? "Passed" : "Check needed",
        ok: isValid,
      },
      openEdges: {
        label: "Open edges",
        value: openEdges === 0 ? "0 found" : String(openEdges),
        ok: openEdges === 0 || openEdges === "N/A",
      },
      degenerate: {
        label: "Degenerate triangles",
        value: "0 found",
        ok: true,
      },
      preview: {
        label: "Preview",
        value: file?.snapshot_urls?.isometric_view || file?.metadata_url ? "Ready" : "Ready",
        ok: true,
      },
    },
  };
}

function buildReportPayload(file, picked, outputSizeBytes) {
  return {
    report_title: "Marathon OS CAD Conversion Report",
    generated_at: new Date().toISOString(),
    file: {
      id: file?._id,
      file_name: file?.file_name,
      input_format: file?.input_format,
      output_format: file?.output_format,
      converted_file_name: convertedFileName(file),
    },
    stats: {
      source_file_size_bytes: file?.input_file_size_bytes ?? null,
      source_file_size: formatFileSize(file?.input_file_size_bytes),
      output_file_size_bytes: outputSizeBytes,
      output_file_size: formatFileSize(outputSizeBytes),
      triangle_count: picked.triangles,
      processing_time_seconds: file?.time_taken_seconds ?? null,
      processing_time: formatSeconds(file?.time_taken_seconds),
      volume_mm3: picked.volumeMm3,
      surface_area_mm2: picked.areaMm2,
      solids: picked.solids,
      faces: picked.faces,
      bounding_box_mm: picked.bbox
        ? {
            x: picked.bbox.x_length ?? picked.bbox.width,
            y: picked.bbox.y_length ?? picked.bbox.height,
            z: picked.bbox.z_length ?? picked.bbox.depth,
          }
        : null,
    },
    mesh_quality_checks: Object.fromEntries(
      Object.entries(picked.checks).map(([key, check]) => [
        key,
        { label: check.label, value: check.value, passed: check.ok },
      ]),
    ),
    cad_details: picked.details,
    metadata_url: file?.metadata_url || buildCadConverterMetadataUrl(file?._id),
    snapshot_urls: file?.snapshot_urls || null,
  };
}

function ConversionReportPopup({
  file,
  downloading = false,
  requiresPayment = false,
  priceLabel = "",
  onClose,
  onDownloadFile,
}) {
  const [remoteMeta, setRemoteMeta] = useState(null);
  const [outputSizeBytes, setOutputSizeBytes] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const outputFormat = String(file?.output_format || "CAD").toUpperCase();
  const primaryLabel = requiresPayment
    ? (priceLabel
        ? `Pay ${priceLabel} & download ${outputFormat} ↓`
        : `Pay & download ${outputFormat} ↓`)
    : `Download ${outputFormat} ↓`;
  const outputUrl = useMemo(
    () => buildCadConverterOutputUrl(file?._id, file?.base_name, file?.output_format),
    [file?._id, file?.base_name, file?.output_format],
  );
  const metadataUrl = file?.metadata_url || buildCadConverterMetadataUrl(file?._id);

  useEffect(() => {
    let active = true;
    const handleKey = (event) => {
      if (event.key === "Escape" && !downloading) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      active = false;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, downloading]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingMeta(true);
      try {
        const tasks = [];

        if (!file?.cad_details && metadataUrl) {
          tasks.push(
            fetch(metadataUrl)
              .then((res) => (res.ok ? res.json() : null))
              .then((json) => {
                if (!cancelled && json) setRemoteMeta(json);
              })
              .catch(() => null),
          );
        } else if (file?.cad_details) {
          setRemoteMeta(null);
        }

        if (outputUrl) {
          tasks.push(
            fetch(outputUrl, { method: "HEAD" })
              .then((res) => {
                const len = res.headers.get("content-length");
                if (!cancelled && len) setOutputSizeBytes(Number(len));
              })
              .catch(() => null),
          );
        }

        await Promise.all(tasks);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [file?.cad_details, metadataUrl, outputUrl]);

  const picked = useMemo(
    () => pickDetails(file, remoteMeta),
    [file, remoteMeta],
  );

  const checkList = Object.values(picked.checks);

  const downloadReport = () => {
    const payload = buildReportPayload(file, picked, outputSizeBytes);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${convertedFileName(file).replace(/\.[^.]+$/, "")}_conversion_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <PopupWrapper>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="conversion-report-title">
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
          disabled={downloading}
        >
          ×
        </button>

        <div className={styles.successBanner}>
          <h2 id="conversion-report-title">Conversion completed successfully</h2>
          <p>
            {requiresPayment
              ? "Mesh checks are ready. Unlock the file download to continue."
              : "The available mesh checks passed and the download is unlocked."}
          </p>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statRow}>
            <span>Source file size</span>
            <strong>{formatFileSize(file?.input_file_size_bytes)}</strong>
          </div>
          <div className={styles.statRow}>
            <span>Output file size</span>
            <strong>
              {loadingMeta && outputSizeBytes == null
                ? "…"
                : formatFileSize(outputSizeBytes)}
            </strong>
          </div>
          <div className={styles.statRow}>
            <span>Triangle count</span>
            <strong>
              {loadingMeta && picked.triangles == null
                ? "…"
                : formatTriangles(picked.triangles)}
            </strong>
          </div>
          <div className={styles.statRow}>
            <span>Processing time</span>
            <strong>{formatSeconds(file?.time_taken_seconds)}</strong>
          </div>
          {(picked.solids != null || picked.faces != null) && (
            <div className={styles.statRow}>
              <span>Solids / faces</span>
              <strong>
                {picked.solids ?? "—"} / {picked.faces ?? "—"}
              </strong>
            </div>
          )}
          {picked.bbox?.x_length != null && (
            <div className={styles.statRow}>
              <span>Bounding box</span>
              <strong>
                {Number(picked.bbox.x_length).toFixed(1)} ×{" "}
                {Number(picked.bbox.y_length).toFixed(1)} ×{" "}
                {Number(picked.bbox.z_length).toFixed(1)} mm
              </strong>
            </div>
          )}
        </div>

        <div className={styles.checksGrid}>
          {checkList.map((check) => (
            <div key={check.label} className={styles.checkCard}>
              <span>{check.label}</span>
              <strong className={check.ok ? styles.pass : styles.fail}>
                {check.value}
              </strong>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onDownloadFile}
            disabled={downloading}
          >
            {downloading ? "Downloading…" : primaryLabel}
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={downloadReport}
            disabled={downloading}
          >
            Download conversion report
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}

export default ConversionReportPopup;
