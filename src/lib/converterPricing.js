import {
  formatConverterPrice,
  getConverterPricingInfo,
} from "@/api/converterPaymentApi";

export const CONVERTER_GST_RATE = 0.18;
export const CONVERTER_FREE_SIZE_LIMIT_BYTES = 5 * 1024 * 1024;
export const CONVERTER_FREE_SIZE_LIMIT_MB = 5;
// Each user's first N completed conversions download free (enforced by the backend).
export const CONVERTER_FREE_CONVERSIONS_PER_USER = 2;

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

// Admin-selected converter free plans (admin_controls.converter_free_plan).
export const CONVERTER_FREE_PLAN_FIRST_N = "FIRST_N_FREE";
export const CONVERTER_FREE_PLAN_SIZE_LIMIT = "SIZE_LIMIT";

/** Which free plan the backend says is active (defaults to first-N). */
export function getConverterFreePlan(pricingInfo) {
  return pricingInfo?.free_plan === CONVERTER_FREE_PLAN_SIZE_LIMIT
    ? CONVERTER_FREE_PLAN_SIZE_LIMIT
    : CONVERTER_FREE_PLAN_FIRST_N;
}

export function isSizeLimitPlan(pricingInfo) {
  return getConverterFreePlan(pricingInfo) === CONVERTER_FREE_PLAN_SIZE_LIMIT;
}

export function getFreeSizeLimitMb(pricingInfo) {
  const mb = Number(pricingInfo?.free_size_limit_mb);
  return Number.isFinite(mb) && mb >= 0 ? mb : CONVERTER_FREE_SIZE_LIMIT_MB;
}

/** How many free conversions the signed-in user has left (FIRST_N_FREE plan). */
export function getFreeConversionsRemaining(pricingInfo) {
  const remaining = Number(pricingInfo?.free_conversions_remaining);
  return Number.isFinite(remaining) && remaining > 0 ? remaining : 0;
}

export function getFreeConversionsPerUser(pricingInfo) {
  const perUser = Number(pricingInfo?.free_conversions_per_user);
  return Number.isFinite(perUser) && perUser >= 0 ? perUser : CONVERTER_FREE_CONVERSIONS_PER_USER;
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * One-sentence description of the active free plan, for pricing notes and popups.
 * Falls back to the first-N wording when pricing-info is not loaded yet.
 * Free downloads and credits are only used when the user clicks Download.
 */
export function getConverterFreePlanSummary(pricingInfo) {
  if (pricingInfo?.conversion_free) {
    return "All conversions download free right now.";
  }
  if (isSizeLimitPlan(pricingInfo)) {
    const mb = getFreeSizeLimitMb(pricingInfo);
    return `Files under ${mb} MB convert and download free. Larger files cost 1 credit, used only when you download.`;
  }
  const perUser = getFreeConversionsPerUser(pricingInfo);
  if (perUser === 0) {
    return "Converting is free. Each file costs 1 credit, used only when you click Download.";
  }
  return `Your first ${plural(perUser, "file download")} ${perUser === 1 ? "is" : "are"} free, any file size. From file ${perUser + 1} on, each download costs 1 credit or a one-time payment, charged only when you click Download.`;
}

/**
 * Short status line telling the signed-in user where they stand on free downloads,
 * e.g. "You have 1 of 2 free downloads left." Returns "" when not applicable
 * (size-limit plan, everything free, or pricing-info not loaded).
 */
export function getFreeConversionsStatusText(pricingInfo) {
  if (!pricingInfo || pricingInfo.conversion_free || isSizeLimitPlan(pricingInfo)) return "";
  if (pricingInfo.free_conversions_remaining === undefined || pricingInfo.free_conversions_remaining === null) return "";
  const perUser = getFreeConversionsPerUser(pricingInfo);
  if (perUser === 0) return "";
  const remaining = getFreeConversionsRemaining(pricingInfo);
  if (remaining > 0) {
    return `You have ${remaining} of ${plural(perUser, "free download")} left. Free downloads are used before your credits.`;
  }
  return `You've used your ${plural(perUser, "free download")}. Each new file now costs 1 credit or a one-time payment when you download it.`;
}

/**
 * Message shown for a file that will download free under the active plan,
 * e.g. "Free — downloading this file uses 1 of your 2 free downloads. ..."
 */
export function getFreeConversionUseText(pricingInfo) {
  if (!pricingInfo || pricingInfo.conversion_free) {
    return "This conversion is free to download — no payment needed.";
  }
  if (isSizeLimitPlan(pricingInfo)) {
    return `This file is under ${getFreeSizeLimitMb(pricingInfo)} MB — convert and download free.`;
  }
  if (pricingInfo.free_conversions_remaining === undefined || pricingInfo.free_conversions_remaining === null) {
    return "This conversion is free to download — no payment needed.";
  }
  const perUser = getFreeConversionsPerUser(pricingInfo);
  const remaining = getFreeConversionsRemaining(pricingInfo);
  return `Free — downloading this file will use 1 of your ${plural(perUser, "free download")} (${remaining} left). Nothing is used until you click Download, and re-downloading it later stays free.`;
}

/**
 * One short line for small pricing boxes: a bold `lead` with the user's status and a short `rest`.
 * e.g. { lead: "2 of 2 free downloads left", rest: "— any file size. Then $2.99 or 1 credit per file." }
 */
export function getConverterFreePlanShortNote(pricingInfo, priceLabel = "") {
  const paid = priceLabel ? `${priceLabel} or 1 credit` : "1 credit";
  if (pricingInfo?.conversion_free) {
    return { lead: "All downloads are free right now.", rest: "" };
  }
  if (isSizeLimitPlan(pricingInfo)) {
    return {
      lead: `Free under ${getFreeSizeLimitMb(pricingInfo)} MB.`,
      rest: `Bigger files: ${paid}.`,
    };
  }
  const perUser = getFreeConversionsPerUser(pricingInfo);
  if (perUser === 0) {
    return { lead: `${paid} per file,`, rest: "charged when you download." };
  }
  const known = pricingInfo
    && pricingInfo.free_conversions_remaining !== undefined
    && pricingInfo.free_conversions_remaining !== null;
  if (!known) {
    return {
      lead: `First ${plural(perUser, "download")} free`,
      rest: `— any file size. Then ${paid} per file.`,
    };
  }
  const remaining = getFreeConversionsRemaining(pricingInfo);
  if (remaining > 0) {
    return {
      lead: `${remaining} of ${perUser} free downloads left`,
      rest: `— any file size. Then ${paid} per file.`,
    };
  }
  return {
    lead: "Free downloads used.",
    rest: `Each file is ${paid}, charged when you download.`,
  };
}

/** Short heading for the pricing section, e.g. "First 2 downloads free, simple credits after". */
export function getConverterFreePlanHeading(pricingInfo) {
  if (isSizeLimitPlan(pricingInfo)) {
    return `Free under ${getFreeSizeLimitMb(pricingInfo)} MB, simple credits above`;
  }
  const perUser = getFreeConversionsPerUser(pricingInfo);
  if (perUser === 0) return "Simple credits, no subscription";
  return `First ${plural(perUser, "download")} free, simple credits after`;
}

/** Subtitle for the credit-plans popup. */
export function getCreditPlansSubtitle(pricingInfo) {
  const tail = "buy credits — 1 credit downloads any file, any size, and credits never expire. A credit is used only when you click Download.";
  if (isSizeLimitPlan(pricingInfo)) {
    return `Files under ${getFreeSizeLimitMb(pricingInfo)} MB are always free. For everything else, ${tail}`;
  }
  const perUser = getFreeConversionsPerUser(pricingInfo);
  if (perUser === 0) return `To download, ${tail}`;
  return `Your first ${plural(perUser, "file download")} ${perUser === 1 ? "is" : "are"} free (any size) and are used before your credits. After that, ${tail}`;
}

/** Message shown for a conversion that will need payment under the active plan. */
export function getPaidConversionReasonText(pricingInfo) {
  if (isSizeLimitPlan(pricingInfo)) {
    return `Files ${getFreeSizeLimitMb(pricingInfo)} MB and above are`;
  }
  const perUser = getFreeConversionsPerUser(pricingInfo);
  if (perUser === 0) return "This download is";
  return `You've used your ${plural(perUser, "free download")}. Downloading this file costs`;
}

/** Badge text for a converted file in history, from converter_pricing. */
export function getConverterFileBadge(converterPricing) {
  if (!converterPricing) return null;
  if (converterPricing.paid) return "Paid";
  if (converterPricing.uses_free_slot) {
    const left = Number(converterPricing.free_slots_remaining);
    return Number.isFinite(left) ? `Free · ${left} left` : "Free";
  }
  if (converterPricing.is_free) return "Free";
  return buildConverterPricingDisplay(converterPricing).totalLabel;
}

/**
 * Download button label that says what a click will use:
 * a free download, 1 credit, or a payment. Nothing is used before the click.
 */
export function getConverterDownloadLabel({ converterPricing, converterCredits, downloadText = "Download" }) {
  if (!converterPricing || converterPricing.paid) return downloadText;
  if (converterPricing.uses_free_slot) return `${downloadText} · free`;
  if (converterPricing.is_free) return downloadText;
  if (Number(converterCredits) > 0) return `${downloadText} · uses 1 credit`;
  const price = buildConverterPricingDisplay(converterPricing).totalLabel;
  return price ? `${downloadText} · ${price} or 1 credit` : `${downloadText} · 1 credit`;
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
  if (isSizeLimitPlan(pricingInfo)) {
    const size = Number(inputFileSizeBytes);
    if (!Number.isFinite(size) || size <= 0) return false;
    return size < getFreeSizeLimitMb(pricingInfo) * 1024 * 1024;
  }
  return getFreeConversionsRemaining(pricingInfo) > 0;
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
