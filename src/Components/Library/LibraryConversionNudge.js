'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import useConverterPriceDisplay from '@/Components/HomePages/shared/useConverterPriceDisplay';
import styles from './LibraryConversionNudge.module.css';

/**
 * Full-width conversion promo shown between the first and second rows
 * of the 3D library results grid.
 */
function LibraryConversionNudge() {
  const { priceLabel } = useConverterPriceDisplay('$2.99');
  const price = priceLabel || '$2.99';

  return (
    <aside className={styles.nudge} aria-label="CAD file converter">
      <div className={styles.formats} aria-hidden>
        <span className={styles.formatFrom}>STEP</span>
        <ArrowRight size={14} strokeWidth={2.25} className={styles.arrow} />
        <span className={styles.formatTo}>STL</span>
      </div>

      <div className={styles.copy}>
        <p className={styles.title}>Downloaded a model your software can&apos;t open?</p>
        <p className={styles.subtitle}>
          Any library file, any of 60+ routes, up to 300 MB — {price} per download.
        </p>
      </div>

      <Link href="/tools/3d-cad-file-converter" className={styles.cta}>
        Open the converter
        <ArrowRight size={16} strokeWidth={2.25} aria-hidden />
      </Link>
    </aside>
  );
}

export default LibraryConversionNudge;
