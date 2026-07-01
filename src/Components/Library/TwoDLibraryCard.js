import React from 'react';
import Link from 'next/link';
import FallbackImageClient from '../CommonJsx/FallbackImageClient';
import {
  TWO_D_DEFAULT_OUTPUT_FORMATS,
  TWO_D_DEFAULT_PROJECTION,
  TWO_D_DEFAULT_SHEET_LABEL,
  TWO_D_DRAWING_TYPE,
} from '@/data/twoDLibraryPage';
import styles from './Library.module.css';
import cardStyles from './TwoDLibraryCard.module.css';

function sheetLabel(design) {
  const n = Number(design?.two_d_sheet_count);
  if (Number.isFinite(n) && n > 0) {
    return n === 1 ? '1 sheet' : `${n} sheets`;
  }
  return TWO_D_DEFAULT_SHEET_LABEL;
}

function sectionCutsLabel(design) {
  const n = Number(design?.two_d_section_cuts);
  if (Number.isFinite(n) && n >= 0) {
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
  const sourceFormat = String(design.file_type || 'step').toUpperCase();
  const priceLabel = design.price ? `$${design.price}` : 'Free';

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

      <dl className={cardStyles.metaGrid}>
        <div className={cardStyles.metaRow}>
          <dt>Drawing type</dt>
          <dd>{TWO_D_DRAWING_TYPE}</dd>
        </div>
        <div className={cardStyles.metaRow}>
          <dt>Source CAD format</dt>
          <dd>{sourceFormat}</dd>
        </div>
        <div className={cardStyles.metaRow}>
          <dt>Number of sheets</dt>
          <dd>{sheetLabel(design)}</dd>
        </div>
        <div className={cardStyles.metaRow}>
          <dt>Available formats</dt>
          <dd>{design.two_d_output_formats || TWO_D_DEFAULT_OUTPUT_FORMATS}</dd>
        </div>
        <div className={cardStyles.metaRow}>
          <dt>Section cuts</dt>
          <dd>{sectionCutsLabel(design)}</dd>
        </div>
        <div className={cardStyles.metaRow}>
          <dt>Projection type</dt>
          <dd>{design.two_d_projection || TWO_D_DEFAULT_PROJECTION}</dd>
        </div>
        <div className={cardStyles.metaRow}>
          <dt>Free or paid</dt>
          <dd>{priceLabel}</dd>
        </div>
      </dl>

      <div className={cardStyles.actions}>
        <Link href={drawingHref} className={cardStyles.primaryBtn}>
          Open drawing set
        </Link>
        <Link href={source3dHref} className={cardStyles.secondaryBtn}>
          Open source 3D CAD
        </Link>
      </div>
    </div>
  );
}
