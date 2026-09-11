import React from 'react';
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadDropZoneContent from '../CadHomeDesign/CadDropZoneContent'
import CadUploadHeadings from './CadUploadHeadings'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import { Eye } from 'lucide-react'
import { getUniqueViewerPage } from '@/data/viewerUniquePages'

function CadUpload({ type, cadType }) {
  const uniquePage = getUniqueViewerPage(cadType)
  const trustLine = uniquePage?.trust?.length
    ? uniquePage.trust.join('  •  ')
    : 'Free online viewer | Private uploads | Up to 300 MB | Auto-delete in 7 days | No CAD software needed'

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
          <span>{uniquePage?.eyebrow || 'Free online tool'}</span>
        </div>
        <CadUploadHeadings variant="dark" cadType={cadType} />
        <p className={heroStyles.benefitStrip}>
          {trustLine}
        </p>
        <CadDropZoneContent
          isStyled
          type={type}
          cadType={cadType}
          designVariant="heroDark"
          dropzoneId="cad-file-viewer"
        />
      </div>
    </div>
  )
}

export default CadUpload
