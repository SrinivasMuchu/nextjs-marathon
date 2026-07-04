import React from 'react';
import Link from 'next/link';
import {
  LIBRARY_BROWSE_CATEGORIES,
  LIBRARY_BROWSE_FILE_FORMATS,
} from '@/data/libraryPage';
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
        <br/>
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

export default function LibraryBottomSections() {
  return (
    <>
      <BrowseSectionCard
        id="browse-by-format"
        title="Browse CAD models by file format"
        items={LIBRARY_BROWSE_FILE_FORMATS}
        getHref={(item) => `/library/file-format/${item.slug}`}
      />
   
      <BrowseSectionCard
        id="browse-by-category"
        title="Browse CAD models by category"
        items={LIBRARY_BROWSE_CATEGORIES}
        getHref={(item) => `/library/${item.slug}`}
      />
    </>
  );
}
