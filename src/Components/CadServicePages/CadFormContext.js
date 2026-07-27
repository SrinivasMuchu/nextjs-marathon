'use client'

import React, { createContext, useContext, useState } from 'react'
import CadServiceFormPopup from './CadServiceFormPopup/CadServiceFormPopup'
import { sendGAtagEvent } from '@/common.helper'
import { CAD_HIRE_DESIGNER_EVENT } from '@/config'

const CadFormContext = createContext(null)

export function CadFormProvider({ children }) {
  const [showPopup, setShowPopup] = useState(false)

  const openFormPopup = (source = 'unknown') => {
    sendGAtagEvent({
      event_name: 'hire_designer_form_popup_open',
      event_category: CAD_HIRE_DESIGNER_EVENT,
      open_source: source,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    })
    setShowPopup(true)
  }
  const closeFormPopup = () => setShowPopup(false)

  return (
    <CadFormContext.Provider value={{ openFormPopup, closeFormPopup, showPopup }}>
      {children}
      {showPopup && <CadServiceFormPopup onClose={closeFormPopup} />}
    </CadFormContext.Provider>
  )
}



export function useCadForm() {
  const ctx = useContext(CadFormContext)
  if (!ctx) {
    return { openFormPopup: () => {}, closeFormPopup: () => {}, showPopup: false }
  }
  return ctx
}

/** True when already on the CAD Services marketing page (same-route clicks should open the quote popup, not hard-navigate / scroll to top). */
export function isCadServicesRoute(pathname) {
  if (!pathname) return false
  return pathname.replace(/\/$/, '') === '/cad-services'
}

/** Public vendor partner page (Next.js): /cad-services/<requestId> */
export function getCadPartnerPagePath(requestId) {
  const id = String(requestId || '').trim().replace(/@index\.html$/i, '')
  if (!id) return ''
  return `/cad-services/${id}`
}

/** Absolute partner page URL for emails / exports. */
export function getCadPartnerPageUrl(requestId, origin = 'https://marathon-os.com') {
  const path = getCadPartnerPagePath(requestId)
  if (!path) return ''
  const base = String(origin || 'https://marathon-os.com').replace(/\/$/, '')
  return `${base}${path}`
}

/** True for the public vendor partner request page (not the marketing /cad-services page). */
export function isCadPartnerPageRoute(pathname) {
  if (!pathname) return false
  const clean = pathname.replace(/\/$/, '')
  if (clean === '/cad-services') return false
  return /^\/cad-services\/[a-f\d]{24}(?:@index\.html)?$/i.test(clean)
}
