import React from 'react'
import styles from './IndustryDesign.module.css'

function IndustryDesignHeader() {
  return (
    <div className={styles['industry-design-header']}>
        <div className={styles['industry-design-header-content']}>
            <h1 >Title in multiple line</h1>
            <p >
            Find answers to common questions about Marathon OS CAD Viewer. Whether you're getting started or looking for advanced features, we've got you covered.
            Find answers to common questions about Marathon OS CAD Viewer. Whether you're getting started or looking for advanced features, we've got you covered.
            </p>
        </div>
        <div className={styles['industry-design-header-viewer']}>
            <span >Experience in 3-D</span>
            <button >Open in 3D viewer</button>
        </div>
    </div>
  )
}

export default IndustryDesignHeader