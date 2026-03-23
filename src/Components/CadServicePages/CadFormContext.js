'use client'

import React, { createContext, useContext, useState } from 'react'
import CadServiceFormPopup from './CadServiceFormPopup/CadServiceFormPopup'

const CadFormContext = createContext(null)

export function CadFormProvider({ children }) {
  const [showPopup, setShowPopup] = useState(false)

  const openFormPopup = () => setShowPopup(true)
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
