import React from 'react';
import Link from 'next/link';
import { getCadViewerFormatConfig } from '@/data/cadFormatViewerPages';
import styles from './CadViewerFormatSections.module.css';

function CadViewerFormatSections({ cadType }) {
  const config = getCadViewerFormatConfig(cadType);
  if (!config) return null;

  const formatName = config.formatName;

  return (
    <>
      <section className={`${styles.section} ${styles.sectionMuted}`} aria-labelledby="what-is-viewer">
        <div className={styles.inner}>
          <h2 id="what-is-viewer" className={styles.heading}>
            What is a {formatName} file viewer?
          </h2>
          <p className={styles.copy}>
            A {formatName} file viewer lets you open and inspect {formatName} files online without
            installing desktop CAD or 3D software.
          </p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="when-to-use-viewer">
        <div className={styles.inner}>
          <h2 id="when-to-use-viewer" className={styles.heading}>
            When to use this viewer
          </h2>
          <p className={styles.copy}>
            Use this viewer when you need to inspect a model, check geometry, review a file from a
            supplier, preview a downloaded CAD file or confirm the file before conversion.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="what-to-check-viewer">
        <div className={styles.inner}>
          <h2 id="what-to-check-viewer" className={styles.heading}>
            What to check before using the file
          </h2>
          <p className={styles.copy}>
            Check model scale, missing faces, broken geometry, assembly structure and whether the
            file is suitable for conversion, 3D printing, design review or manufacturing handoff.
          </p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionPurple}`} aria-labelledby="related-tools-viewer">
        <div className={styles.inner}>
          <h2 id="related-tools-viewer" className={styles.heading}>
            Related tools
          </h2>
          <div className={styles.linkGrid}>
            {(config.relatedTools || []).map((tool) => (
              <Link key={tool.href} href={tool.href} className={styles.link}>
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CadViewerFormatSections;
