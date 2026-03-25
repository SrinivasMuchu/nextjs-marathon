"use client"

import React from "react"
import { ArrowRight } from "lucide-react"
import { useCadForm } from "../CadServicePages/CadFormContext"

function CadPopupQuoteButton({ label = "Get Quote", className }) {
  const { openFormPopup } = useCadForm()

  return (
    <button type="button" className={className} onClick={openFormPopup}>
      {label}
      <ArrowRight size={16} strokeWidth={2.5} />
    </button>
  )
}

export default CadPopupQuoteButton
