"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import styles from "./StickyCadStrip.module.css"

const CAD_SERVICES_QUOTE_HREF = "/cad-services#cad-quote"

const DISMISS_KEY = "marathon_cad_strip_dismissed_until"
const DISMISS_HOURS = 24

function StickyCadStrip() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      const stored = window.localStorage.getItem(DISMISS_KEY)
      if (stored) {
        const until = parseInt(stored, 10)
        if (!Number.isNaN(until) && until > Date.now()) {
          // user has dismissed for the next 24 hours
          return
        }
      }

      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      if (docHeight > 0 && scrolled / docHeight >= 0.4) {
        setVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClose = () => {
    setVisible(false)
    if (typeof window !== "undefined") {
      const until = Date.now() + DISMISS_HOURS * 60 * 60 * 1000
      window.localStorage.setItem(DISMISS_KEY, String(until))
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    window.dispatchEvent(
      new CustomEvent("sticky-cad-strip-visibility-change", {
        detail: { visible },
      })
    )

    return () => {
      window.dispatchEvent(
        new CustomEvent("sticky-cad-strip-visibility-change", {
          detail: { visible: false },
        })
      )
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.strip}>
        <div className={styles.left}>
          <span className={styles.dot} />
          <div className={styles.textBlock}>
            <span className={styles.heading}>Can&apos;t find what you need?</span>
            <span className={styles.subheading}>
              Get a custom CAD file built by a vetted specialist.
            </span>
          </div>
        </div>

        <div className={styles.right}>
          <Link href={CAD_SERVICES_QUOTE_HREF} className={styles.cta}>
            Get a Quote in 24 Hours
          </Link>
          <button
            type="button"
            className={styles.close}
            onClick={handleClose}
            aria-label="Dismiss CAD quote banner"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export default StickyCadStrip

