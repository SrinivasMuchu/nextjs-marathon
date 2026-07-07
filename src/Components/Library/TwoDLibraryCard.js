import React from 'react';
import Link from 'next/link';
import FallbackImageClient from '../CommonJsx/FallbackImageClient';
import DesignStats from '../CommonJsx/DesignStats';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import {
  TWO_D_DEFAULT_OUTPUT_FORMATS,
  TWO_D_DEFAULT_PROJECTION,
  TWO_D_DEFAULT_SHEET_LABEL,
  TWO_D_DRAWING_TYPE,
  getTwoDPriceLabel,
} from '@/data/twoDLibraryPage';
import styles from './Library.module.css';
import cardStyles from './LibraryProductCard.module.css';

function sheetLabel(design) {
  const n = Number(design?.two_d_sheet_count);
  if (Number.isFinite(n) && n > 0) {
    return n === 1 ? '1 sheet' : `${n} sheets`;
  }
  return TWO_D_DEFAULT_SHEET_LABEL;
}

function sectionCutsLabel(design) {
  const n = Number(design?.two_d_section_cuts);
  if (Number.isFinite(n) && n > 0) {
    return n === 1 ? '1 section cut' : `${n} section cuts`;
  }
  return 'Section cuts included';
}

export default function TwoDLibraryCard({ design }) {
  const title = design.page_title || design.part_name || 'Untitled design';
  const route = String(design.route || '').trim();
  const drawingHref = route
    ? `/library/2d-technical-drawings/${encodeURIComponent(route)}`
    : `/library/2d-technical-drawings/${design._id}`;
  const source3dHref = route ? `/library/${encodeURIComponent(route)}` : drawingHref;
  const previewSrc = design?._id
    ? `/api/techdraw-file?designId=${encodeURIComponent(design._id)}&sheet=1&ext=svg`
    : '';
  const sourceFormat = String(design.file_type || 'step').toLowerCase();
  const outputFormats = design.two_d_output_formats || TWO_D_DEFAULT_OUTPUT_FORMATS;
  const projection = design.two_d_projection || TWO_D_DEFAULT_PROJECTION;
  const priceLabel = getTwoDPriceLabel(design);

  return (
    <div className={styles['library-designs-items-container']}>
      <Link
        href={drawingHref}
        className={styles['library-designs-primary-link']}
        aria-label={title}
      >
        <div className={styles['two-d-library-preview-wrap']}>
          {previewSrc ? (
            <FallbackImageClient
              className={styles['two-d-library-preview-img']}
              src={previewSrc}
              alt={`${title} preview`}
            />
          ) : (
            <div className={styles['two-d-library-preview-fallback']}>2D Preview</div>
          )}
        </div>
        <h6 title={title}>{title}</h6>
      </Link>

      <div className={styles['design-title-wrapper']}>
        <div
          className={styles['design-title-text']}
          style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <DesignDetailsStats text={TWO_D_DRAWING_TYPE} type="category" />
          {design.category_labels?.slice(0, 1).map((label, index) => (
            <DesignDetailsStats key={`cat-${index}`} text={label} type="category" />
          ))}
          <DesignDetailsStats
            fileType={`.${sourceFormat}`}
            text={`.${sourceFormat.toUpperCase()}`}
          />
          <DesignDetailsStats text={sheetLabel(design)} type="tag" />
          <DesignDetailsStats text={projection} type="tag" />
          <div className={styles['design-stats-wrapper']}>
            <DesignStats
              views={design.total_design_views ?? 0}
              downloads={design.total_design_downloads ?? 0}
            />
          </div>
        </div>
        <span className={styles['design-title-wrapper-price']}>{priceLabel}</span>
      </div>

      <div className={cardStyles.quickLinksRow}>
        <Link href={drawingHref} className={cardStyles.quickLink}>
          Open drawing set
        </Link>
        <Link href={source3dHref} className={cardStyles.quickLink}>
          Open source 3D CAD
        </Link>
        <span className={cardStyles.quickLinkMeta}>
          {outputFormats} · {sectionCutsLabel(design)}
        </span>
      </div>
    </div>
  );
}
