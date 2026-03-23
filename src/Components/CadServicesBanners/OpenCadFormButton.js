"use client"

import React from "react"
import { useCadForm } from "../CadServicePages/CadFormContext"

/**
 * Generic button that opens the CAD services quote popup (uses root CadFormProvider).
 */
function OpenCadFormButton({ className, children, type = "button", ...rest }) {
  const { openFormPopup } = useCadForm()
  return (
    <button type={type} className={className} onClick={openFormPopup} {...rest}>
      {children}
    </button>
  )
}

export default OpenCadFormButton
