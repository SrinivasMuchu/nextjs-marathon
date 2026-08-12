import {
  formatConverterPrice,
  getConverterPricingInfo,
} from "@/api/converterPaymentApi";

export const CONVERTER_GST_RATE = 0.18;
export const CONVERTER_FREE_SIZE_LIMIT_BYTES = 5 * 1024 * 1024;
export const CONVERTER_FREE_SIZE_LIMIT_MB = 5;

/** Build display labels from API pricing object or base amount. */
export function buildConverterPricingDisplay(pricing, currency = "USD") {
  const base = Number(pricing?.base_price ?? pricing?.price ?? 0);
  const gstAmount = Number(
    pricing?.gst_amount ?? Math.round(base * CONVERTER_GST_RATE * 100) / 100,
  );
  const total = Number(
    pricing?.total ?? pricing?.price_with_gst ?? base + gstAmount,
  );
  const cur = pricing?.currency || currency;

  return {
    base,
    gstRate: pricing?.gst_rate ?? CONVERTER_GST_RATE,
    gstAmount,
    total,
    currency: cur,
    baseLabel: formatConverterPrice(base, cur),
    gstLabel: formatConverterPrice(gstAmount, cur),
    totalLabel: formatConverterPrice(total, cur),
  };
}

/** Whether this conversion should show as free before download. */
export function isConverterConversionFree({
  pricingInfo,
  isSampleFile = false,
  inputFileSizeBytes,
}) {
  if (isSampleFile) return true;
  if (!pricingInfo) return false;
  if (pricingInfo.conversion_free) return true;
  const size = Number(inputFileSizeBytes);
  if (!Number.isFinite(size) || size <= 0) return false;
  const limitMb = Number(pricingInfo.free_size_limit_mb ?? CONVERTER_FREE_SIZE_LIMIT_MB);
  const limitBytes = limitMb * 1024 * 1024;
  return size < limitBytes;
}

export async function fetchConverterPricingInfo() {
  return getConverterPricingInfo();
}

/** Prefer GST-inclusive single download label from pricing-info payload. */
export function getSinglePriceLabelFromInfo(info) {
  const fromPricing = buildConverterPricingDisplay(info?.pricing).totalLabel;
  if (fromPricing) return fromPricing;
  return info?.single_price_label || "";
}

export function getConverterPacksFromInfo(info) {
  const packs = Array.isArray(info?.packs) ? info.packs : [];
  return packs.map((pack) => {
    const display = buildConverterPricingDisplay(pack?.pricing || pack);
    const credits = Math.max(1, Math.floor(Number(pack?.credits) || 1));
    const perCreditTotal =
      Math.round((Number(display.total) / credits) * 100) / 100;
    return {
      ...pack,
      price_label: display.totalLabel || pack?.price_label,
      per_credit_label: `${formatConverterPrice(perCreditTotal, display.currency)} each`,
      price_with_gst: display.total,
    };
  });
}

export function getFeaturedConverterPack(packs) {
  if (!Array.isArray(packs) || !packs.length) return null;
  return packs.find((pack) => pack.featured) || packs[0] || null;
}

export { formatConverterPrice };
