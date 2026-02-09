import React from 'react';
import Link from 'next/link';
import { converterTypes } from '@/common.helper';
import styles from './CadConverterTypes.module.css';

function CadConverterTypes() {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <p className={styles.label}>POPULAR CONVERSIONS</p>
        <h2 className={styles.mainHeading}>CAD Converter Types</h2>

        <div className={styles.grid}>
          {converterTypes.map((type, index) => (
            <Link
              key={index}
              href={`/tools/convert-${type.path.slice(1)}`}
              className={styles.card}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{type.label}</h3>
                <p className={styles.cardDescription}>
                  {type.oneLiner}
                </p>
              </div>
              {/* <span className={styles.arrow} aria-hidden>&gt;</span> */}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CadConverterTypes;
