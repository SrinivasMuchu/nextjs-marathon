import React from 'react'
import Image from 'next/image'
import { IMAGEURLS } from '@/config'
import styles from './HomeLandingNew.module.css'
import SearchBar from './SearchBar'

function HomeLandingNew() {
  return (
    <div className={styles.landingContainer}>
      <div className={styles.backgroundImage}>
        <Image
          src={IMAGEURLS.newHomeBg}
          alt="Marathon OS background"
          priority
          fetchPriority="high"
          sizes="100vw"
          fill
          className={styles.backgroundImageImg}
        />
      </div>
      
      <div className={styles.contentCard}>
        <div className={styles.logoContainer}>
          <Image
            src={IMAGEURLS.logoTop}
            alt="Marathon OS"
            width={200}
            height={80}
            className={styles.logo}
            priority
          />
        </div>

        <div className={styles.textContent}>
          <h1 className={styles.mainTitle}>
            Production-Ready CAD Designs for Engineering Teams
          </h1>
          <p className={styles.subtitle}>
            Discover, buy, and sell professional 3D CAD models on a global engineering marketplace.
          </p>
        </div>

        <SearchBar />
      </div>
    </div>
  )
}

export default HomeLandingNew
