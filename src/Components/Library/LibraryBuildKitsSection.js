'use client';

import React from 'react';
import Link from 'next/link';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getLibraryPathWithQuery, sendGAtagEvent } from '@/common.helper';
import { CAD_LIBRARY_EVENT } from '@/config';
import { get2DLibraryPathWithQuery } from '@/data/twoDLibraryPage';
import { getLibraryClusterPath } from '@/api/libraryClustersApi';
import {
  LIBRARY_BUILD_KITS_META,
  TWO_D_BUILD_KITS_META,
} from '@/data/libraryHubSections';
import styles from './LibraryDiscoverySections.module.css';

function buildClearClusterHref(libraryMode, filters = {}) {
  const base = {
    categoryName: filters.category || null,
    tagName: filters.tags || null,
    search: filters.search || undefined,
    sort: filters.sort || undefined,
    recency: filters.recency || undefined,
    free_paid: filters.free_paid || undefined,
    file_format: filters.file_format || undefined,
    two_dims: filters.two_dims || undefined,
    output_format: filters.output_format || undefined,
    projection: filters.projection || undefined,
    page: 1,
  };

  return libraryMode === '2d'
    ? get2DLibraryPathWithQuery(base)
    : getLibraryPathWithQuery(base);
}

export default function LibraryBuildKitsSection({
  clusters = [],
  hideSectionHead = false,
  libraryMode = '3d',
  activeClusterId = '',
  filterState = {},
}) {
  const meta = libraryMode === '2d' ? TWO_D_BUILD_KITS_META : LIBRARY_BUILD_KITS_META;

  if (!clusters.length) {
    return null;
  }

  const clearHref = buildClearClusterHref(libraryMode, filterState);

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
          {meta.seeAllHref ? (
            <Link
              href={meta.seeAllHref}
              className={styles.sectionLink}
              onClick={() => {
                sendGAtagEvent({
                  event_name: 'library_clusters_see_all_click',
                  event_category: CAD_LIBRARY_EVENT,
                  library_mode: libraryMode,
                });
              }}
            >
              {meta.seeAllLabel} →
            </Link>
          ) : null}
        </div>
      )}

      <div className={styles.kitsScrollerTrack}>
        {clusters.map((cluster) => {
          const clusterId = cluster?.cluster_id;
          if (!clusterId) return null;

          const partCount = Number(cluster?.part_count) || 0;
          const categoryLabel = String(cluster?.cluster_category || 'Build kit').toUpperCase();
          const description =
            cluster?.cluster_description || cluster?.cluster_use_case || '';
          const isActive = activeClusterId === clusterId;
          const href = isActive
            ? clearHref
            : getLibraryClusterPath(cluster, libraryMode);
          const clusterName = cluster?.cluster_name || clusterId;

          return (
            <Link
              key={cluster?._id || clusterId}
              href={href}
              className={`${styles.kitCard} ${isActive ? styles.kitCardActive : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => {
                sendGAtagEvent({
                  event_name: isActive
                    ? 'library_cluster_clear_click'
                    : 'library_cluster_click',
                  event_category: CAD_LIBRARY_EVENT,
                  event_label: clusterName,
                  cluster_id: clusterId,
                  cluster_slug: cluster?.cluster_slug || '',
                  library_mode: libraryMode,
                });
              }}
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
