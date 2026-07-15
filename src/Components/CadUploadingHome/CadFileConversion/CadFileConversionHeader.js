import React from 'react'
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadFileConversionContent from './CadFileConversionContent'
import ConvertPageHeroHeading from './ConvertPageHeroHeading'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import { Zap, Shield, Clock, HardDrive } from 'lucide-react'

function CadFileConversionHeader({ convert, conversionParams }) {
  return (
    <div className={heroStyles.heroPage}>
      <div className={cadHomeStyles['cad-ad-bar']}>
        <div className={cadHomeStyles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003" />
        </div>
      </div>
      <div className={heroStyles.heroInner}>
        <div className={heroStyles.badge}>
          <Zap size={16} strokeWidth={2.2} aria-hidden />
          <span>Files under 5 MB free</span>
        </div>
        {convert ? (
          <ConvertPageHeroHeading conversionParams={conversionParams} />
        ) : (
          <>
            <h1 className={heroStyles.title}>Free Online 3D CAD File Converter</h1>
            <p className={heroStyles.description}>
              Convert CAD and 3D files between common engineering formats in your browser. Upload
              securely and convert STEP, STL, IGES, OBJ, PLY, BREP, 3DM, DWG and DXF files without installing
              desktop CAD software.
            </p>
            <p className={heroStyles.benefitStrip}>
              Free online converter | STEP, STL, IGES, OBJ, PLY, 3DM, DWG, DXF | Up to 300 MB | Auto-delete in
              24 hours
            </p>
          </>
        )}
        {convert ? (
          <div className={heroStyles.trustRow} role="list">
            <div className={heroStyles.trustItem} role="listitem">
              <span className={heroStyles.trustIcon} aria-hidden>
                <Shield size={18} strokeWidth={2.2} />
              </span>
              Encrypted uploads
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
        ) : null}
        <CadFileConversionContent
          convert={convert}
          conversionParams={conversionParams}
          designVariant="converterHero"
        />
      </div>
    </div>
  )
}

export default CadFileConversionHeader
