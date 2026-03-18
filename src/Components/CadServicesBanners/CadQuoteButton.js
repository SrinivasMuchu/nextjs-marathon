import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

function CadQuoteButton({ label = "Hire a Designer", className }) {
  return (
    <Link href="/cad-services" className={className}>
      {label}
      <ArrowRight size={16} strokeWidth={2.5} />
    </Link>
  )
}

export default CadQuoteButton

