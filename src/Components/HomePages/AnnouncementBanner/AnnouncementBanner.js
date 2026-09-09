"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import {
  fetchConverterPricingInfo,
  getSinglePriceLabelFromInfo,
} from "@/lib/converterPricing";
import styles from "./AnnouncementBanner.module.css";

function AnnouncementBanner() {
  const [converterLabel, setConverterLabel] = useState("");
  const [drawingLabel, setDrawingLabel] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([fetchConverterPricingInfo(), fetchTechDrawPriceDisplay()]).then(
      ([converterResult, drawingResult]) => {
        if (cancelled) return;
        if (converterResult.status === "fulfilled") {
          const label = getSinglePriceLabelFromInfo(converterResult.value);
          if (label) setConverterLabel(label);
        }
        if (drawingResult.status === "fulfilled" && drawingResult.value?.totalLabel) {
          setDrawingLabel(drawingResult.value.totalLabel);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <span>
          <BadgeCheck size={14} aria-hidden="true" />
          <span className={styles.wide}>
            {converterLabel
              ? `Standard conversions from ${converterLabel}`
              : "Standard conversions from live pricing"}
          </span>
          <span className={styles.compact}>
            {converterLabel ? `Convert from ${converterLabel}` : "Live pricing"}
          </span>
        </span>
        <span className={styles.divider} aria-hidden="true" />
        <span>
          <span className={styles.wide}>
            {drawingLabel
              ? `STEP or STP to 2D drawings for ${drawingLabel}`
              : "STEP or STP to 2D drawings"}
          </span>
          <span className={styles.compact}>
            {drawingLabel ? `2D drawings ${drawingLabel}` : "2D drawings"}
          </span>
        </span>
        <Link href="/#pricing" className={styles.link}>
          <span className={styles.wide}>See conversion pricing</span>
          <span className={styles.compact}>Pricing</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default AnnouncementBanner;
