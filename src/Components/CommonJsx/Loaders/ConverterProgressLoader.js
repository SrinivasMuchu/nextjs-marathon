"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import { contextState } from "../ContextProvider";
import {
  buildConverterPricingDisplay,
  CONVERTER_FREE_SIZE_LIMIT_BYTES,
  fetchConverterPricingInfo,
} from "@/lib/converterPricing";
import cube from "./Cube.json";
import styles from "./ConverterProgressLoader.module.css";

const stageByStatus = {
  UPLOADINGFILE: 0,
  PENDING: 1,
  PROCESSING: 2,
  PROCESSED: 2,
  UPLOADING: 3,
  COMPLETED: 4,
};

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

function ConverterProgressLoader({
  uploadingMessage,
  uploadProgressPercent,
  fileName,
  outputFormat,
  fileSize,
  isSampleFile,
}) {
  const { user } = useContext(contextState);
  const [priceLabel, setPriceLabel] = useState("");
  const currentStage = stageByStatus[uploadingMessage] ?? 1;
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

  const progress = useMemo(() => {
    if (uploadingMessage === "UPLOADINGFILE") {
      return Math.min(100, Math.max(0, Number(uploadProgressPercent) || 0));
    }
    return {
      PENDING: 35,
      PROCESSING: 64,
      PROCESSED: 76,
      UPLOADING: 90,
      COMPLETED: 100,
    }[uploadingMessage] ?? 25;
  }, [uploadProgressPercent, uploadingMessage]);

  const stages = [
    "File uploaded",
    "Preparing conversion",
    `Converting to ${outputLabel}`,
    "Validating output",
  ];

  if (uploadingMessage === "FAILED") {
    return (
      <main className={styles.page}>
        <section className={styles.failure} role="alert">
          <span className={styles.failureIcon}>!</span>
          <h1>Conversion failed</h1>
          <p>Something went wrong while converting your file. Please try again.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.layout} aria-live="polite">
        <div className={styles.visualColumn}>
          <Lottie
            animationData={cube}
            loop
            className={styles.animation}
            aria-label="Converting file"
          />
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressMeta}>
            <strong>{progress}%</strong>
            <span>{uploadingMessage === "UPLOADINGFILE" ? "Uploading…" : "Converting…"}</span>
          </div>
        </div>

        <div className={styles.contentColumn}>
          <header>
            <h1>Converting {fileName || "your CAD file"}</h1>
            <p className={styles.fileMeta}>
              {inputFormat} → {outputLabel}
              {sizeLabel ? ` · ${sizeLabel}` : ""}
            </p>
          </header>

          <ol className={styles.steps}>
            {stages.map((label, index) => {
              const complete =
                uploadingMessage === "COMPLETED" || index < currentStage;
              const active =
                uploadingMessage !== "COMPLETED" && index === currentStage;
              return (
                <li
                  key={label}
                  className={`${styles.step} ${complete ? styles.complete : ""} ${
                    active ? styles.active : ""
                  }`}
                >
                  <span className={styles.stepIcon} aria-hidden>
                    {complete ? "✓" : ""}
                  </span>
                  <span>{label}{active ? "…" : ""}</span>
                </li>
              );
            })}
          </ol>

          {user?.email && (
            <div className={styles.notice}>
              Feel free to close this tab — we&apos;ll email{" "}
              <strong>{user.email}</strong> the moment it&apos;s ready. Your file
              will be waiting in <strong>Dashboard → CAD Converter</strong>.
            </div>
          )}

          <p className={styles.pricing}>
            {isFree ? (
              <>This conversion is <strong>free</strong> — no payment is required.</>
            ) : (
              <>
                {priceLabel ? <>Price locked at <strong>{priceLabel}</strong></> : "Price is locked"}
                {" — "}you&apos;ll only pay when you download.
              </>
            )}
          </p>
        </div>
      </section>
    </main>
  );
}

export default ConverterProgressLoader;
