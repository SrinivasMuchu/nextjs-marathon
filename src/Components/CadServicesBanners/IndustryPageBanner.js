

import React from "react"
import Link from "next/link"
import CadQuoteButton from "./CadQuoteButton"
import styles from "./IndustryPageBanner.module.css"

function IndustryPageBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.bannerCard}>
        <div className={styles.leftContent}>
          <div className={styles.tag}>
            <span className={styles.tagDot} />
            For automotive teams
          </div>

          <h2 className={styles.title}>
            Need a <span className={styles.titleAccent}>CATIA or NX specialist</span>
            <br />
            for your supply chain?
          </h2>

          <p className={styles.description}>
            Marathon matches you with certified automotive CAD designers who understand GD&amp;T,
            DFMEA, and production‑tolerancing — without the overhead of hiring a full‑time engineer.
          </p>

          <div className={styles.chipsRow}>
            <span className={styles.chip}>CATIA V5 / V6</span>
            <span className={styles.chip}>NX / Siemens</span>
            <span className={styles.chip}>GD&amp;T Certified</span>
            <span className={styles.chip}>STEP / IGES</span>
            <span className={styles.chip}>Drawing Packs</span>
          </div>
        </div>

        <div className={styles.rightContent}>
          <CadQuoteButton label="Get Matched" className={styles.primaryCta} />

          <Link href="/cad-services" className={styles.secondaryCta}>
            See how it works
          </Link>

          <p className={styles.metaText}>NDA available • IP is always yours</p>
        </div>
      </div>
    </section>
  )
}

export default IndustryPageBanner

