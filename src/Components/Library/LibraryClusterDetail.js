import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import axios from 'axios';
import Footer from '@/Components/HomePages/Footer/Footer';
import ServerBreadCrumbs from '@/Components/CommonJsx/ServerBreadCrumbs';
import LibraryProductCard from '@/Components/Library/LibraryProductCard';
import TwoDLibraryCard from '@/Components/Library/TwoDLibraryCard';
import {
  fetchLibraryClusters,
  getLibraryClusterPath,
  getLibraryClustersPath,
} from '@/api/libraryClustersApi';
import { buildLibraryDesignsParams } from '@/api/libraryDesignsApi';
import { buildTwoDLibraryDesignsParams } from '@/api/twoDLibraryDesignsApi';
import { BASE_URL } from '@/config';
import styles from '@/Components/Library/Library.module.css';
import pageStyles from '@/Components/Library/LibraryTagsPage.module.css';

export default async function LibraryClusterDetail({
  slug,
  searchParams,
  libraryMode = '3d',
}) {
  const page = parseInt(searchParams?.page, 10) || 1;
  const limit = 22;
  const is2d = libraryMode === '2d';

  const clusters = await fetchLibraryClusters({
    slug,
    twoDims: is2d,
  });
  const cluster = clusters[0];
  if (!cluster) {
    notFound();
  }

  const cookieStore = cookies();
  const uuid = cookieStore.get('uuid')?.value || null;

  const apiParams = is2d
    ? buildTwoDLibraryDesignsParams({
        cluster_id: cluster.cluster_id,
        sort: searchParams?.sort || 'newest',
        page,
        limit,
        uuid,
      })
    : buildLibraryDesignsParams({
        cluster_id: cluster.cluster_id,
        sort: searchParams?.sort || 'newest',
        page,
        limit,
        uuid,
      });
  const queryString = new URLSearchParams(apiParams).toString();

  let designs = [];
  let pagination = {};
  try {
    const response = await axios.get(
      `${BASE_URL}/v1/cad/get-category-design?${queryString}`,
      { cache: 'no-store' }
    );
    designs = response.data?.data?.designDetails || [];
    pagination = response.data?.data?.pagination || {};
  } catch (err) {
    console.error('Failed to load cluster designs', err?.message || err);
  }

  const partCount = Number(cluster.part_count) || designs.length;
  const clustersHref = getLibraryClustersPath(libraryMode);
  const libraryHref = is2d ? '/library/2d-technical-drawings' : '/library';
  const clusterPath = getLibraryClusterPath(cluster, libraryMode);

  return (
    <>
      <ServerBreadCrumbs
        links={[
          { label: is2d ? '2D Library' : 'Library', href: libraryHref },
          { label: 'Build kits', href: clustersHref },
          { label: cluster.cluster_name },
        ]}
      />

      <div className={pageStyles.page}>
        <header className={pageStyles.hero}>
          <p className={pageStyles.countLabel}>
            {String(cluster.cluster_category || 'Build kit').toUpperCase()}
          </p>
          <h1 className={pageStyles.title}>{cluster.cluster_name}</h1>
          {cluster.cluster_description ? (
            <p className={pageStyles.subtitle}>{cluster.cluster_description}</p>
          ) : null}
          {cluster.cluster_use_case ? (
            <p className={pageStyles.subtitle}>{cluster.cluster_use_case}</p>
          ) : null}
          <p className={pageStyles.countLabel}>
            {partCount} {partCount === 1 ? (is2d ? 'drawing' : 'part') : is2d ? 'drawings' : 'parts'}
          </p>
        </header>

        {designs.length > 0 ? (
          <div className={styles['library-designs-items']}>
            {designs.map((design) =>
              is2d ? (
                <TwoDLibraryCard key={design._id} design={design} />
              ) : (
                <LibraryProductCard key={design._id} design={design} />
              )
            )}
          </div>
        ) : (
          <p className={pageStyles.empty}>
            No {is2d ? '2D drawings' : 'designs'} linked to this kit yet.{' '}
            <Link href={clustersHref}>Browse all collections</Link>
          </p>
        )}

        {pagination?.hasNextPage || pagination?.hasPrevPage ? (
          <div className={styles['library-pagination']} style={{ marginTop: 24 }}>
            {pagination.hasPrevPage ? (
              <Link
                href={`${clusterPath}?page=${page - 1}`}
                className={styles['pagination-button']}
              >
                Previous
              </Link>
            ) : null}
            <span>
              Page {pagination.currentPage || page}
              {pagination.totalPages ? ` of ${pagination.totalPages}` : ''}
            </span>
            {pagination.hasNextPage ? (
              <Link
                href={`${clusterPath}?page=${page + 1}`}
                className={styles['pagination-button']}
              >
                Next
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      <Footer />
    </>
  );
}

export async function getLibraryClusterMetadata(slug, libraryMode = '3d') {
  const clusters = await fetchLibraryClusters({
    slug,
    twoDims: libraryMode === '2d',
  });
  const cluster = clusters[0];
  if (!cluster) {
    return {
      title:
        libraryMode === '2d'
          ? '2D Build Kit | Marathon OS'
          : 'Build kit | Marathon OS',
    };
  }

  const is2d = libraryMode === '2d';
  return {
    title: is2d
      ? `${cluster.cluster_name} | 2D Drawing Build Kit | Marathon OS`
      : `${cluster.cluster_name} | CAD Build Kit | Marathon OS`,
    description:
      cluster.cluster_description ||
      cluster.cluster_use_case ||
      (is2d
        ? `Browse 2D drawing sets in the ${cluster.cluster_name} build kit on Marathon OS.`
        : `Browse the ${cluster.cluster_name} CAD build kit on Marathon OS.`),
    alternates: { canonical: getLibraryClusterPath(cluster, libraryMode) },
  };
}
