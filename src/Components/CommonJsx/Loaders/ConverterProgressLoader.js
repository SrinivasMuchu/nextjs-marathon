"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { contextState } from "../ContextProvider";
import {
  buildConverterPricingDisplay,
  CONVERTER_FREE_SIZE_LIMIT_BYTES,
  fetchConverterPricingInfo,
} from "@/lib/converterPricing";
import styles from "./ConverterProgressLoader.module.css";

const MESH_EXTS = new Set(["stl", "obj", "ply", "off", "3dm"]);
const SOLID_EXTS = new Set(["step", "stp", "iges", "igs", "brep", "brp"]);

function normalizeExt(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/^\./, "");
}

function buildDirectionSteps(inputFormat, outputFormat) {
  const input = normalizeExt(inputFormat);
  const output = normalizeExt(outputFormat);
  const out = (output || "output").toUpperCase();
  const meshIn = MESH_EXTS.has(input);
  const solidIn = SOLID_EXTS.has(input);
  const meshOut = MESH_EXTS.has(output);
  const solidOut = SOLID_EXTS.has(output);

  if (meshIn && solidOut) {
    return [
      { id: "UPLOAD", label: "Upload source file" },
      { id: "READING", label: "Read mesh geometry" },
      { id: "REPAIRING", label: "Repair mesh topology" },
      { id: "RECONSTRUCTING", label: "Reconstruct solid surfaces" },
      { id: "GENERATING_MODEL", label: `Generate ${out} model` },
      { id: "PREVIEW_REPORT", label: "Generate preview & report" },
    ];
  }

  if (solidIn && meshOut) {
    let readLabel = "Read solid geometry";
    if (input === "step" || input === "stp") readLabel = "Read STEP geometry";
    else if (input === "iges" || input === "igs") readLabel = "Read IGES geometry";
    else if (input === "brep" || input === "brp") readLabel = "Read BREP geometry";
    return [
      { id: "UPLOAD", label: "Upload source file" },
      { id: "READING", label: readLabel },
      { id: "BUILD_BREP", label: "Build BREP model" },
      { id: "TESSELLATING", label: "Tessellate surfaces" },
      { id: "VALIDATE_MESH", label: "Validate mesh" },
      { id: "PREVIEW_REPORT", label: "Generate preview & report" },
    ];
  }

  return [
    { id: "UPLOAD", label: "Upload source file" },
    { id: "READING", label: "Read CAD geometry" },
    { id: "REPAIRING", label: "Prepare geometry" },
    { id: "RECONSTRUCTING", label: "Convert geometry" },
    { id: "GENERATING_MODEL", label: `Generate ${out} model` },
    { id: "PREVIEW_REPORT", label: "Generate preview & report" },
  ];
}

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return "";
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function fileFormat(fileName) {
  if (!fileName?.includes(".")) return "CAD";
  return fileName.slice(fileName.lastIndexOf(".") + 1).toUpperCase();
}

function buildLocalUploadSteps(uploadProgressPercent, inputFormat, outputFormat) {
  const uploadPct = Math.min(100, Math.max(0, Number(uploadProgressPercent) || 0));
  return buildDirectionSteps(inputFormat, outputFormat).map((step, index) => {
    if (index === 0) {
      return {
        ...step,
        status: uploadPct >= 100 ? "complete" : "active",
        ...(uploadPct < 100 ? { percent: uploadPct } : {}),
      };
    }
    return { ...step, status: "waiting" };
  });
}

function stepStatusLabel(step) {
  if (step.status === "complete") return "Complete";
  if (step.status === "failed") return "Failed";
  if (step.status === "active") {
    const pct = Number(step.percent);
    if (Number.isFinite(pct) && pct > 0) {
      return `${Math.min(99, Math.max(1, Math.round(pct)))}%`;
    }
    return "In progress";
  }
  return "Waiting";
}

function ConverterProgressLoader({
  uploadingMessage,
  uploadProgressPercent,
  progressPercent,
  conversionSteps,
  fileName,
  outputFormat,
  fileSize,
  isSampleFile,
  onCancel,
}) {
  const { user } = useContext(contextState);
  const [priceLabel, setPriceLabel] = useState("");
  const inputFormat = fileFormat(fileName);
  const outputLabel = String(outputFormat || "output").toUpperCase();
  const sizeLabel = formatFileSize(fileSize);
  const isFree =
    Boolean(isSampleFile) ||
    (Number.isFinite(Number(fileSize)) &&
      Number(fileSize) > 0 &&
      Number(fileSize) < CONVERTER_FREE_SIZE_LIMIT_BYTES);

  useEffect(() => {
    if (isFree) return;
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (!cancelled) {
          setPriceLabel(buildConverterPricingDisplay(info?.pricing).totalLabel);
        }
      })
      .catch(() => {
        if (!cancelled) setPriceLabel("");
      });
    return () => {
      cancelled = true;
    };
  }, [isFree]);

  const steps = useMemo(() => {
    if (Array.isArray(conversionSteps) && conversionSteps.length > 0) {
      return conversionSteps;
    }
    if (uploadingMessage === "UPLOADINGFILE") {
      return buildLocalUploadSteps(uploadProgressPercent, inputFormat, outputFormat);
    }
    // Job queued but first poll not back yet
    return buildDirectionSteps(inputFormat, outputFormat).map((step, index) => ({
      ...step,
      status: index === 0 ? "complete" : index === 1 ? "active" : "waiting",
    }));
  }, [conversionSteps, uploadingMessage, uploadProgressPercent, outputFormat, inputFormat]);

  const progress = useMemo(() => {
    if (uploadingMessage === "UPLOADINGFILE") {
      return Math.min(100, Math.max(0, Number(uploadProgressPercent) || 0));
    }
    const apiPct = Number(progressPercent);
    if (Number.isFinite(apiPct) && apiPct >= 0) {
      return Math.min(100, Math.max(0, Math.round(apiPct)));
    }
    if (uploadingMessage === "COMPLETED") return 100;
    return 0;
  }, [uploadProgressPercent, uploadingMessage, progressPercent]);

  if (uploadingMessage === "FAILED") {
    return (
      <main className={styles.page}>
        <section className={styles.card} role="alert">
          <h1 className={styles.title}>Conversion failed</h1>
          <p className={styles.subtitle}>
            Something went wrong while converting your file. Please try again.
          </p>
          {onCancel ? (
            <div className={styles.actions}>
              <button type="button" className={styles.primaryBtn} onClick={onCancel}>
                Try another file
              </button>
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-live="polite">
        <div className={styles.progressCenter}>
          <div className={styles.spinner} aria-hidden />
          <h1 className={styles.title}>
            Converting {fileName || "your CAD file"}
          </h1>
          <p className={styles.subtitle}>
            Detailed geometry may take a little longer. You will review the result before
            payment.
            {sizeLabel ? ` · ${inputFormat} → ${outputLabel} · ${sizeLabel}` : ""}
          </p>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressPct}>{progress}%</p>
        </div>

        <ol className={styles.stageList}>
          {steps.map((step) => (
            <li
              key={step.id || step.label}
              className={`${styles.stageItem} ${
                step.status === "complete"
                  ? styles.stageComplete
                  : step.status === "active"
                    ? styles.stageActive
                    : styles.stageWaiting
              }`}
            >
              <span>{step.label}</span>
              <strong>{stepStatusLabel(step)}</strong>
            </li>
          ))}
        </ol>

        {onCancel ? (
          <div className={styles.actions}>
            <button type="button" className={styles.dangerBtn} onClick={onCancel}>
              Cancel conversion
            </button>
          </div>
        ) : null}

        {user?.email ? (
          <p className={styles.notify}>
            Feel free to close this tab — we&apos;ll email <strong>{user.email}</strong> when
            it&apos;s ready.
          </p>
        ) : null}

        <p className={styles.pricing}>
          {isFree ? (
            <>
              This conversion is <strong>free</strong> — no payment is required.
            </>
          ) : (
            <>
              {priceLabel ? (
                <>
                  Price locked at <strong>{priceLabel}</strong>
                </>
              ) : (
                "Price is locked"
              )}
              {" — "}
              you&apos;ll only pay when you download.
            </>
          )}
        </p>
      </section>
    </main>
  );
}

export default ConverterProgressLoader;
