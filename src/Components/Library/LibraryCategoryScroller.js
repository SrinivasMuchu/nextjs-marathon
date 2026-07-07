'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getLibraryPath } from '@/common.helper';
import { getLibraryCategoryIcon } from '@/data/libraryCategoryIcons';
import { get2DLibraryPath, TWO_D_LIBRARY_BASE } from '@/data/twoDLibraryPage';
import styles from './LibraryCategoryScroller.module.css';

const SCROLL_STEP = 240;

function getCategoryHref(category, libraryMode) {
  const categoryName = category?.industry_category_name;
  if (!categoryName) return libraryMode === '2d' ? TWO_D_LIBRARY_BASE : '/library';

  return libraryMode === '2d'
    ? get2DLibraryPath({ categoryName })
    : getLibraryPath({ categoryName });
}

export default function LibraryCategoryScroller({
  categories = [],
  activeCategory = '',
  libraryMode = '3d',
}) {
  const allHref = libraryMode === '2d' ? TWO_D_LIBRARY_BASE : '/library';
  const listRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const node = listRef.current;
    if (!node) return;

    const maxScrollLeft = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 4);
    setCanScrollRight(node.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return undefined;

    updateScrollState();

    const onScroll = () => updateScrollState();
    node.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      node.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [categories.length, updateScrollState]);

  const scrollBy = (direction) => {
    const node = listRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * SCROLL_STEP, behavior: 'smooth' });
  };

  const renderIcon = (category, { isAll = false } = {}) => {
    if (!isAll && category?.logo) {
      return (
        <Image
          src={category.logo}
          alt=""
          width={20}
          height={20}
          className={styles.categoryIconImage}
          aria-hidden
        />
      );
    }

    const Icon = getLibraryCategoryIcon(category?.industry_category_name, { isAll });
    return <Icon className={styles.categoryIcon} aria-hidden />;
  };

  return (
    <div className={styles.scrollerWrap}>
      <button
        type="button"
        className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
        onClick={() => scrollBy(-1)}
        disabled={!canScrollLeft}
        aria-label="Scroll categories left"
      >
        <ChevronLeftIcon fontSize="small" />
      </button>

      <div ref={listRef} className={styles.scrollerTrack}>
        <Link
          href={allHref}
          className={`${styles.categoryChip} ${!activeCategory ? styles.categoryChipActive : ''}`}
        >
          {renderIcon(null, { isAll: true })}
          <span>All</span>
        </Link>

        {categories.map((category) => {
          const categoryName = category.industry_category_name;
          const isActive = activeCategory === categoryName;

          return (
            <Link
              key={categoryName}
              href={getCategoryHref(category, libraryMode)}
              className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ''}`}
            >
              {renderIcon(category)}
              <span>{category.industry_category_label}</span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
        onClick={() => scrollBy(1)}
        disabled={!canScrollRight}
        aria-label="Scroll categories right"
      >
        <ChevronRightIcon fontSize="small" />
      </button>
    </div>
  );
}
