import React from "react"
import Link from "next/link"
import { Users, ArrowRight } from "lucide-react"
import styles from "./LibraryHireCtaCard.module.css"

/**
 * Promotional CTA card sized to match library grid items (.library-designs-items-container).
 */
function LibraryHireCtaCard() {
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>
        <Users size={22} strokeWidth={1.75} className={styles.icon} aria-hidden />
      </div>

      <h2 className={styles.title}>Don&apos;t see what you need?</h2>
      <p className={styles.body}>
        Get a custom CAD file built by a vetted specialist — delivered production-ready in 24
        hours.
      </p>

      <Link href="/cad-services" className={styles.cta}>
        Hire a Designer
        <ArrowRight size={18} strokeWidth={2.25} aria-hidden />
      </Link>

      <div className={styles.divider} />

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>500+</span>
          <span className={styles.statLabel}>Projects Done</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>24 hr</span>
          <span className={styles.statLabel}>Response</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>15+</span>
          <span className={styles.statLabel}>CAD Tools</span>
        </div>
      </div>
    </article>
  )
}

export default LibraryHireCtaCard
