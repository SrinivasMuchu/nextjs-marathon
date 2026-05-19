import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { popularCadConverterTypes } from '@/common.helper';
import styles from './CadConverterTypes.module.css';

function CadConverterTypes() {
  return (
    <section className={styles.section} aria-labelledby="cad-converter-types-heading">
      <div className={styles.inner}>
        <p className={styles.label}>Popular conversions.</p>
        <h2 id="cad-converter-types-heading" className={styles.mainHeading}>
          CAD Converter Types
        </h2>

        <div className={styles.grid}>
          {popularCadConverterTypes.map((item) => (
            <Link
              key={item.path}
              href={`/tools/convert-${item.path.slice(1)}`}
              className={styles.card}
            >
              <div className={styles.badgeRow}>
                <span className={styles.pillFrom}>{item.from}</span>
                <span className={styles.arrowWrap} aria-hidden>
                  <ArrowRight size={16} strokeWidth={2.5} className={styles.arrowIcon} />
                </span>
                <span className={styles.pillTo}>{item.to}</span>
              </div>
              <p className={styles.cardDescription}>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CadConverterTypes;
