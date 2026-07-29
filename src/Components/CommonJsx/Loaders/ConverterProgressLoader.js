"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { contextState } from "../ContextProvider";
import {
  buildConverterPricingDisplay,
  CONVERTER_FREE_SIZE_LIMIT_BYTES,
  fetchConverterPricingInfo,
} from "@/lib/converterPricing";
import {
  CONVERT_STAGES,
  stageIndexFromStatus,
  stageProgressPercent,
} from "@/lib/converterMeshSettings";
import ConverterFunnelStepper from "@/Components/CadUploadingHome/CadFileConversion/ConverterFunnelStepper";
import ConverterNotifyBanner from "@/Components/CadUploadingHome/CadFileConversion/ConverterNotifyBanner";
import styles from "@/Components/CadUploadingHome/CadFileConversion/ConverterFunnel.module.css";
import { toast } from "react-toastify";

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

const STAGE_TOAST = {
  UPLOADINGFILE: "Upload started — once done, you will be notified.",
  PENDING: "Queued — once done, you will be notified.",
  READING: "Reading geometry — once done, you will be notified.",
  PROCESSING: "Converting — once done, you will be notified.",
  TESSELLATING: "Tessellating surfaces — once done, you will be notified.",
  INTEGRITY_CHECK: "Running mesh checks — once done, you will be notified.",
  PREVIEW_REPORT: "Generating preview & report — once done, you will be notified.",
  UPLOADING: "Finalizing output — once done, you will be notified.",
};

function ConverterProgressLoader({
  uploadingMessage,
  convertStage,
  uploadProgressPercent,
  fileName,
  outputFormat,
  fileSize,
  isSampleFile,
  onCancel,
  onPreviewCompleted,
}) {
  const { user } = useContext(contextState);
  const [priceLabel, setPriceLabel] = useState("");
  const lastToastKey = useRef("");
  const stageKey = String(convertStage || uploadingMessage || "").toUpperCase();
  const currentStage = stageIndexFromStatus(uploadingMessage, convertStage);
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

  useEffect(() => {
    if (!stageKey || stageKey === "COMPLETED" || stageKey === "FAILED") return;
    if (lastToastKey.current === stageKey) return;
    lastToastKey.current = stageKey;
    const msg = STAGE_TOAST[stageKey] || "Working — once done, you will be notified.";
    toast.info(msg, { toastId: `convert-stage-${stageKey}` });
  }, [stageKey]);

  const progress = useMemo(
    () => stageProgressPercent(uploadingMessage, convertStage, uploadProgressPercent),
    [uploadProgressPercent, uploadingMessage, convertStage],
  );

  if (uploadingMessage === "FAILED") {
    return (
      <main className={styles.page}>
        <section className={styles.card} style={{ maxWidth: 560, margin: "48px auto" }}>
          <h1 className={styles.title} style={{ fontSize: 28 }}>
            Conversion failed
          </h1>
          <p className={styles.subtitle}>
            Something went wrong while converting your file. Please try again.
          </p>
          {onCancel ? (
            <div className={styles.actions} style={{ justifyContent: "center" }}>
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
      <div className={styles.shell}>
        <ConverterFunnelStepper currentStep="convert" />
        <ConverterNotifyBanner email={user?.email} />

        <section className={styles.card}>
          <div className={styles.progressCenter}>
            <div className={styles.spinner} aria-hidden />
            <h1 className={styles.title} style={{ fontSize: "clamp(24px, 3vw, 32px)" }}>
              Converting {fileName || "your CAD file"}
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: 0 }}>
              Detailed geometry may take a little longer. You will review the result before
              payment.
              {sizeLabel ? ` · ${inputFormat} → ${outputLabel} · ${sizeLabel}` : ""}
            </p>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <p style={{ marginTop: 10, color: "#7c3aed", fontWeight: 700 }}>{progress}%</p>
          </div>

          <ol className={styles.stageList}>
            {CONVERT_STAGES.map((stage, index) => {
              const complete =
                uploadingMessage === "COMPLETED" || index < currentStage;
              const active =
                uploadingMessage !== "COMPLETED" && index === currentStage;
              let statusLabel = "Waiting";
              if (complete) statusLabel = "Complete";
              else if (active) {
                statusLabel =
                  stage.id === "TESSELLATING" && progress > 0
                    ? `${Math.min(99, Math.max(1, progress))}%`
                    : "In progress";
              }
              return (
                <li
                  key={stage.id}
                  className={`${styles.stageItem} ${
                    complete
                      ? styles.stageComplete
                      : active
                        ? styles.stageActive
                        : styles.stageWaiting
                  }`}
                >
                  <span>{stage.label}</span>
                  <strong>{statusLabel}</strong>
                </li>
              );
            })}
          </ol>

          <div className={styles.actions} style={{ justifyContent: "center" }}>
            {onPreviewCompleted ? (
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onPreviewCompleted}
              >
                Preview completed state
              </button>
            ) : null}
            {onCancel ? (
              <button type="button" className={styles.dangerBtn} onClick={onCancel}>
                Cancel conversion
              </button>
            ) : null}
          </div>

          <p className={styles.subtitle} style={{ marginTop: 18, marginBottom: 0 }}>
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
                {" — "}you&apos;ll only pay when you download.
              </>
            )}
          </p>
        </section>
      </div>
    </main>
  );
}

export default ConverterProgressLoader;
