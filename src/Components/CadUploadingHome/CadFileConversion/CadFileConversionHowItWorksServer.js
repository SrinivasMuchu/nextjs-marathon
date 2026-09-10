import React from 'react';
import { Upload, Box, Sun } from 'lucide-react';
import styles from './CadFileConversionHowItWorks.module.css';
import { parseConversionParams } from './ConvertPageHeroHeading';
import { CONVERTER_HUB_PAGE } from '@/data/converterHubPage';

const ICONS = {
  fileUp: Upload,
  swap: Box,
  download: Sun,
};

const DEFAULT_STEPS = CONVERTER_HUB_PAGE.workflowSteps.map(([title, description], index) => ({
  title,
  description,
  iconKey: ['fileUp', 'swap', 'download'][index],
}));

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
      : CONVERTER_HUB_PAGE.workflowHeading;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{conversionParams ? 'How it works' : CONVERTER_HUB_PAGE.workflowEyebrow}</p>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.subtitle}>
          {conversionParams && from && to
            ? `Move from ${from.toUpperCase()} to ${to.toUpperCase()} in three clear steps.`
            : CONVERTER_HUB_PAGE.workflowIntro}
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
        {!conversionParams ? (
          <a href="#cad-file-converter" className={styles.convertButton}>
            {CONVERTER_HUB_PAGE.workflowCta}
          </a>
        ) : null}
      </div>
    </section>
  );
}

export default CadFileConversionHowItWorksServer;
