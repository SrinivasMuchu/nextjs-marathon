
import React from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import CadQuoteButton from "./CadQuoteButton"
import styles from "./ToolsPageBanner.module.css"

function ToolsPageBanner({ variant = "default" }) {
  const isConverter = variant === "converter"

  return (
    <section className={`${styles.section} ${isConverter ? styles.converterSection : ""}`}>
      <div className={`${styles.bannerCard} ${isConverter ? styles.converterBanner : ""}`}>
        {!isConverter ? (
          <div className={styles.iconCol}>
            <div className={styles.iconCircle}>
              <FileText size={22} strokeWidth={2.2} className={styles.iconSvg} />
            </div>
          </div>
        ) : null}

        <div className={styles.textCol}>
          <h2 className={styles.title}>Need a proper native CAD file built from scratch?</h2>
          <p className={styles.description}>
            {isConverter
              ? "Vetted designers can rebuild damaged geometry or deliver production-ready files in SolidWorks, Revit, Fusion 360 and more."
              : "Vetted designers deliver production-ready files in 24 hours — SolidWorks, Revit, Fusion 360 & more."}
          </p>
        </div>

        <div className={styles.ctaCol}>
          <CadQuoteButton label="Hire a Designer" className={styles.primaryCta} />
          {isConverter ? (
            <Link href="#cad-file-converter" className={styles.secondaryCta}>
              Use converter
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ToolsPageBanner

