import React from 'react'
import styles from './CadHome.module.css'
import CadDropZoneContent from './CadDropZoneContent'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'

/** Previous light landing hero (kept for reference / rollback). */
function CadHeaderLegacy({ type }) {
  return (
    <div className={styles['cad-landing-page']}>
      <div className={styles['cad-ad-bar']}>
        <div className={styles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003"/>
        </div>
      </div>
      <div className={styles['cad-landing-left-cont']}>
        <div className={styles['cad-landing-left-content']}> <h1 className={styles['cad-landing-heading']}>
          Free Online CAD Viewer –Secure, Fast & Cloud-Based
        </h1>
          <p className={styles['cad-landing-description']}>A lightweight, online CAD viewer to quickly preview 3D models—anytime, anywhere.

          </p></div>

        <CadDropZoneContent isStyled={false} type={type}/>
      </div>

    </div>
  )
}

export default CadHeaderLegacy
