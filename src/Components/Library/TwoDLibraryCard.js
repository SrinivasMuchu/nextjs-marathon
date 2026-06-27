import React from 'react';
import Link from 'next/link';
import FallbackImageClient from '@/Components/CommonJsx/FallbackImageClient';
import {
  TWO_D_LIBRARY_DEFAULT_FORMATS,
  TWO_D_LIBRARY_DEFAULT_PROJECTION,
  TWO_D_LIBRARY_DEFAULT_SHEETS_LABEL,
  TWO_D_LIBRARY_DRAWING_TYPE,
  TWO_D_LIBRARY_SECTION_CUTS_LABEL,
  formatSourceCadFormat,
  getSourceCadHref,
  getTwoDDesignHref,
} from '@/data/twoDLibraryPage';
import styles from './TwoDLibrary.module.css';

export default function TwoDLibraryCard({ design }) {
  const title = design.page_title || design.part_name || design.name || 'Untitled design';
  const drawingHref = getTwoDDesignHref(design);
  const sourceCadHref = getSourceCadHref(design);
  const previewSrc = design?._id
    ? `/api/techdraw-file?designId=${encodeURIComponent(design._id)}&sheet=1&ext=svg`
    : '';
  const priceLabel = design.price ? `$${design.price}` : 'Free';

  return (
    <article className={styles.card}>
      <Link href={drawingHref} className={styles.previewLink} aria-label={title}>
        <div className={styles.previewWrap}>
          {previewSrc ? (
            <FallbackImageClient
              className={styles.previewImg}
              src={previewSrc}
              alt={`${title} preview`}
            />
          ) : (
            <div className={styles.previewFallback}>2D Preview</div>
          )}
        </div>
      </Link>

      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>
          <Link href={drawingHref}>{title}</Link>
        </h2>

        <dl className={styles.metaGrid}>
          <div className={styles.metaRow}>
            <dt>Drawing type</dt>
            <dd>{TWO_D_LIBRARY_DRAWING_TYPE}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Source CAD format</dt>
            <dd>{formatSourceCadFormat(design.file_type)}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Number of sheets</dt>
            <dd>{TWO_D_LIBRARY_DEFAULT_SHEETS_LABEL}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Available formats</dt>
            <dd>{TWO_D_LIBRARY_DEFAULT_FORMATS}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Section cuts</dt>
            <dd>{TWO_D_LIBRARY_SECTION_CUTS_LABEL}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Projection type</dt>
            <dd>{TWO_D_LIBRARY_DEFAULT_PROJECTION}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Access</dt>
            <dd>{priceLabel}</dd>
          </div>
        </dl>

        <div className={styles.cardActions}>
          <Link href={drawingHref} className={styles.primaryBtn}>
            Open drawing set
          </Link>
          <Link href={sourceCadHref} className={styles.secondaryBtn}>
            Open source 3D CAD
          </Link>
        </div>
      </div>
    </article>
  );
}
