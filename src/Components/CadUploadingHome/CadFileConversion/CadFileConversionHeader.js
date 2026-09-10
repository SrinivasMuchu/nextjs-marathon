import React from 'react'
import cadHomeStyles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadFileConversionContent from './CadFileConversionContent'
import ConvertPageHeroHeading from './ConvertPageHeroHeading'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'
import { Zap, Shield, Clock, HardDrive, Box, MonitorOff } from 'lucide-react'
import { CONVERTER_HUB_PAGE } from '@/data/converterHubPage'

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
              <span>{CONVERTER_HUB_PAGE.badges[0]}</span>
            </div>
            <div className={heroStyles.converterMiniBadge}>
              <Box size={13} aria-hidden />
              <span>{CONVERTER_HUB_PAGE.badges[1]}</span>
            </div>
            <div className={heroStyles.converterMiniBadge}>
              <MonitorOff size={13} aria-hidden />
              <span>{CONVERTER_HUB_PAGE.badges[2]}</span>
            </div>
          </div>
          {convert ? (
            <ConvertPageHeroHeading conversionParams={conversionParams} />
          ) : (
            <>
              <h1 className={heroStyles.title}>{CONVERTER_HUB_PAGE.h1}</h1>
              <p className={heroStyles.description}>
                {CONVERTER_HUB_PAGE.intro}
              </p>
              <p className={heroStyles.description}>{CONVERTER_HUB_PAGE.expectationNote}</p>
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
                <HardDrive size={18} strokeWidth={2.2} />
              </span>
              Up to 300 MB
            </div>
            <div className={heroStyles.trustItem} role="listitem">
              <span className={heroStyles.trustIcon} aria-hidden>
                <Clock size={18} strokeWidth={2.2} />
              </span>
              Automatically deleted within 7 days
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
              <h2>{convert ? `Upload your file` : CONVERTER_HUB_PAGE.uploadHeading}</h2>
              <p>{convert ? 'Choose one file to begin the conversion.' : CONVERTER_HUB_PAGE.uploadHelper}</p>
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
