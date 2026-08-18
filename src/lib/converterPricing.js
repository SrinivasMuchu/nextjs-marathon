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

export function areConverterSubscriptionsEnabled(info) {
  return info?.converter_subscriptions !== false;
}

/** Prefer GST-inclusive single download label from pricing-info payload. */
export function getSinglePriceLabelFromInfo(info) {
  const fromPricing = buildConverterPricingDisplay(info?.pricing).totalLabel;
  if (fromPricing) return fromPricing;
  return info?.single_price_label || "";
}

function applyDynamicPackOffers(packs) {
  if (!Array.isArray(packs) || !packs.length) return [];

  let saveBestId = null;
  let bestSave = -1;
  let bestCredits = -1;
  packs.forEach((pack) => {
    const save = Number(pack.save_percent) || 0;
    const credits = Number(pack.credits) || 0;
    if (save > bestSave || (save === bestSave && credits > bestCredits)) {
      bestSave = save;
      bestCredits = credits;
      saveBestId = pack.id;
    }
  });
  if (bestSave <= 0) saveBestId = null;

  const byCredits = [...packs].sort(
    (a, b) => (Number(a.credits) || 0) - (Number(b.credits) || 0),
  );
  let popular = byCredits[Math.floor(byCredits.length / 2)] || byCredits[0];
  if (popular && popular.id === saveBestId && byCredits.length > 1) {
    const idx = byCredits.findIndex((pack) => pack.id === popular.id);
    popular = byCredits[idx - 1] || byCredits[idx + 1] || popular;
  }
  const featuredId = popular?.id || null;

  return packs.map((pack, index) => {
    const featured = pack.id === featuredId;
    const saveBest = pack.id === saveBestId && Number(pack.save_percent) > 0;
    const last = index === packs.length - 1;
    const savePercent = Number(pack.save_percent) || 0;
    return {
      ...pack,
      featured,
      save_best: saveBest,
      save_label: saveBest
        ? `Save ${savePercent}% · best value`
        : savePercent > 0
          ? `Save ${savePercent}%`
          : "Save 0%",
      variant: featured || last || saveBest ? "solid" : "outline",
    };
  });
}

export function getConverterPacksFromInfo(info) {
  if (!areConverterSubscriptionsEnabled(info)) return [];
  const packs = Array.isArray(info?.packs) ? info.packs : [];
  const singleTotal = Number(buildConverterPricingDisplay(info?.pricing).total) || 0;
  const mapped = packs.map((pack) => {
    const display = buildConverterPricingDisplay(pack?.pricing || pack);
    const credits = Math.max(1, Math.floor(Number(pack?.credits) || 1));
    const perCreditTotal =
      Math.round((Number(display.total) / credits) * 100) / 100;
    const savePercent = singleTotal > 0
      ? Math.max(0, Math.round((1 - perCreditTotal / singleTotal) * 100))
      : Number(pack.save_percent) || 0;
    return {
      ...pack,
      credits,
      price_label: display.totalLabel || pack?.price_label,
      per_credit_label: `${formatConverterPrice(perCreditTotal, display.currency)} each`,
      price_with_gst: display.total,
      save_percent: savePercent,
    };
  });
  return applyDynamicPackOffers(mapped);
}

export function getMaxSavePercentFromInfo(info) {
  const fromApi = Number(info?.max_save_percent);
  if (Number.isFinite(fromApi) && fromApi > 0) return Math.round(fromApi);
  const packs = getConverterPacksFromInfo(info);
  return packs.reduce((max, pack) => Math.max(max, Number(pack.save_percent) || 0), 0);
}

export function getFeaturedConverterPack(packs) {
  if (!Array.isArray(packs) || !packs.length) return null;
  return packs.find((pack) => pack.featured) || packs[0] || null;
}

export { formatConverterPrice };
