"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { contextState } from "../ContextProvider";
import {
  buildConverterPricingDisplay,
  CONVERTER_FREE_SIZE_LIMIT_BYTES,
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getFeaturedConverterPack,
  getSinglePriceLabelFromInfo,
  areConverterSubscriptionsEnabled,
} from "@/lib/converterPricing";
import { hasConverterCredits } from "@/lib/converterCredits";
import styles from "./ConverterProgressLoader.module.css";
import cube from "./Cube.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });


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
  const [packs, setPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState("");
  const [showPackBanner, setShowPackBanner] = useState(false);
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(true);
  const inputFormat = fileFormat(fileName);
  const outputLabel = String(outputFormat || "output").toUpperCase();
  const sizeLabel = formatFileSize(fileSize);
  const isFree =
    Boolean(isSampleFile) ||
    (Number.isFinite(Number(fileSize)) &&
      Number(fileSize) > 0 &&
      Number(fileSize) < CONVERTER_FREE_SIZE_LIMIT_BYTES);
  const alreadyCovered =
    isFree ||
    (subscriptionsEnabled && hasConverterCredits(user?.converter_credits));

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        const enabled = areConverterSubscriptionsEnabled(info);
        setSubscriptionsEnabled(enabled);
        setPriceLabel(buildConverterPricingDisplay(info?.pricing).totalLabel);
        setPacks(enabled ? getConverterPacksFromInfo(info) : []);
        setSinglePriceLabel(getSinglePriceLabelFromInfo(info));
        if (!enabled || isFree) setShowPackBanner(false);
      })
      .catch(() => {
        if (!cancelled) {
          setPriceLabel("");
          setPacks([]);
          setSinglePriceLabel("");
        }
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

  const showCreditsUpsell = !alreadyCovered && subscriptionsEnabled;
  const featuredPack = getFeaturedConverterPack(packs);


  if (showCreditsUpsell && showPackBanner && packs.length) {
    return (
      <main className={styles.page}>
        <section
          className={styles.packBanner}
          aria-labelledby="converter-pack-banner-heading"
        >
          <div className={styles.packBannerInner}>
            <div className={styles.packBannerTop}>
              <button
                type="button"
                className={styles.packBannerBack}
                onClick={() => setShowPackBanner(false)}
              >
                ← Back to conversion
              </button>
              <div className={styles.packBannerHeader}>
                <p className={styles.packBannerEyebrow}>Pricing</p>
                <h2 id="converter-pack-banner-heading" className={styles.packBannerHeading}>
                  Pay as you go, cheaper by the pack
                </h2>
                <p className={styles.packBannerDescription}>
                  Files under 5 MB are always free. For everything else, buy credits —{" "}
                  <strong>
                    1 credit downloads any file, any size, and credits never expire.
                  </strong>
                </p>
              </div>
            </div>

            <div className={styles.packBannerGrid}>
              {packs.map((pack) => (
                <article
                  key={pack.id}
                  className={`${styles.packCard} ${
                    pack.featured ? styles.packCardFeatured : ""
                  }`}
                >
                  {pack.featured ? (
                    <span className={styles.packPopularBadge}>★ Most popular</span>
                  ) : null}
                  <p className={styles.packTier}>{pack.name}</p>
                  <p className={styles.packCredits}>
                    <span className={styles.packCreditCount}>{pack.credits}</span>
                    <span className={styles.packCreditLabel}>credits</span>
                  </p>
                  <div className={styles.packPriceRow}>
                    <p className={styles.packPrice}>{pack.price_label}</p>
                    <p className={styles.packPerCredit}>{pack.per_credit_label}</p>
                  </div>
                  <span
                    className={`${styles.packSaveBadge} ${
                      pack.save_best ? styles.packSaveBadgeBest : ""
                    }`}
                  >
                    {pack.save_label}
                  </span>
                  <p className={styles.packCopy}>{pack.description}</p>
                  <button
                    type="button"
                    className={`${styles.packCta} ${
                      pack.variant === "solid" ? styles.packCtaSolid : ""
                    }`}
                    onClick={() => setShowPackBanner(false)}
                  >
                    {pack.cta}
                  </button>
                </article>
              ))}
            </div>

            {singlePriceLabel ? (
              <p className={styles.packBannerFooter}>
                Just need one?{" "}
                <button
                  type="button"
                  className={styles.packBannerFooterLink}
                  onClick={() => setShowPackBanner(false)}
                >
                  Pay {singlePriceLabel} for a single download
                </button>
                {" · No subscription · Credits never expire · Invoice on every purchase"}
              </p>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={`${styles.layout} ${showCreditsUpsell ? styles.layoutSplit : ""}`}>
        <section className={styles.card} aria-live="polite">
          <div className={styles.progressCenter}>
            <div className={styles.cubeLoader} aria-hidden>
              <Lottie animationData={cube} loop style={{ width: 160, height: 160 }} />
            </div>
            <h1 className={styles.title}>
              Converting {fileName || "your CAD file"}
            </h1>
            <p className={styles.subtitle}>
              Detailed geometry may take a little longer.
              {alreadyCovered
                ? " You can download as soon as it finishes."
                : " You will review the result before payment."}
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
            ) : subscriptionsEnabled && hasConverterCredits(user?.converter_credits) ? (
              <>
                Covered by your credits — <strong>no payment needed</strong> for this download.
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

        {showCreditsUpsell && featuredPack ? (
          <aside className={styles.creditsCard} aria-labelledby="buy-credits-while-waiting">
            <h2 id="buy-credits-while-waiting" className={styles.creditsTitle}>
              Buy credits while you wait
            </h2>
            <p className={styles.creditsSubtitle}>
              Optional — grab a pack now and this file downloads itself the second it&apos;s
              done.
            </p>

            <div className={styles.offerBox}>
              <div className={styles.offerCopy}>
                <p className={styles.offerEyebrow}>
                  {featuredPack.name}
                  {featuredPack.featured ? " · Most popular" : ""}
                </p>
                <p className={styles.offerLine}>
                  {featuredPack.credits} credits · {featuredPack.price_label}
                </p>
              </div>
              <span className={styles.offerBadge}>{featuredPack.save_label}</span>
            </div>

            <button
              type="button"
              className={styles.creditsCta}
              onClick={() => setShowPackBanner(true)}
              disabled={!packs.length}
            >
              Choose a pack →
            </button>

            <hr className={styles.creditsDivider} />

            {singlePriceLabel ? (
              <p className={styles.creditsFooter}>
                Just need this one?{" "}
                <button
                  type="button"
                  className={styles.creditsLink}
                  onClick={() => setShowPackBanner(true)}
                >
                  Pay {singlePriceLabel}
                </button>{" "}
                for a single download. Charged only after validation passes.
              </p>
            ) : null}
          </aside>
        ) : null}
      </div>
    </main>
  );
}

export default ConverterProgressLoader;
