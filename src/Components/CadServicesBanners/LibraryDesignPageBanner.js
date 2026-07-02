import React from "react"
import LibraryHireCtaCard from "@/Components/Library/LibraryHireCtaCard"
import styles from "./LibraryDesignPageBanner.module.css"

function LibraryDesignPageBanner() {
  return (
    <section className={styles.section} aria-label="CAD design services">
      <div className={styles.bannerWrap}>
        <LibraryHireCtaCard />
      </div>
    </section>
  )
}

export default LibraryDesignPageBanner
