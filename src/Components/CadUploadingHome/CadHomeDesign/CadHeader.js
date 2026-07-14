import React from 'react'
import heroStyles from './CadViewerHero.module.css'
import cadHomeStyles from './CadHome.module.css'
import CadDropZoneContent from './CadDropZoneContent'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import { Eye } from 'lucide-react'

function CadHeader({ type }) {
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
        <h1 className={heroStyles.title}>Free Online 3D CAD Viewer</h1>
        <p className={heroStyles.description}>
          Open STEP, IGES, STL, OBJ, PLY, OFF, BREP and 3DM files online without installing CAD software.
        </p>
        <p className={heroStyles.description}>
          Upload securely, inspect your model in 3D and convert files when needed.
        </p>
        <p className={heroStyles.benefitStrip}>
          Free online viewer | STEP, IGES, STL, OBJ, PLY, OFF, BREP, 3DM | Up to 300 MB | Auto-delete in
          24 hours | No CAD software needed
        </p>
        <CadDropZoneContent isStyled={false} type={type} designVariant="heroDark" />
      </div>
    </div>
  )
}

export default CadHeader
