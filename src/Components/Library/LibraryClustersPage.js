import React from 'react';
import Link from 'next/link';
import Footer from '@/Components/HomePages/Footer/Footer';
import ServerBreadCrumbs from '@/Components/CommonJsx/ServerBreadCrumbs';
import { fetchLibraryClusters } from '@/api/libraryClustersApi';
import LibraryBuildKitsSection from './LibraryBuildKitsSection';
import styles from './LibraryTagsPage.module.css';

export default async function LibraryClustersPage({ libraryMode = '3d' }) {
  const is2d = libraryMode === '2d';
  const clusters = await fetchLibraryClusters({ twoDims: is2d });
  const libraryHref = is2d ? '/library/2d-technical-drawings' : '/library';

  return (
    <>
      <ServerBreadCrumbs
        links={[
          { label: is2d ? '2D Library' : 'Library', href: libraryHref },
          { label: 'Build kits' },
        ]}
      />

      <div className={styles.page}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Build kits</h1>
          <p className={styles.subtitle}>
            {is2d
              ? 'Curated systems with verified mating parts — browse the 2D drawing sets for each kit.'
              : 'Curated systems with verified mating parts — download the whole assembly at once.'}
          </p>
          {clusters.length > 0 ? (
            <p className={styles.countLabel}>
              {clusters.length} {clusters.length === 1 ? 'collection' : 'collections'}
            </p>
          ) : null}
        </header>

        {clusters.length > 0 ? (
          <LibraryBuildKitsSection
            clusters={clusters}
            hideSectionHead
            libraryMode={libraryMode}
            filterState={{}}
          />
        ) : (
          <p className={styles.empty}>
            No build kits yet.{' '}
            <Link href={libraryHref}>Browse the library</Link>
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}
