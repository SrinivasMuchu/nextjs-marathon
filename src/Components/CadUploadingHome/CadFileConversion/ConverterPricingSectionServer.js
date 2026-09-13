import { getConverterPricingForRender } from '@/lib/converterPricingServer'
import ConverterPricingSection from './ConverterPricingSection'

function ConverterPricingJsonLd({ packs, singlePrice, currency, pricingNote }) {
  if (!packs.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'CAD conversion credits',
    description: pricingNote,
    itemListElement: packs.map((pack, index) => ({
      '@type': 'Offer',
      position: index + 1,
      name: pack.name,
      description: pack.description || `${pack.credits} conversion credits`,
      ...(pack.price_with_gst != null && pack.price_with_gst !== ''
        ? { price: String(pack.price_with_gst), priceCurrency: currency }
        : {}),
    })),
  }

  if (singlePrice > 0) {
    schema.itemListElement.push({
      '@type': 'Offer',
      position: packs.length + 1,
      name: 'Single conversion download',
      description: pricingNote,
      price: String(singlePrice),
      priceCurrency: currency,
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

async function ConverterPricingSectionServer() {
  const pricing = await getConverterPricingForRender()

  return (
    <>
      <ConverterPricingJsonLd
        packs={pricing.packs}
        singlePrice={pricing.singlePrice}
        currency={pricing.currency}
        pricingNote={pricing.pricingNote}
      />
      <ConverterPricingSection
        initialPacks={pricing.packs}
        initialSinglePriceLabel={pricing.singlePriceLabel}
        pricingNote={pricing.pricingNote}
      />
    </>
  )
}

export default ConverterPricingSectionServer
