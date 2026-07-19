import React from 'react'
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadFileConversionContent from './CadFileConversionContent'
import ConvertPageHeroHeading from './ConvertPageHeroHeading'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import { Zap, Shield, Clock, HardDrive, Box, MonitorOff } from 'lucide-react'

function CadFileConversionHeader({ convert, conversionParams }) {
  return (
    <div className={`${heroStyles.heroPage} ${heroStyles.converterHeroPage}`}>
      <div className={cadHomeStyles['cad-ad-bar']}>
        <div className={cadHomeStyles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003" />
        </div>
      </div>
      <div className={heroStyles.converterHeroInner}>
        <div className={heroStyles.converterHeroCopy}>
          <div className={heroStyles.converterBadgeRow}>
            <div className={`${heroStyles.badge} ${heroStyles.converterBadgePrimary}`}>
              <Zap size={14} strokeWidth={2.2} aria-hidden />
              <span>Files under 5 MB free</span>
            </div>
            <div className={heroStyles.converterMiniBadge}>
              <Box size={13} aria-hidden />
              <span>10 supported formats</span>
            </div>
            <div className={heroStyles.converterMiniBadge}>
              <MonitorOff size={13} aria-hidden />
              <span>No software installation</span>
            </div>
          </div>
          {convert ? (
            <ConvertPageHeroHeading conversionParams={conversionParams} />
          ) : (
            <>
              <h1 className={heroStyles.title}>Free Online 3D CAD File Converter</h1>
              <p className={heroStyles.description}>
                Convert CAD, mesh and drawing files between common engineering formats in your
                browser. Upload securely and convert STEP, STL, IGES, OBJ, PLY, OFF, BREP, 3DM,
                DWG and DXF files without installing desktop CAD software.
              </p>
            </>
          )}
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
              Auto-delete in 7 days
            </div>
            <div className={heroStyles.trustItem} role="listitem">
              <span className={heroStyles.trustIcon} aria-hidden>
                <HardDrive size={18} strokeWidth={2.2} />
              </span>
              Up to 300 MB
            </div>
          </div>
        </div>
        <section
          id="cad-file-converter"
          className={heroStyles.converterCard}
          aria-label="CAD file converter"
        >
          <div className={heroStyles.converterCardHeader}>
            <div>
              <h2>Upload your CAD or 3D file</h2>
              <p>We&apos;ll detect the input format. Choose the output you need.</p>
            </div>
            <span className={heroStyles.converterSecureBadge}>
              <Shield size={13} strokeWidth={2.2} aria-hidden />
              Secure
            </span>
          </div>
          <CadFileConversionContent
            convert={convert}
            conversionParams={conversionParams}
            designVariant="converterHero"
          />
        </section>
      </div>
    </div>
  )
}

export default CadFileConversionHeader
