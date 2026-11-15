'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { GOOGLE_ADSENSE_CLIENT_ID } from '@/config'

export const AD_FREE_PREFIXES = ['/tools', '/dashboard', '/cad-convertor']

export function isAdFreePath(pathname) {
  const path = pathname || ''
  return AD_FREE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

export default function AdSenseScript() {
  const pathname = usePathname() || ''
  if (isAdFreePath(pathname)) return null
  return (
    <Script
      id="google-adsense"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  )
}
