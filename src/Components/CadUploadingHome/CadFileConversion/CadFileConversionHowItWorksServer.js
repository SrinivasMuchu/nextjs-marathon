import React from 'react';
import { Upload, Box, Sun } from 'lucide-react';
import styles from './CadFileConversionHowItWorks.module.css';
import { parseConversionParams } from './ConvertPageHeroHeading';

const ICONS = {
  fileUp: Upload,
  swap: Box,
  download: Sun,
};

const DEFAULT_STEPS = [
  {
    title: 'Upload your CAD file',
    description: 'Drag and drop a supported file or browse from your computer.',
    iconKey: 'fileUp',
  },
  {
    title: 'Choose the output format',
    description: 'Select STEP, IGES, STL, OBJ, PLY, OFF, BREP, 3DM, DWG or DXF.',
    iconKey: 'swap',
  },
  {
    title: 'Convert and download',
    description: 'Process the model securely and download the converted file in one click.',
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
      : 'Convert CAD files online in three steps';

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>How it works</p>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.subtitle}>
          No downloads. No plugins. Works directly from your browser.
        </p>

        <div className={styles.steps}>
          {steps.map((step, index) => {
            const StepIcon = ICONS[step.iconKey];
            const num = String(index + 1).padStart(2, '0');

            return (
              <article key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden>{num}</span>
                {StepIcon ? (
                  <span className={styles.iconBox} aria-hidden>
                    <StepIcon size={19} strokeWidth={2} />
                  </span>
                ) : null}
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CadFileConversionHowItWorksServer;
