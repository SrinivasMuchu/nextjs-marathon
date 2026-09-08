import { BASE_URL } from "@/config";
import {
  fetchTechDrawPriceDisplay,
  getTechDrawPriceDisplay,
} from "@/api/cadDrawingPipelineApi";

const TWO_D_LIBRARY_API_BASE = "/v1/cad/2d-library";
const GST_RATE = 0.18;

export function formatTwoDUsd(amount, currency = "USD") {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0) return "";
  if (n === 0) return "Free";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function pickPricingBlock(info, { version = true } = {}) {
  if (!info || typeof info !== "object") return null;
  if (version) {
    return info.version_pricing || info;
  }
  return info.legacy_pricing || info;
}

function isPricingFree(info, { version = true } = {}) {
  if (!info) return false;
  if (version) {
    return Boolean(info.two_d_library_version_free || info.version_pricing?.free);
  }
  return Boolean(info.two_d_library_free || info.legacy_pricing?.free);
}

/** GST-inclusive display labels from `/v1/cad/2d-library/pricing-info`. */
export function buildTwoDLibraryPricingDisplay(info, { version = true } = {}) {
  if (isPricingFree(info, { version })) {
    return {
      base: 0,
      total: 0,
      currency: "USD",
      baseLabel: "Free",
      totalLabel: "Free",
      priceLabel: "Free",
    };
  }

  const block = pickPricingBlock(info, { version });
  const currency = block?.currency || info?.currency || "USD";
  const total = Number(
    block?.price_with_gst ??
      block?.price ??
      info?.price_with_gst ??
      info?.price,
  );
  const baseRaw = Number(
    block?.base_price ??
      block?.two_d_library_price ??
      block?.two_d_library_version_price ??
      info?.two_d_library_version_price ??
      info?.two_d_library_price,
  );
  const base =
    Number.isFinite(baseRaw) && baseRaw >= 0
      ? baseRaw
      : Number.isFinite(total) && total > 0
        ? Math.round((total / (1 + GST_RATE)) * 100) / 100
        : 0;
  const resolvedTotal =
    Number.isFinite(total) && total >= 0
      ? total
      : base > 0
        ? Math.round(base * (1 + GST_RATE) * 100) / 100
        : 0;

  const totalLabel = formatTwoDUsd(resolvedTotal, currency);
  const baseLabel = formatTwoDUsd(base, currency);

  return {
    base,
    total: resolvedTotal,
    currency,
    baseLabel,
    totalLabel,
    priceLabel: totalLabel || block?.price_label || info?.price_label || "",
  };
}

/** Per-design label with optional catalog fallback from pricing-info. */
export function getTwoDPriceLabelForDesign(design, fallbackLabel = "") {
  const price = Number(design?.["2d_price"]);
  if (Number.isFinite(price) && price > 0) {
    return formatTwoDUsd(price);
  }
  if (design?.["2d_price"] === 0 || design?.["2d_price"] === "0") {
    return "Free";
  }
  return fallbackLabel || "";
}

export async function fetchTwoDLibraryPricingInfo() {
  if (!BASE_URL) {
    throw new Error("App API URL is not configured.");
  }

  const url = `${BASE_URL}${TWO_D_LIBRARY_API_BASE}/pricing-info`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`2D library pricing HTTP ${res.status}`);
  }

  const data = await res.json();
  if (!data?.meta?.success) {
    throw new Error(data?.meta?.message || "Failed to load 2D library pricing.");
  }

  return data.data;
}

export async function fetchTwoDLibraryListPriceDisplay() {
  try {
    const info = await fetchTwoDLibraryPricingInfo();
    return buildTwoDLibraryPricingDisplay(info, { version: true });
  } catch (err) {
    if (typeof console !== "undefined") {
      console.warn("[2d-library] pricing-info failed:", err?.message || err);
    }
    return buildTwoDLibraryPricingDisplay(null);
  }
}

export { fetchTechDrawPriceDisplay, getTechDrawPriceDisplay };
