
import React from "react"
import { FileText } from "lucide-react"
import CadQuoteButton from "./CadQuoteButton"
import styles from "./ToolsPageBanner.module.css"

function ToolsPageBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.bannerCard}>
        <div className={styles.iconCol}>
          <div className={styles.iconCircle}>
            <FileText size={22} strokeWidth={2.2} className={styles.iconSvg} />
          </div>
        </div>

        <div className={styles.textCol}>
          <h2 className={styles.title}>Need a proper native CAD file built from scratch?</h2>
          <p className={styles.description}>
            Vetted designers deliver production-ready files in 24 hours — SolidWorks, Revit, Fusion
            360 &amp; more.
          </p>
        </div>

        <div className={styles.ctaCol}>
          <CadQuoteButton label="Hire a Designer" className={styles.primaryCta} />
        </div>
      </div>
    </section>
  )
}

export default ToolsPageBanner

