import React from 'react'
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadDropZoneContent from '../CadHomeDesign/CadDropZoneContent'
import CadUploadHeadings from './CadUploadHeadings'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import { Eye } from 'lucide-react'

function CadUpload({ type, cadType }) {
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
        <CadUploadHeadings variant="dark" cadType={cadType} />
        <p className={heroStyles.benefitStrip}>
          Free online viewer | Private uploads | Up to 300 MB | Auto-delete in 24 hours | No CAD
          software needed
        </p>
        <CadDropZoneContent isStyled type={type} cadType={cadType} designVariant="heroDark" />
      </div>
    </div>
  )
}

export default CadUpload
