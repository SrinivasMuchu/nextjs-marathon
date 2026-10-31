import { unstable_cache } from 'next/cache'
import { BASE_URL } from '@/config'
import {
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
  buildConverterPricingDisplay,
  getConverterFreePlanSummary,
  getConverterFreePlanHeading,
} from '@/lib/converterPricing'

// Fallback when pricing-info cannot be loaded; live text follows the admin free plan.
const PRICING_NOTE = getConverterFreePlanSummary(null)
const PRICING_HEADING = getConverterFreePlanHeading(null)

/** Anonymous catalog UUID so public pricing-info can render in HTML without a browser session. */
const CONVERTER_CATALOG_UUID = 'cafec0de-0000-4000-8000-00000cad0001'

function emptyPricing() {
  return {
    packs: [],
    singlePriceLabel: '',
    singlePrice: 0,
    currency: 'USD',
    pricingNote: PRICING_NOTE,
    pricingHeading: PRICING_HEADING,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: PRICING_NOTE,
    },
  }
}

async function fetchPublicConverterPricingInfo() {
  if (!BASE_URL) throw new Error('App API URL is not configured.')
  const res = await fetch(`${BASE_URL}/v1/cad/converter/pricing-info`, {
    headers: {
      Accept: 'application/json',
      'user-uuid': CONVERTER_CATALOG_UUID,
    },
    next: { revalidate: 300 },
  })
  const payload = await res.json()
  if (!payload?.meta?.success) {
    throw new Error(payload?.meta?.message || 'Failed to load converter pricing.')
  }
  return payload.data
}

async function loadConverterPricingForRender() {
  try {
    const info = await fetchPublicConverterPricingInfo()
    const packs = getConverterPacksFromInfo(info)
    const display = buildConverterPricingDisplay(info?.pricing)
    const singlePriceLabel = getSinglePriceLabelFromInfo(info)
    const singlePrice = Number(display.total) || 0
    const currency = display.currency || 'USD'
    const pricingNote = getConverterFreePlanSummary(info)

    return {
      packs,
      singlePriceLabel,
      singlePrice,
      currency,
      pricingNote,
      pricingHeading: getConverterFreePlanHeading(info),
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: currency,
        lowPrice: '0',
        highPrice: String(singlePrice || 0),
        description: pricingNote,
      },
    }
  } catch {
    return emptyPricing()
  }
}

export const getConverterPricingForRender = unstable_cache(
  loadConverterPricingForRender,
  ['converter-pricing-for-render'],
  { revalidate: 300 },
)
