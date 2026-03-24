"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const CAD_SERVICES_QUOTE_HREF = "/cad-services"

function CadQuoteButton({ label = "Hire a Designer", className }) {
  return (
    <Link href={CAD_SERVICES_QUOTE_HREF} className={className}>
      {label}
      <ArrowRight size={16} strokeWidth={2.5} />
    </Link>
  )
}

export default CadQuoteButton
