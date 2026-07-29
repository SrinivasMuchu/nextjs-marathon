"use client";

import React, { useMemo, useState } from "react";
import HomeTopNav from "@/Components/HomePages/HomepageTopNav/HomeTopNav";
import {
  TESSELLATION_PRESETS,
  TRIANGLE_TARGET_OPTIONS,
  resolveMeshExportSettings,
} from "@/lib/converterMeshSettings";
import {
  buildConverterPricingDisplay,
  isConverterConversionFree,
} from "@/lib/converterPricing";
import ConverterFunnelStepper from "./ConverterFunnelStepper";
import ConverterNotifyBanner from "./ConverterNotifyBanner";
import styles from "./ConverterFunnel.module.css";

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return "";
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function ConverterConfigureStep({
  file,
  outputFormat,
  pricingInfo,
  isSampleFile,
  userEmail,
  onChooseAnother,
  onConvert,
  embedded = false,
}) {
  const [quality, setQuality] = useState("balanced");
  const [triangleTarget, setTriangleTarget] = useState("auto");
  const [customMax, setCustomMax] = useState("100000");

  const inputExt = String(file?.name || "")
    .slice(String(file?.name || "").lastIndexOf(".") + 1)
    .toUpperCase();
  const outLabel = String(outputFormat || "stl").toUpperCase();
  const sizeLabel = formatFileSize(file?.size);
  const isFree = isConverterConversionFree({
    pricingInfo,
    isSampleFile,
    inputFileSizeBytes: file?.size,
  });
  const priceLabel = useMemo(
    () => buildConverterPricingDisplay(pricingInfo?.pricing).totalLabel,
    [pricingInfo],
  );

  const handleSubmit = () => {
    const settings = resolveMeshExportSettings({
      tessellationQuality: quality,
      triangleTarget,
      customMaxTriangles: customMax,
    });
    onConvert(settings);
  };

  const body = (
    <main className={embedded ? styles.pageEmbedded : styles.page}>
      <div className={embedded ? styles.shellEmbedded : styles.shell}>
        <h1 className={styles.title} style={embedded ? { fontSize: 24, textAlign: "left" } : undefined}>
          Choose the {outLabel} output settings
        </h1>
        <p className={styles.subtitle} style={embedded ? { textAlign: "left", margin: "8px 0 20px" } : undefined}>
          The selected settings control mesh detail, processing time and output size.
        </p>
        <ConverterFunnelStepper currentStep="configure" />
        <ConverterNotifyBanner email={userEmail} />

        <section className={styles.card}>
          <div className={styles.fileRow}>
            <div className={styles.fileMeta}>
              <span className={styles.fileBadge}>{inputExt || "CAD"}</span>
              <div>
                <strong>{file?.name || "CAD file"}</strong>
                <span>
                  {[sizeLabel, `${inputExt} file accepted`].filter(Boolean).join(" · ")}
                </span>
              </div>
            </div>
            <div className={styles.priceBlock}>
              <strong>{isFree ? "Free" : priceLabel || "$2.99"}</strong>
              <span>
                {isFree ? "No payment required" : "Pay only after successful conversion"}
              </span>
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <h2 className={styles.sectionTitle}>Tessellation quality</h2>
              <p className={styles.sectionHint}>
                Choose how closely the {outLabel} mesh follows the {inputExt || "CAD"} surfaces.
              </p>
              <div className={styles.qualityRow} role="radiogroup" aria-label="Tessellation quality">
                {Object.values(TESSELLATION_PRESETS).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={quality === preset.id}
                    className={`${styles.qualityCard} ${
                      quality === preset.id ? styles.qualitySelected : ""
                    }`}
                    onClick={() => setQuality(preset.id)}
                  >
                    <strong>{preset.label}</strong>
                    <span>{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Triangle target</h2>
              <p className={styles.sectionHint}>
                Set an optional upper target. Actual output may vary by geometry.
              </p>
              <label className={styles.fieldLabel} htmlFor="triangle-target">
                Maximum triangle target
              </label>
              <select
                id="triangle-target"
                className={styles.select}
                value={triangleTarget}
                onChange={(e) => setTriangleTarget(e.target.value)}
              >
                {TRIANGLE_TARGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {triangleTarget === "custom" ? (
                <input
                  className={styles.input}
                  style={{ marginTop: 10 }}
                  type="number"
                  min={1000}
                  step={1000}
                  value={customMax}
                  onChange={(e) => setCustomMax(e.target.value)}
                  aria-label="Custom maximum triangles"
                />
              ) : null}
              <p className={styles.hintBox}>
                Higher detail or a larger triangle target can increase conversion time and output
                size.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryBtn} onClick={onChooseAnother}>
              Choose another file
            </button>
            <div>
              <button type="button" className={styles.primaryBtn} onClick={handleSubmit}>
                Convert and generate report →
              </button>
              <p className={styles.actionHint}>No payment is taken at this stage.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );

  if (embedded) return body;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <HomeTopNav />
      {body}
    </div>
  );
}

export default ConverterConfigureStep;
