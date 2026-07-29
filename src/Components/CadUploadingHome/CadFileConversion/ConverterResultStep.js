"use client";

import React, { useMemo } from "react";
import HomeTopNav from "@/Components/HomePages/HomepageTopNav/HomeTopNav";
import { buildCadConverterSnapshotUrl } from "@/config";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";
import ConverterFunnelStepper from "./ConverterFunnelStepper";
import ConverterNotifyBanner from "./ConverterNotifyBanner";
import styles from "./ConverterFunnel.module.css";

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size < 0) return "—";
  if (size === 0) return "0 B";
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
  return `${n.toFixed(1)} seconds`;
}

function pickChecks(job) {
  const report = job?.mesh_report || {};
  const details = job?.cad_details || {};
  const meshQuality = details.mesh_quality || {};
  const validity = details.validity || {};

  const watertight =
    report.watertight ??
    validity.is_closed ??
    meshQuality.is_solid;
  const openEdges = report.open_edges ?? 0;
  const degenerate = report.degenerate_triangles ?? 0;
  const normalsOk = report.surface_normals_ok !== false;
  const manifold = report.manifold !== false && !meshQuality.has_non_manifolds;

  return [
    {
      label: "Watertight mesh",
      value: watertight ? "Passed" : watertight == null ? "N/A" : "Failed",
      ok: watertight !== false,
    },
    {
      label: "Manifold geometry",
      value: manifold ? "Passed" : "Failed",
      ok: Boolean(manifold),
    },
    {
      label: "Surface normals",
      value: normalsOk ? "Passed" : "Check needed",
      ok: normalsOk,
    },
    {
      label: "Open edges",
      value: `${openEdges} found`,
      ok: Number(openEdges) === 0,
    },
    {
      label: "Degenerate triangles",
      value: `${degenerate} found`,
      ok: Number(degenerate) === 0,
    },
    {
      label: "Preview",
      value: "Ready",
      ok: true,
    },
  ];
}

function ConverterResultStep({
  job,
  fileName,
  isFree,
  pricing,
  userEmail,
  downloading = false,
  onContinuePay,
  onDownload,
  onDownloadReport,
}) {
  const outputFormat = String(job?.output_format || "stl").toUpperCase();
  const inputFormat = String(job?.input_format || "").toUpperCase();
  const outName =
    (fileName || job?.file_name || "converted")
      .replace(/\.[^.]+$/, "") + `.${String(job?.output_format || "stl").toLowerCase()}`;
  const priceLabel = buildConverterPricingDisplay(pricing).totalLabel;
  const checks = useMemo(() => pickChecks(job), [job]);
  const checksPassed =
    job?.mesh_report?.checks_passed !== false &&
    checks.every((c) => c.ok || c.value === "N/A");

  const triangles =
    job?.mesh_report?.triangle_count ??
    job?.cad_details?.tessellation?.triangles ??
    job?.cad_details?.geometry_stats?.num_triangles;

  const previewUrl =
    job?.snapshot_urls?.isometric_view ||
    (job?.folderId || job?._id
      ? buildCadConverterSnapshotUrl(job.folderId || job._id, "isometric_view")
      : null);

  const funnelStep = isFree ? "download" : "pay";

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <HomeTopNav />
      <main className={styles.page}>
        <div className={styles.shell}>
          <ConverterFunnelStepper currentStep={funnelStep === "download" ? "download" : "convert"} />
          <ConverterNotifyBanner email={userEmail} />

          <section className={styles.card}>
            <div className={styles.fileRow}>
              <div className={styles.fileMeta}>
                <span className={styles.fileBadge}>{outputFormat}</span>
                <div>
                  <strong>{outName}</strong>
                  <span>
                    Generated from {fileName || job?.file_name || "source file"}
                  </span>
                </div>
              </div>
              {isFree ? (
                <span className={styles.badgeFree}>Free download</span>
              ) : checksPassed ? (
                <span className={styles.badgeFree}>Checks passed</span>
              ) : null}
            </div>

            <div className={styles.resultLayout}>
              <div className={styles.previewPane}>
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt={`${outName} preview`} />
                ) : (
                  <div className={styles.wireframe} aria-hidden />
                )}
              </div>

              <div>
                <div className={styles.successBox}>
                  <h2>Conversion completed successfully</h2>
                  <p>
                    {isFree
                      ? "The available mesh checks passed and the download is unlocked."
                      : "The available mesh checks passed. Review the output before manufacturing."}
                  </p>
                </div>

                <div className={styles.stats}>
                  <div className={styles.statRow}>
                    <span>Source format</span>
                    <strong>{inputFormat || "—"}</strong>
                  </div>
                  <div className={styles.statRow}>
                    <span>Source file size</span>
                    <strong>{formatFileSize(job?.input_file_size_bytes)}</strong>
                  </div>
                  <div className={styles.statRow}>
                    <span>Output format</span>
                    <strong>Binary {outputFormat}</strong>
                  </div>
                  <div className={styles.statRow}>
                    <span>Output file size</span>
                    <strong>{formatFileSize(job?.output_file_size_bytes)}</strong>
                  </div>
                  <div className={styles.statRow}>
                    <span>Triangle count</span>
                    <strong>{formatTriangles(triangles)}</strong>
                  </div>
                  <div className={styles.statRow}>
                    <span>Mesh quality</span>
                    <strong style={{ textTransform: "capitalize" }}>
                      {job?.tessellation_quality || "Balanced"}
                    </strong>
                  </div>
                  <div className={styles.statRow}>
                    <span>Processing time</span>
                    <strong>{formatSeconds(job?.time_taken_seconds)}</strong>
                  </div>
                </div>

                <div className={styles.checks}>
                  {checks.map((check) => (
                    <div key={check.label} className={styles.check}>
                      <span>{check.label}</span>
                      <strong className={check.ok ? styles.checkPass : styles.checkFail}>
                        {check.value}
                      </strong>
                    </div>
                  ))}
                </div>

                {isFree ? (
                  <div className={styles.actions} style={{ marginTop: 0 }}>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={onDownload}
                      disabled={downloading}
                      style={{ width: "100%" }}
                    >
                      {downloading ? "Downloading…" : `Download ${outputFormat} ↓`}
                    </button>
                    {onDownloadReport ? (
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={onDownloadReport}
                        style={{ width: "100%" }}
                      >
                        Download conversion report
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className={styles.payCard}>
                    <header>
                      <div>
                        <strong>Unlock this {outputFormat} download</strong>
                        <div style={{ color: "#8b8497", fontSize: 12, marginTop: 2 }}>
                          One-time payment · no subscription
                        </div>
                      </div>
                      <strong style={{ fontSize: 22 }}>{priceLabel}</strong>
                    </header>
                    <ul>
                      <li>
                        Download the{" "}
                        {formatFileSize(job?.output_file_size_bytes)} {outputFormat}
                      </li>
                      <li>Conversion report included</li>
                      <li>File available for 24 hours</li>
                    </ul>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={onContinuePay}
                      style={{ width: "100%" }}
                    >
                      Continue to secure payment →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ConverterResultStep;
