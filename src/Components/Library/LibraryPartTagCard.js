import React from 'react';
import Link from 'next/link';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { getLibraryPath } from '@/common.helper';
import { get2DLibraryPath } from '@/data/twoDLibraryPage';
import styles from './LibraryTagsPage.module.css';

function getTagHref(tagName, libraryMode) {
  if (libraryMode === '2d') {
    return get2DLibraryPath({ tagName });
  }
  return getLibraryPath({ tagName });
}

export default function LibraryPartTagCard({ tag, libraryMode = '3d' }) {
  const tagName = tag?.cad_tag_name || '';
  const label = tag?.cad_tag_label || tagName;
  const partCount = Number(tag?.product_count) || 0;

  if (!tagName) {
    return null;
  }

  return (
    <Link href={getTagHref(tagName, libraryMode)} className={styles.tagCard}>
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
