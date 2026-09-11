import React from 'react'
import heroStyles from './CadViewerHero.module.css'
import cadHomeStyles from './CadHome.module.css'
import CadDropZoneContent from './CadDropZoneContent'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import { Eye } from 'lucide-react'
import { getUniqueViewerPage } from '@/data/viewerUniquePages'

function CadHeader({ type }) {
  const uniquePage = getUniqueViewerPage(null, { isHub: true })
  const trustLine = uniquePage?.trust?.length
    ? uniquePage.trust.join('  •  ')
    : 'Free online viewer | STEP, IGES, STL, OBJ, PLY, OFF, BREP, 3DM | Up to 300 MB | Auto-delete in 7 days | No CAD software needed'

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
        <h1 className={heroStyles.title}>{uniquePage?.h1 || 'Free Online 3D CAD Viewer'}</h1>
        <p className={heroStyles.description}>
          {uniquePage?.heroIntro ||
            'Open STEP, IGES, STL, OBJ, PLY, OFF, BREP and 3DM files online without installing CAD software.'}
        </p>
        {uniquePage?.heroIntroSecondary ? (
          <p className={heroStyles.description}>{uniquePage.heroIntroSecondary}</p>
        ) : uniquePage ? null : (
          <p className={heroStyles.description}>
            Upload securely, inspect your model in 3D and convert files when needed.
          </p>
        )}
        <p className={heroStyles.benefitStrip}>{trustLine}</p>
        <CadDropZoneContent
          isStyled={false}
          type={type}
          designVariant="heroDark"
          dropzoneId="cad-file-viewer"
        />
      </div>
    </div>
  )
}

export default CadHeader
