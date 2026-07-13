'use client';

import React from 'react';
import Link from 'next/link';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { getLibraryPath, sendGAtagEvent } from '@/common.helper';
import { CAD_LIBRARY_EVENT } from '@/config';
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

  const trackTagClick = () => {
    sendGAtagEvent({
      event_name: isActive ? 'library_tag_clear_click' : 'library_tag_click',
      event_category: CAD_LIBRARY_EVENT,
      event_label: label || tagName,
      tag_name: tagName,
      library_mode: libraryMode,
      source: 'browse',
    });
  };

  return (
    <Link
      href={isActive ? getClearTagHref(libraryMode, categoryName) : getTagHref(tagName, libraryMode, categoryName)}
      className={`${styles.tagCard} ${isActive ? styles.tagCardActive : ''}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={trackTagClick}
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
