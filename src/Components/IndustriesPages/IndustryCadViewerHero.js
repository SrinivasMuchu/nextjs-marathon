'use client';

import React, { useCallback, useState } from 'react';
import CadDropZoneWrapper from '@/Components/CadUploadingHome/CadHomeDesign/CadDropZoneWrapper';
import CommonSampleViewer from '@/Components/CommonJsx/CommonSampleViewer';
import DemoPopUp from '@/Components/HomePages/RequestDemo/DemoPopUp';
import {
  MdOutlineFileUpload,
  MdOutlineStorage,
  MdOutlineLanguage,
  MdOutlineShield,
  MdOutlineAccessTime,
  MdArrowForward,
} from 'react-icons/md';
import styles from './IndustryCadViewerHero.module.css';

const DROPZONE_ID = 'industry-hero-cad-dropzone';

function triggerIndustryUpload() {
  if (typeof document === 'undefined') return;
  document.getElementById(DROPZONE_ID)?.click();
}

const FORMATS_LINE = 'Supported formats: STEP / IGES / STL / PLY / OFF / BREP';

const FEATURES = [
  { Icon: MdOutlineStorage, text: 'Max upload: 300 MB' },
  { Icon: MdOutlineLanguage, text: 'No software needed' },
  { Icon: MdOutlineShield, text: 'Private uploads' },
  { Icon: MdOutlineAccessTime, text: 'Deleted after 24 hours' },
];

/**
 * Industry landing hero: same upload flow as CAD viewer (CadDropZoneWrapper → /tools/cad-uploading),
 * two-column layout with dynamic industry name.
 */
function IndustryCadViewerHero({ industryData, part_name: partName }) {
  const [openDemoForm, setOpenDemoForm] = useState(null);
  const industryLabel = industryData?.industry?.trim() || 'your';
  const onPrimaryClick = useCallback(() => {
    triggerIndustryUpload();
  }, []);

  const description = partName ? (
    <>
      Open STEP, IGES, STL, PLY, OFF, BREP, and more in your browser—no desktop CAD license. Optimized
      for files up to 300 MB; uploads are private and removed automatically after 24 hours. Perfect for
      reviewing models like the {partName} without installing software.
    </>
  ) : (
    <>
      Open STEP, IGES, STL, PLY, OFF, BREP, and more in your browser—no desktop CAD license. Optimized
      for files up to 300 MB; uploads are private and removed automatically after 24 hours.
    </>
  );

  return (
    <section className={styles.hero} aria-labelledby="industry-cad-hero-heading">
      {openDemoForm === 'demo' && (
        <DemoPopUp
          onclose={() => setOpenDemoForm(null)}
          openPopUp={openDemoForm}
          setOpenDemoForm={setOpenDemoForm}
        />
      )}
      <div className={styles.inner}>
        <div>
          <h1 id="industry-cad-hero-heading" className={styles.title}>
            Browser-Based CAD Viewer for{' '}
            <span className={styles.titleAccent}>{industryLabel}</span> Teams
          </h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.ctaRow}>
            <button type="button" className={styles.primaryBtn} onClick={onPrimaryClick}>
              <MdOutlineFileUpload size={22} aria-hidden />
              Upload CAD File
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => setOpenDemoForm('demo')}
            >
              Request Demo
            </button>
          </div>
          <p className={styles.trustBanner}>
            Trusted by {industryLabel.toLowerCase()} teams for{' '}
            <strong>Design reviews • Supplier checks • Engineering alignment</strong>
          </p>
        </div>

        <div className={styles.uploadCard}>
          <h2 className={styles.cardTitle}>Upload CAD File</h2>
          <CadDropZoneWrapper designVariant="industryHero" dropzoneId={DROPZONE_ID}>
            <div className={styles.dropzoneCopy}>
              <p className={styles.dropLead}>Drag &amp; drop CAD files</p>
              <p className={styles.dropOr}>
                or <span className={styles.browseLink}>Browse files</span>
              </p>
            </div>
          </CadDropZoneWrapper>
          <p className={styles.formatsBox}>{FORMATS_LINE}</p>
          <ul className={styles.featureList}>
            {FEATURES.map(({ Icon, text }) => (
              <li key={text} className={styles.featureItem}>
                <Icon className={styles.featureIcon} size={20} aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <p className={styles.enterpriseRow}>
            Need enterprise workflow?
            <a
              className={styles.enterpriseLink}
              href="mailto:hello@marathon-os.com?subject=Enterprise%20workflow"
            >
              Talk to Team
              <MdArrowForward size={16} style={{ verticalAlign: 'text-bottom', marginLeft: 2 }} aria-hidden />
            </a>
          </p>
          <div className={styles.samplesWrap}>
            <CommonSampleViewer variant="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default IndustryCadViewerHero;
