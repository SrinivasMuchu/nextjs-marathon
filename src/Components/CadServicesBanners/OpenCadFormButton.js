"use client"

import React from "react"
import Link from "next/link"

const CAD_SERVICES_QUOTE_HREF = "/cad-services#cad-quote"

/**
 * Navigates to the CAD services page quote form (inline section), not the popup.
 */
function OpenCadFormButton({ className, children, type, href, ...rest }) {
  return (
    <Link href={href || CAD_SERVICES_QUOTE_HREF} className={className} {...rest}>
      {children}
    </Link>
  )
}

export default OpenCadFormButton
