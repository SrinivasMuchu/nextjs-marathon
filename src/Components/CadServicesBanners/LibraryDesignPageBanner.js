import React from "react"
import { Clock } from "lucide-react"
import CadQuoteButton from "./CadQuoteButton"
import styles from "./LibraryDesignPageBanner.module.css"

function LibraryDesignPageBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.bannerCard}>
        <div className={styles.iconCol}>
          <div className={styles.iconCircle}>
            <span className={styles.iconGlyph}>g</span>
          </div>
        </div>

        <div className={styles.textCol}>
          <h2 className={styles.title}>Need a file that doesn&apos;t exist in the library?</h2>
          <p className={styles.description}>
            Describe your requirement and we&apos;ll match you with a vetted CAD expert. SolidWorks,
            AutoCAD, Revit, Fusion 360 and 15+ tools supported.
          </p>
        </div>

        <div className={styles.ctaCol}>
          <CadQuoteButton label="Get it Built" className={styles.primaryCta} />
          <button
            type="button"
            className={styles.secondaryCta}
          >
            <Clock size={14} className={styles.secondaryIcon} />
            Reply within 24 hours
          </button>
        </div>
      </div>
    </section>
  )
}

export default LibraryDesignPageBanner

