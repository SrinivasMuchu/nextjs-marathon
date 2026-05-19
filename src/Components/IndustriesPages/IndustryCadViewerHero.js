'use client';

import React from 'react';
import heroStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadViewerHero.module.css';
import cadHomeStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';
import CadDropZoneContent from '@/Components/CadUploadingHome/CadHomeDesign/CadDropZoneContent';
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner';
import { Eye, Shield, Clock, HardDrive } from 'lucide-react';

const DROPZONE_ID = 'industry-hero-cad-dropzone';

/**
 * Industry landing hero: same layout/styling as CAD viewer (`CadHeader`), copy driven by `industryData`.
 */
function IndustryCadViewerHero({ industryData, part_name: partName }) {
  const industryLabel = industryData?.industry?.trim() || 'your industry';
  const industryLower = industryLabel.toLowerCase();

  const partSlug = partName?.trim() || '';
  const partDisplayName =
    (industryData?.part_name && String(industryData.part_name).trim()) ||
    (partSlug
      ? partSlug
          .split(/[-_]+/)
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ')
      : '');

  const description = partName
    ? (industryData?.description?.trim()
        ? industryData.description.trim()
        : `A lightweight online tool to view, inspect, and share 3D CAD files — ideal for reviewing models like the ${partDisplayName || partName} without installing software.`)
    : (industryData?.usage?.trim()
        ? industryData.usage.trim()
        : `A lightweight online tool to view, inspect, and share 3D CAD files for ${industryLower} teams — no software installation required.`);

  return (
    <div className={heroStyles.heroPage}>
      <div className={cadHomeStyles['cad-ad-bar']}>
        <div className={cadHomeStyles['cad-ad-bar-inner']}>
          <LeftRightBanner adSlot="3755241003" />
        </div>
      </div>
      <div className={`${heroStyles.heroInner} ${heroStyles.industryHeroInnerWide}`}>
        <div className={heroStyles.badge}>
          <Eye size={16} strokeWidth={2.2} aria-hidden />
          <span>Free online tool</span>
        </div>
        <h1 id="industry-cad-hero-heading" className={heroStyles.title}>
          Free Online CAD Viewer for
        </h1>
        {partSlug && partDisplayName ? (
          <>
            <p className={heroStyles.subtitle}>{partDisplayName}</p>
            <p className={heroStyles.heroIndustryBracket}>({industryLabel})</p>
          </>
        ) : (
          <p className={heroStyles.subtitle}>{industryLabel}</p>
        )}
        <p className={heroStyles.secureTagline}>Secure, Fast &amp; Cloud-Based</p>
        <p className={`${heroStyles.description} ${heroStyles.industryDescriptionWide}`}>{description}</p>
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
        <CadDropZoneContent
          isStyled={false}
          type={undefined}
          designVariant="heroDark"
          dropzoneId={DROPZONE_ID}
        />
      </div>
    </div>
  );
}

export default IndustryCadViewerHero;
