import React from 'react'
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadFileConversionContent from './CadFileConversionContent'
import CadDynamicContent from './CadDynamicContent'
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
          <span>Free online tool</span>
        </div>
        {convert ? (
          <CadDynamicContent conversionParams={conversionParams} heroTone="dark" />
        ) : (
          <>
            <h1 className={heroStyles.title}>
              Free Online 3D CAD{' '}
              <span className={heroStyles.titleAccent}>File Converter</span>
            </h1>
            <p className={heroStyles.description}>
              Secure, lightweight online converter to change CAD &amp; 3D file formats instantly.
              Anytime, anywhere.
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
            Auto-delete in 24hrs
          </div>
          <div className={heroStyles.trustItem} role="listitem">
            <span className={heroStyles.trustIcon} aria-hidden>
              <HardDrive size={18} strokeWidth={2.2} />
            </span>
            Up to 300 MB
          </div>
        </div>
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
