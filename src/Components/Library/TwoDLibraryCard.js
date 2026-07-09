import React from 'react';
import Link from 'next/link';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FallbackImageClient from '../CommonJsx/FallbackImageClient';
import {
  TWO_D_DEFAULT_OUTPUT_FORMATS,
  TWO_D_DEFAULT_PROJECTION,
  TWO_D_DEFAULT_SHEET_LABEL,
  getTwoDPriceLabel,
} from '@/data/twoDLibraryPage';
import styles from './Library.module.css';
import cardStyles from './LibraryProductCard.module.css';

function formatDownloadCount(count) {
  const num = Number(count) || 0;
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(num);
}

function sheetLabel(design) {
  const n = Number(design?.two_d_sheet_count);
  if (Number.isFinite(n) && n > 0) {
    return n === 1 ? '1 SHEET' : `${n} SHEETS`;
  }
  return String(TWO_D_DEFAULT_SHEET_LABEL).toUpperCase();
}

function buildTagsLine(design) {
  const parts = [];
  const category = design?.category_labels?.[0];
  const tag = design?.tag_labels?.[0] || design?.cad_tag_names?.[0];

  if (category) parts.push(String(category).toUpperCase());
  if (tag) parts.push(String(tag).toUpperCase());
  if (!parts.length) parts.push('2D DRAWING');

  return parts.join(' · ');
}

function getOutputFormatChips(design) {
  const raw = design?.two_d_output_formats || TWO_D_DEFAULT_OUTPUT_FORMATS;
  return String(raw)
    .split(/[,·|/]+/)
    .map((part) => part.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 4);
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
  const tagsLine = buildTagsLine(design);
  const formatChips = getOutputFormatChips(design);
  const projection = design.two_d_projection || TWO_D_DEFAULT_PROJECTION;
  const priceLabel = getTwoDPriceLabel(design);
  const isFree = !design?.['2d_price'];
  const downloads = formatDownloadCount(design.total_design_downloads ?? 0);

  return (
    <article className={`${styles['library-designs-items-container']} ${cardStyles.card}`}>
      <div className={`${cardStyles.previewWrap} ${cardStyles.previewWrapNoGrid}`}>
        <span
          className={`${cardStyles.priceBadge} ${
            isFree ? cardStyles.priceBadgeFree : cardStyles.priceBadgePaid
          }`}
        >
          {priceLabel}
        </span>
        <div className={styles['two-d-library-card-preview']}>
          {previewSrc ? (
            <FallbackImageClient
              className={styles['two-d-library-card-preview-img']}
              src={previewSrc}
              alt={`${title} preview`}
            />
          ) : (
            <div className={styles['two-d-library-preview-fallback']}>2D Preview</div>
          )}
        </div>
      </div>

      <div className={cardStyles.body}>
        <div className={cardStyles.tagsRow}>
          <WbSunnyOutlinedIcon className={cardStyles.tagsIcon} aria-hidden />
          <span>{tagsLine}</span>
        </div>

        <h3 className={cardStyles.title}>
          <Link href={drawingHref} className={cardStyles.titleLink}>
            {title}
          </Link>
        </h3>

        <div className={cardStyles.formatRow}>
          {formatChips.map((format) => (
            <span key={format} className={cardStyles.formatChip}>
              {format.startsWith('.') ? format : `.${format}`}
            </span>
          ))}
          <span className={cardStyles.formatChip}>{sheetLabel(design)}</span>
          <span className={cardStyles.formatChip}>{String(projection).toUpperCase()}</span>
        </div>

        <div className={cardStyles.quickLinks}>
          <Link href={drawingHref} className={cardStyles.quickLink}>
            <VisibilityOutlinedIcon className={cardStyles.quickLinkIcon} aria-hidden />
            Open drawing set
          </Link>
          <Link href={source3dHref} className={cardStyles.quickLink}>
            <ArchitectureOutlinedIcon className={cardStyles.quickLinkIcon} aria-hidden />
            Open source 3D CAD
          </Link>
        </div>

        <div className={cardStyles.footer}>
          <span className={cardStyles.downloads}>
            <FileDownloadOutlinedIcon className={cardStyles.downloadsIcon} aria-hidden />
            {downloads} downloads
          </span>
          <div className={cardStyles.footerActions}>
            <Link href={drawingHref} className={cardStyles.previewButton}>
              <VisibilityOutlinedIcon fontSize="small" aria-hidden />
              Preview
            </Link>
            <Link href={drawingHref} className={cardStyles.getButton}>
              Get
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
