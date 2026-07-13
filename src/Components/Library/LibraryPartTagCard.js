import React from 'react';
import Link from 'next/link';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { getLibraryPath } from '@/common.helper';
import { get2DLibraryPath } from '@/data/twoDLibraryPage';
import styles from './LibraryTagsPage.module.css';

function getTagHref(tagName, libraryMode, categoryName = null) {
  if (libraryMode === '2d') {
    return get2DLibraryPath({ categoryName, tagName });
  }
  return getLibraryPath({ categoryName, tagName });
}

function getClearTagHref(libraryMode, categoryName = null) {
  if (libraryMode === '2d') {
    return get2DLibraryPath({ categoryName: categoryName || null, tagName: null });
  }
  return getLibraryPath({ categoryName: categoryName || null, tagName: null });
}

export default function LibraryPartTagCard({
  tag,
  libraryMode = '3d',
  activeTag = '',
  categoryName = null,
}) {
  const tagName = tag?.cad_tag_name || '';
  const label = tag?.cad_tag_label || tagName;
  const partCount = Number(tag?.product_count) || 0;
  const isActive = Boolean(activeTag && tagName && activeTag === tagName);

  if (!tagName) {
    return null;
  }

  return (
    <Link
      href={isActive ? getClearTagHref(libraryMode, categoryName) : getTagHref(tagName, libraryMode, categoryName)}
      className={`${styles.tagCard} ${isActive ? styles.tagCardActive : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={styles.tagIconWrap} aria-hidden>
        <LocalOfferOutlinedIcon className={styles.tagIcon} />
      </span>
      <p className={styles.tagLabel}>{label}</p>
      <p className={styles.tagCount}>
        {partCount} {partCount === 1 ? 'part' : 'parts'}
      </p>
    </Link>
  );
}
