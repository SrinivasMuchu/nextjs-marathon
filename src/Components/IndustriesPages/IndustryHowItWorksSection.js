import React from 'react';
import Link from 'next/link';
import {
  MdOutlineFileUpload,
  MdOutlineVisibility,
  MdOutlineShare,
} from 'react-icons/md';
import styles from './IndustryHowItWorksSection.module.css';

const STEPS = [
  {
    step: 'STEP 1',
    title: 'Upload',
    description:
      'Drag & drop or browse to upload your CAD file. We support 50+ formats.',
    Icon: MdOutlineFileUpload,
  },
  {
    step: 'STEP 2',
    title: 'Preview',
    description:
      'Instantly view your 3D model with measurement tools, cross-sections, and annotations.',
    Icon: MdOutlineVisibility,
  },
  {
    step: 'STEP 3',
    title: 'Share & Convert',
    description:
      'Generate a shareable link or convert to another format with one click.',
    Icon: MdOutlineShare,
  },
];

/**
 * Industry “How it works” — three white cards, purple accents, react-icons/md (matches reference layout).
 */
function IndustryHowItWorksSection({ industryName }) {
  const label = (industryName && String(industryName).trim()) || 'your';
  const industryLower = label.toLowerCase();

  return (
    <section className={styles.section} aria-labelledby="industry-how-it-works-title">
      <div className={styles.inner}>
        <h2 id="industry-how-it-works-title" className={styles.title}>
          How It Works
        </h2>
        <p className={styles.subtitle}>
          View any <span className={styles.industryAccent}>{industryLower}</span> CAD file in three
          simple steps — no signup, no software.
        </p>

        <div className={styles.cardRow}>
          {STEPS.map(({ step, title, description, Icon }) => (
            <div key={step} className={styles.card}>
              <div className={styles.iconCircle}>
                <Icon className={styles.icon} size={26} aria-hidden />
              </div>
              <span className={styles.stepLabel}>{step}</span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <Link href="/tools/3D-cad-viewer" className={styles.primaryBtn}>
            Upload CAD File
          </Link>
          <Link href="/tools/3d-cad-file-converter" className={styles.secondaryBtn}>
            Open Converter Tool
          </Link>
        </div>
      </div>
    </section>
  );
}

export default IndustryHowItWorksSection;
