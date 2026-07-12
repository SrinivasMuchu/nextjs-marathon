import React from 'react';
import Link from 'next/link';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getLibraryClusterPath } from '@/api/libraryClustersApi';
import {
  LIBRARY_BUILD_KITS_META,
  TWO_D_BUILD_KITS_META,
} from '@/data/libraryHubSections';
import styles from './LibraryDiscoverySections.module.css';

export default function LibraryBuildKitsSection({
  clusters = [],
  hideSectionHead = false,
  libraryMode = '3d',
}) {
  const meta = libraryMode === '2d' ? TWO_D_BUILD_KITS_META : LIBRARY_BUILD_KITS_META;

  if (!clusters.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="library-build-kits-title">
      {hideSectionHead ? null : (
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadText}>
            <h2 id="library-build-kits-title" className={styles.sectionTitle}>
              {meta.title}
            </h2>
            <p className={styles.sectionSubtitle}>{meta.subtitle}</p>
          </div>
          <Link href={meta.seeAllHref} className={styles.sectionLink}>
            {meta.seeAllLabel} →
          </Link>
        </div>
      )}

      <div className={styles.kitsGrid}>
        {clusters.map((cluster) => {
          const partCount = Number(cluster?.part_count) || 0;
          const categoryLabel = String(cluster?.cluster_category || 'Build kit').toUpperCase();
          const description =
            cluster?.cluster_description || cluster?.cluster_use_case || '';

          return (
            <Link
              key={cluster?._id || cluster?.cluster_id}
              href={getLibraryClusterPath(cluster, libraryMode)}
              className={styles.kitCard}
            >
              <div className={styles.kitTypeRow}>
                <AutoAwesomeOutlinedIcon className={styles.kitTypeIcon} aria-hidden />
                <span className={styles.kitTypeLabel}>{categoryLabel}</span>
              </div>

              <h3 className={styles.kitTitle}>{cluster.cluster_name}</h3>
              {description ? (
                <p className={styles.kitDescription}>{description}</p>
              ) : null}

              <div className={styles.kitFooter}>
                <span className={styles.kitPartCount}>
                  {partCount} {partCount === 1 ? 'part' : 'parts'}
                </span>
                <span className={styles.kitVerified}>
                  <CheckCircleOutlineIcon className={styles.kitVerifiedIcon} aria-hidden />
                  pairs verified
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
