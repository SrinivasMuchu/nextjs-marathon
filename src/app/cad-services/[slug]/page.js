import { redirect } from 'next/navigation'
import CadPartnerPortal from '@/Components/CadServicePages/CadPartnerPortal/CadPartnerPortal'

const PARTNER_SLUG_RE = /^([a-f\d]{24})(?:@index\.html)?$/i

export function generateMetadata({ params }) {
  const slug = decodeURIComponent(params?.slug || '')
  const match = slug.match(PARTNER_SLUG_RE)
  return {
    title: match
      ? 'CAD Partner Request | Marathon OS'
      : 'Partner request not found | Marathon OS',
    description: 'Agency partner view for a Marathon CAD service request.',
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  }
}

export default function CadPartnerPage({ params }) {
  const slug = decodeURIComponent(params?.slug || '')

  // Legacy prototype-style URLs → clean Next.js path
  if (/^[a-f\d]{24}@index\.html$/i.test(slug)) {
    const id = slug.replace(/@index\.html$/i, '')
    redirect(`/cad-services/${id}`)
  }

  const match = slug.match(PARTNER_SLUG_RE)
  const requestId = match?.[1] || ''

  return <CadPartnerPortal requestId={requestId} />
}
