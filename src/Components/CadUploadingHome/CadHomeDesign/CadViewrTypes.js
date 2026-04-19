import React from 'react';
import Link from 'next/link';
import { cadViewTypes } from '@/common.helper';
import styles from './CadViewrTypes.module.css';

/** Derive short format label for pill (e.g. "STEP viewer" → "STEP") — data stays in cadViewTypes. */
function formatPillFromLabel(label) {
  if (!label || typeof label !== 'string') return '';
  const m = label.match(/^(.+?)\s+viewer\s*$/i);
  return m ? m[1].trim() : label.replace(/\s+viewer\s*$/i, '').trim() || label;
}

function CadViewrTypes() {
  return (
    <section className={styles.section} aria-labelledby="cad-viewer-types-heading">
      <div className={styles.wrapper}>
        <p className={styles.label}>View popular CAD formats</p>
        <h2 id="cad-viewer-types-heading" className={styles.mainHeading}>
          Supported format viewers
        </h2>

        <div className={styles.grid}>
          {cadViewTypes.map((type, index) => {
            const pillText = formatPillFromLabel(type.label);
            return (
              <Link
                key={index}
                href={`/tools${type.path}-file-viewer`}
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.formatPill}>{pillText}</span>
                    <span className={styles.viewerTitle}>Viewer</span>
                  </div>
                  {type.oneLiner ? (
                    <p className={styles.cardDescription}>{type.oneLiner}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CadViewrTypes;
