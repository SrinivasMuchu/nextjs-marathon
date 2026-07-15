import React from 'react';
import Link from 'next/link';
import { ChevronRight, Upload, FileUp, ArrowLeftRight, Download } from 'lucide-react';
import styles from '../CadUpload/HowItWorks.module.css';
import { parseConversionParams } from './ConvertPageHeroHeading';

const ICONS = {
  fileUp: FileUp,
  swap: ArrowLeftRight,
  download: Download,
};

const DEFAULT_STEPS = [
  {
    title: 'Upload your CAD file',
    description: 'Drag & drop or browse to select your file',
    iconKey: 'fileUp',
  },
  {
    title: 'Choose the output format',
    description: 'STEP, IGES, STL, OBJ, PLY, OFF, BREP, or 3DM',
    iconKey: 'swap',
  },
  {
    title: 'Convert and download instantly',
    description: 'Download your converted file in one click',
    iconKey: 'download',
  },
];

function getConverterSteps(conversionParams) {
  if (!conversionParams) return DEFAULT_STEPS;
  const { from, to } = parseConversionParams(conversionParams);
  if (!from || !to) return DEFAULT_STEPS;
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  return [
    {
      title: `Upload your ${fromUpper} file`,
      description: `Drag & drop or browse to select your .${from} file`,
      iconKey: 'fileUp',
    },
    {
      title: `Select ${toUpper} as the output format`,
      description: `Choose ${toUpper} as your target CAD format`,
      iconKey: 'swap',
    },
    {
      title: 'Convert and download instantly',
      description: `Download your converted ${toUpper} file in one click`,
      iconKey: 'download',
    },
  ];
}

/** Server-rendered “How it works” for converter pages (SEO copy in raw HTML). */
function CadFileConversionHowItWorksServer({ conversionParams }) {
  const steps = getConverterSteps(conversionParams);
  const { from, to } = parseConversionParams(conversionParams || '');
  const heading =
    conversionParams && from && to
      ? `How to convert ${from.toUpperCase()} to ${to.toUpperCase()} online`
      : 'How to convert CAD files online';

  return (
    <section className={styles.cadViewerSection}>
      <div className={styles.cadViewerInner}>
        <p className={styles.cadViewerEyebrow}>HOW IT WORKS</p>
        <h2 className={styles.cadViewerHeading}>{heading}</h2>
        <p className={styles.cadViewerSubtitle}>
          No downloads. No plugins. Works right from your browser.
        </p>

        <div className={styles.cadViewerStepsRow}>
          {steps.map((step, index) => {
            const StepIcon = ICONS[step.iconKey];
            const num = String(index + 1).padStart(2, '0');

            return (
              <React.Fragment key={step.title}>
                {index > 0 ? (
                  <div className={styles.cadViewerArrow} aria-hidden>
                    <ChevronRight size={22} strokeWidth={2} className={styles.cadViewerArrowIcon} />
                  </div>
                ) : null}
                <div className={styles.cadViewerStep}>
                  <div className={styles.cadViewerIconWrap}>
                    <span className={styles.cadViewerBadge}>{num}</span>
                    {StepIcon ? (
                      <div className={styles.cadViewerIconBox}>
                        <StepIcon className={styles.cadViewerReactIcon} size={40} aria-hidden />
                      </div>
                    ) : null}
                  </div>
                  <h3 className={styles.cadViewerStepTitle}>{step.title}</h3>
                  <p className={styles.cadViewerStepDesc}>{step.description}</p>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className={styles.cadViewerCtaRow}>
          <Link href="/tools/3d-cad-file-converter" className={styles.cadViewerPrimaryCta}>
            <Upload size={18} strokeWidth={2.2} aria-hidden />
            Upload CAD File
          </Link>
          <Link href="/tools/3d-cad-viewer" className={styles.cadViewerSecondaryCta}>
            Open CAD Viewer
            <span className={styles.cadViewerSecondaryArrow} aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CadFileConversionHowItWorksServer;
