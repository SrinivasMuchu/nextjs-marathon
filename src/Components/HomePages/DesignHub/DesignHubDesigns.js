'use client'

import React from 'react'
import Link from 'next/link'
import styles from './DesignHub.module.css'
import libraryStyles from '../../Library/Library.module.css'
import HoverImageSequenceHome from '../../CommonJsx/RotatedHomePageDesigns'

function DesignHubDesigns({ designs = [] }) {
  return (
    <div className={styles.designHubDesignsContainer}>
      <div className={styles.designHubDesignsGrid}>
        {designs && designs.length > 0 ? (
          designs.map((design) => (
            <div key={design._id} className={styles.designHubDesignCard}>
              <Link 
                href={`/library/${design.route}`} 
                className={libraryStyles["library-designs-items-container-home"]}
              >
                <HoverImageSequenceHome design={design} loading="lazy" />
              </Link>
              <div className={styles.designHubDesignTitle}>
                {design.page_title}
              </div>
            </div>
          ))
        ) : (
          <p>No designs available</p>
        )}
      </div>
    </div>
  )
}

export default DesignHubDesigns