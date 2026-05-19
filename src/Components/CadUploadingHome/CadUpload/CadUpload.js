import React from 'react'
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadDropZoneContent from '../CadHomeDesign/CadDropZoneContent'
import CadUploadHeadings from './CadUploadHeadings'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import { Eye, Shield, Clock, HardDrive } from 'lucide-react'

function CadUpload({ type }) {
  return (
    <div className={heroStyles.heroPage}>
      <div className={cadHomeStyles['cad-ad-bar']}>
        <div className={cadHomeStyles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003" />
        </div>
      </div>
      <div className={heroStyles.heroInner}>
        <div className={heroStyles.badge}>
          <Eye size={16} strokeWidth={2.2} aria-hidden />
          <span>Free online tool</span>
        </div>
        <CadUploadHeadings variant="dark" />
        <div className={heroStyles.trustRow} role="list">
          <div className={heroStyles.trustItem} role="listitem">
            <span className={heroStyles.trustIcon} aria-hidden>
              <Shield size={18} strokeWidth={2.2} />
            </span>
            Private uploads
          </div>
          <div className={heroStyles.trustItem} role="listitem">
            <span className={heroStyles.trustIcon} aria-hidden>
              <Clock size={18} strokeWidth={2.2} />
            </span>
            Auto-delete in 24hrs
          </div>
          <div className={heroStyles.trustItem} role="listitem">
            <span className={heroStyles.trustIcon} aria-hidden>
              <HardDrive size={18} strokeWidth={2.2} />
            </span>
            Up to 300 MB
          </div>
        </div>
        <CadDropZoneContent isStyled type={type} designVariant="heroDark" />
      </div>
    </div>
  )
}

export default CadUpload
