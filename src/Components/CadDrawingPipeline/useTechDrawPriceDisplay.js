"use client";

import { useEffect, useState } from "react";
import {
  fetchTechDrawPriceDisplay,
  getTechDrawPriceDisplay,
} from "@/api/cadDrawingPipelineApi";

/** Live admin `techdraw_upload_price` for converter marketing / CTAs. */
export default function useTechDrawPriceDisplay(initialPrices) {
  const [prices, setPrices] = useState(
    () => initialPrices || getTechDrawPriceDisplay(),
  );

  useEffect(() => {
    let cancelled = false;
    fetchTechDrawPriceDisplay().then((next) => {
      if (!cancelled) setPrices(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return prices;
}
