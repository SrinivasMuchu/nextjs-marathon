

import React from "react"
import { Clock } from "lucide-react"
import CadQuoteButton from "./CadQuoteButton"
import CadPopupQuoteButton from "./CadPopupQuoteButton"
import styles from "./CadOutsourcingBanner.module.css"

function CadOutsourcingBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.bannerCard}>
        <div className={styles.leftContent}>
          <div className={styles.tag}>
            <span className={styles.tagDot} />
            CAD outsourcing
          </div>

          <h2 className={styles.title}>
            Can&apos;t find the file you need?
            <br />
            <span className={styles.titleAccent}>We&apos;ll build it in 24 hours.</span>
          </h2>

          <p className={styles.description}>
            Send your requirements — we match you with a vetted CAD specialist and deliver
            production‑ready files. No hiring, no overhead.
          </p>
        </div>

        <div className={styles.rightContent}>
          <div className={styles.ctaRow}>
            <CadQuoteButton label="Know More" className={styles.primaryCta} />
            <CadPopupQuoteButton label="Get a Quote" className={styles.secondaryCta} />
          </div>
          <p className={styles.kickoffText}>
            <Clock size={14} className={styles.kickoffIcon} />
            Typical kickoff in 24–72 hrs
          </p>
        </div>
      </div>
    </section>
  )
}

export default CadOutsourcingBanner


