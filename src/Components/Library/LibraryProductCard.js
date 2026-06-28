import React from 'react';
import Link from 'next/link';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import DesignStats from '../CommonJsx/DesignStats';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import { getLibraryQuickLinks } from '@/data/libraryPage';
import styles from './Library.module.css';
import cardStyles from './LibraryProductCard.module.css';

export default function LibraryProductCard({ design }) {
  const title = design.page_title || 'Untitled design';
  const productHref = `/library/${design.route}`;
  const quickLinks = getLibraryQuickLinks(design.file_type);

  return (
    <div className={styles['library-designs-items-container']}>
      <Link
        href={productHref}
        className={styles['library-designs-primary-link']}
        aria-label={title}
      >
        <HoverImageSequence design={design} width={280} height={233} />
        <h6 title={title}>{title}</h6>
      </Link>

      <div className={styles['design-title-wrapper']}>
        <div
          className={styles['design-title-text']}
          style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}
        >
          {design.category_labels?.map((label, index) => (
            <DesignDetailsStats key={`cat-${index}`} text={label} type="category" />
          ))}
          {design.tag_labels?.slice(0, 2).map((label, index) => (
            <DesignDetailsStats key={`tag-${index}`} text={label} type="tag" />
          ))}
          <DesignDetailsStats
            fileType={design.file_type ? `.${design.file_type.toLowerCase()}` : '.STEP'}
            text={design.file_type ? `.${design.file_type.toUpperCase()}` : '.STEP'}
          />
          <div className={styles['design-stats-wrapper']}>
            <DesignStats
              views={design.total_design_views ?? 0}
              downloads={design.total_design_downloads ?? 0}
            />
          </div>
        </div>
        <span className={styles['design-title-wrapper-price']}>
          {design.price ? `$${design.price}` : 'Free'}
        </span>
      </div>

      {quickLinks.length > 0 ? (
        <div className={cardStyles.quickLinks}>
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cardStyles.quickLink}>
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
