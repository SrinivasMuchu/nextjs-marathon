import React from 'react';
import Link from 'next/link';
import { TWO_D_POPULAR_CATEGORIES, get2DLibraryPath } from '@/data/twoDLibraryPage';
import gridStyles from './Library.module.css';
import hireStyles from './LibraryHireCtaCard.module.css';
import styles from './LibraryBottomSections.module.css';

function BrowseSectionCard({ id, title, items, getHref }) {
  return (
    <div className={`${gridStyles['library-designs-items-container']} ${gridStyles.libraryHireCtaSlot}`}>
      <div className={`${hireStyles.card} ${styles.browseCard}`}>
        <h2 id={id} className={styles.cardTitle}>
          {title}
        </h2>
        <br />
        <div className={styles.links}>
          {items.map((item) => (
            <Link key={item.slug} href={getHref(item)} className={styles.linkPill}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TwoDLibraryBottomSections() {
  return (
    <>
      <BrowseSectionCard
        id="popular-2d-categories"
        title="Popular 2D drawing categories"
        items={TWO_D_POPULAR_CATEGORIES}
        getHref={(item) => get2DLibraryPath({ categoryName: item.slug })}
      />
      <div className={`${gridStyles['library-designs-items-container']} ${gridStyles.libraryHireCtaSlot}`}>
        <div className={`${hireStyles.card} ${styles.browseCard}`}>
          <h2 className={styles.cardTitle}>Have a 3D CAD file?</h2>
          <p className={hireStyles.body}>
            Generate your own 2D drawing set from a STEP, STP, IGES or FreeCAD file in minutes.
          </p>
          <Link href="/tools/cad-drawing-pipeline" className={hireStyles.cta}>
            Generate my 2D drawing
          </Link>
        </div>
      </div>
    </>
  );
}
