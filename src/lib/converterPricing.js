import {
  formatConverterPrice,
  getConverterPricingInfo,
} from "@/api/converterPaymentApi";

export const CONVERTER_GST_RATE = 0.18;

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

/** Multi-line breakdown for tooltips / detail rows. */
export function formatConverterPriceBreakdownLines(pricing, currency = "USD") {
  const d = buildConverterPricingDisplay(pricing, currency);
  const gstPct = Math.round(d.gstRate * 100);
  return {
    baseLine: `Base Price: ${d.baseLabel}`,
    taxLine: `Tax ${gstPct}%: ${d.gstLabel}`,
    totalLine: `Total: ${d.totalLabel}`,
    ...d,
  };
}

/** Whether this conversion row should show as free before download. */
export function isConverterConversionFree({
  pricingInfo,
  isSampleFile = false,
}) {
  if (isSampleFile) return true;
  if (!pricingInfo) return false;
  if (pricingInfo.conversion_free) return true;
  return Boolean(pricingInfo.first_conversion_available);
}

export async function fetchConverterPricingInfo() {
  return getConverterPricingInfo();
}

export { formatConverterPrice };
