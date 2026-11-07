"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  fetchConverterPricingInfo,
  getFreeConversionsPerUser,
  getSinglePriceLabelFromInfo,
  isSizeLimitPlan,
} from "@/lib/converterPricing";
import useTechDrawPriceDisplay from "./useTechDrawPriceDisplay";
import styles from "./CadDrawingPipeline.module.css";

const DRAWING_SET = [
  "Front, top, side and isometric views",
  "Section views and dimensions",
  "Title block in your chosen standard",
  "PDF, DXF, SVG, PNG and FCStd files",
  "Ready in under 4 minutes",
];

const PRODUCTION = [
  "Dimensions chosen for manufacturing",
  "Tolerances, fits and GD&T",
  "Thread callouts, finish and material notes",
  "Your company title block and drawing numbers",
  "Native DWG, PDF or the format you need",
];

function Check() {
  return (
    <svg className={styles.pricingCheck} viewBox="0 0 18 18" aria-hidden>
      <circle cx="9" cy="9" r="9" fill="#7C5CFF" />
      <path
        d="M5.1 9.2 7.5 11.6 12.9 6.2"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function offerFromInfo(info) {
  if (!info) return null;
  return {
    priceLabel: getSinglePriceLabelFromInfo(info) || "",
    freeCount: getFreeConversionsPerUser(info),
    allFree: Boolean(info.conversion_free),
    sizeLimit: isSizeLimitPlan(info),
  };
}

function ConverterFootnote({ offer }) {
  const href = "/tools/3d-cad-file-converter";
  if (!offer) {
    return (
      <>
        Converting files between formats instead? <Link href={href}>Standard conversions</Link>
      </>
    );
  }
  if (offer.allFree) {
    return (
      <>
        Converting files between formats instead?{" "}
        <Link href={href}>Standard conversions are free right now</Link>.
      </>
    );
  }
  if (!offer.priceLabel) {
    return (
      <>
        Converting files between formats instead? <Link href={href}>Standard conversions</Link>
      </>
    );
  }
  if (offer.sizeLimit || !offer.freeCount) {
    return (
      <>
        Converting files between formats instead?{" "}
        <Link href={href}>{`Standard conversions start at ${offer.priceLabel}`}</Link>.
      </>
    );
  }
  const files = offer.freeCount === 1 ? "file is" : "files are";
  return (
    <>
      Converting files between formats instead?{" "}
      <Link href={href}>{`Standard conversions start at ${offer.priceLabel}`}</Link>{`, and your first ${offer.freeCount} ${files} free.`}
    </>
  );
}

export default function CadDrawingPipelinePricing({ initialPrices, initialConverterOffer }) {
  const { totalLabel } = useTechDrawPriceDisplay(initialPrices);
  const price = totalLabel || "";
  const [converterOffer, setConverterOffer] = useState(() => initialConverterOffer || null);

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (!cancelled) setConverterOffer(offerFromInfo(info));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToUpload = useCallback(() => {
    document.getElementById("cad-pipeline-upload")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <section className={styles.pricingBand} id="pricing" aria-labelledby="cad-pipeline-pricing-title">
      <div className={styles.pricingInner}>
        <p className={styles.pricingEyebrow}>Pricing</p>
        <h2 id="cad-pipeline-pricing-title" className={styles.pricingTitle}>
          One price per drawing set
        </h2>
        <p className={styles.pricingIntro}>
          Pay {price} once per model, charged only when you download. Every format is included,
          there&apos;s no subscription, and every purchase comes with an invoice.
        </p>

        <div className={styles.pricingGrid}>
          <article className={styles.pricingCardDark}>
            <p className={styles.pricingKicker}>Drawing set</p>
            <p className={styles.pricingAmount}>{price}</p>
            <p className={styles.pricingUnit}>per STEP or STP model</p>
            <ul className={styles.pricingFeatures}>
              {DRAWING_SET.map((item) => (
                <li key={item}>
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button type="button" className={styles.pricingPrimary} onClick={scrollToUpload}>
              Generate 2D drawings
            </button>
          </article>

          <article className={styles.pricingCardLight}>
            <p className={styles.pricingKickerMuted}>Production drawing</p>
            <p className={styles.pricingQuoted}>Quoted</p>
            <p className={styles.pricingByline}>by a Marathon OS CAD designer</p>
            <ul className={styles.pricingFeatures}>
              {PRODUCTION.map((item) => (
                <li key={item}>
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link className={styles.pricingOutline} href="/cad-services">
              Request a quote
            </Link>
          </article>
        </div>

        <p className={styles.pricingFoot}>
          <ConverterFootnote offer={converterOffer} />
        </p>
      </div>
    </section>
  );
}
