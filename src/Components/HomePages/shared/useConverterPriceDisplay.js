"use client";

import { useEffect, useState } from "react";
import {
  fetchConverterPricingInfo,
  getSinglePriceLabelFromInfo,
} from "@/lib/converterPricing";

export default function useConverterPriceDisplay(initialLabel = "") {
  const [priceLabel, setPriceLabel] = useState(initialLabel);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetchConverterPricingInfo()
        .then((info) => {
          if (cancelled) return;
          const label = getSinglePriceLabelFromInfo(info);
          if (label) setPriceLabel(label);
        })
        .catch(() => {});
    };

    load();
    // Retry once after anonymous uuid is written.
    const timer = setTimeout(load, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return { priceLabel };
}
