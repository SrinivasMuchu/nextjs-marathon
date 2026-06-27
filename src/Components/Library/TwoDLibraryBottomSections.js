import React from 'react';
import Link from 'next/link';
import { POPULAR_2D_CATEGORIES, buildTwoDLibraryHref } from '@/data/twoDLibraryPage';
import styles from './TwoDLibrary.module.css';

export default function TwoDLibraryBottomSections({ basePath = '/library/2d-technical-drawings' }) {
  return (
    <>
      <section className={styles.bottomSection} aria-labelledby="popular-2d-categories">
        <h2 id="popular-2d-categories" className={styles.bottomSectionTitle}>
          Popular 2D drawing categories
        </h2>
        <div className={styles.categoryLinks}>
          {POPULAR_2D_CATEGORIES.map((item) => (
            <Link
              key={item.search}
              href={buildTwoDLibraryHref({ basePath, category: item.search, page: 1 })}
              className={styles.categoryLink}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.bottomSection} ${styles.generateCta}`} aria-labelledby="have-3d-cad-file">
        <h2 id="have-3d-cad-file" className={styles.bottomSectionTitle}>
          Have a 3D CAD file?
        </h2>
        <p className={styles.generateCopy}>
          Generate your own 2D drawing set from a STEP, STP, IGES or FreeCAD file in minutes.
        </p>
        <Link href="/tools/cad-drawing-pipeline" className={styles.generateBtn}>
          Generate my 2D drawing
        </Link>
      </section>
    </>
  );
}
