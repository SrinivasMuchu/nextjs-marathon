import React from 'react';
import styles from './CadConverterSections.module.css';

function WhenToUseConverter() {
  return (
    <section className={`${styles.section} ${styles.sectionMuted}`} aria-labelledby="when-to-use-converter">
      <div className={styles.inner}>
        <h2 id="when-to-use-converter" className={styles.heading}>
          When to use the CAD file converter
        </h2>
        <p className={styles.copy}>
          Use the CAD file converter when you need to prepare files for 3D printing, CAD review,
          supplier handoff, manufacturing, prototyping or design collaboration.
        </p>
      </div>
    </section>
  );
}

export default WhenToUseConverter;
