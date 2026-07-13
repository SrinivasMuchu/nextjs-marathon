import React from 'react';
import Link from 'next/link';
import LibraryPartTagCard from './LibraryPartTagCard';
import styles from './LibraryDiscoverySections.module.css';

export default function LibraryBrowsePartsSection({
  tags = [],
  title,
  subtitle,
  seeAllHref,
  seeAllLabel = 'See all parts',
  libraryMode = '3d',
  activeTag = '',
  categoryName = null,
}) {
  if (!tags.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="library-browse-parts-title">
      <div className={styles.sectionHead}>
        <div className={styles.sectionHeadText}>
          <h2 id="library-browse-parts-title" className={styles.sectionTitle}>
            {title}
          </h2>
          <p className={styles.sectionSubtitle}>{subtitle}</p>
        </div>
        {seeAllHref ? (
          <Link href={seeAllHref} className={styles.sectionLink}>
            {seeAllLabel} →
          </Link>
        ) : null}
      </div>

      <div className={styles.partsRow}>
        {tags.map((tag) => (
          <div key={tag?._id || tag?.cad_tag_name} className={styles.partCardSlot}>
            <LibraryPartTagCard
              tag={tag}
              libraryMode={libraryMode}
              activeTag={activeTag}
              categoryName={categoryName}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
