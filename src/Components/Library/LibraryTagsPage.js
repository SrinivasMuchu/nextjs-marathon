import React from 'react';
import Link from 'next/link';
import Footer from '@/Components/HomePages/Footer/Footer';
import ServerBreadCrumbs from '@/Components/CommonJsx/ServerBreadCrumbs';
import { fetchAllRankedCadTags } from '@/api/cadTagsApi';
import { TWO_D_LIBRARY_BASE } from '@/data/twoDLibraryPage';
import LibraryPartTagCard from './LibraryPartTagCard';
import styles from './LibraryTagsPage.module.css';

const PAGE_COPY = {
  '3d': {
    title: 'Browse by part & function',
    subtitle:
      'The axis engineers actually search on — pick a part type to filter the 3D CAD library.',
    libraryHref: '/library',
    libraryLabel: 'Library',
    breadcrumbLabel: 'Parts & functions',
    emptyCta: 'Browse the 3D library',
  },
  '2d': {
    title: 'Browse by part & function',
    subtitle:
      'The axis engineers actually search on — pick a part type to filter the 2D drawings library.',
    libraryHref: TWO_D_LIBRARY_BASE,
    libraryLabel: '2D drawings',
    breadcrumbLabel: 'Parts & functions',
    emptyCta: 'Browse 2D drawings',
  },
};

export default async function LibraryTagsPage({ libraryMode = '3d' }) {
  const mode = libraryMode === '2d' ? '2d' : '3d';
  const copy = PAGE_COPY[mode];
  const tags = await fetchAllRankedCadTags(mode === '2d');

  return (
    <>
      <ServerBreadCrumbs
        links={[
          { label: copy.libraryLabel, href: copy.libraryHref },
          { label: copy.breadcrumbLabel },
        ]}
      />

      <div className={styles.page}>
        <header className={styles.hero}>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>
          {tags.length > 0 ? (
            <p className={styles.countLabel}>
              {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
            </p>
          ) : null}
        </header>

        {tags.length > 0 ? (
          <div className={styles.grid}>
            {tags.map((tag) => (
              <LibraryPartTagCard
                key={tag?._id || tag?.cad_tag_name}
                tag={tag}
                libraryMode={mode}
              />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            No ranked tags yet.{' '}
            <Link href={copy.libraryHref}>{copy.emptyCta}</Link>
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}
