import React from 'react';
import Link from 'next/link';
import { cadViewTypes } from '@/common.helper';
import styles from './CadViewrTypes.module.css';

function CadViewrTypes() {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <p className={styles.label}>VIEW POPULAR CAD FORMATS</p>
        <h2 className={styles.mainHeading}>View popular CAD formats</h2>

        <div className={styles.grid}>
          {cadViewTypes.map((type, index) => (
            <Link
              key={index}
              href={`/tools${type.path}-file-viewer`}
              className={styles.card}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{type.label}</h3>
                {type.oneLiner && (
                  <p className={styles.cardDescription}>{type.oneLiner}</p>
                )}
              </div>
              {/* <span className={styles.arrow} aria-hidden>&gt;</span> */}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CadViewrTypes;
