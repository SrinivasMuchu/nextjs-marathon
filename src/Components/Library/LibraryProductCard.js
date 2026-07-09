import React from 'react';
import Link from 'next/link';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import { getLibraryQuickLinks } from '@/data/libraryPage';
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

function getCardFileFormats(design) {
  const formats = new Set();
  const primary = String(design?.file_type || 'step').toUpperCase();
  if (primary) formats.add(primary);

  (design?.supporting_files || []).forEach((file) => {
    const name = file?.name || file?.fileName || '';
    const match = name.match(/\.([a-z0-9]+)$/i);
    if (match) formats.add(match[1].toUpperCase());
  });

  return Array.from(formats).slice(0, 4);
}

function buildTagsLine(design) {
  const parts = [];
  const category = design?.category_labels?.[0];
  const tag = design?.tag_labels?.[0] || design?.cad_tag_names?.[0];

  if (category) parts.push(String(category).toUpperCase());
  if (tag) parts.push(String(tag).toUpperCase());

  return parts.join(' · ');
}

export default function LibraryProductCard({ design }) {
  const title = design.page_title || design.part_name || 'Untitled design';
  const productHref = `/library/${design.route}`;
  const quickLinks = getLibraryQuickLinks(design.file_type).slice(0, 2);
  const fileFormats = getCardFileFormats(design);
  const tagsLine = buildTagsLine(design);
  const priceLabel = design.price ? `$${design.price}` : 'Free';
  const isFree = !design.price;
  const downloads = formatDownloadCount(design.total_design_downloads ?? 0);

  return (
    <article className={`${styles['library-designs-items-container']} ${cardStyles.card}`}>
      <div className={cardStyles.previewWrap}>
        <span
          className={`${cardStyles.priceBadge} ${
            isFree ? cardStyles.priceBadgeFree : cardStyles.priceBadgePaid
          }`}
        >
          {priceLabel}
        </span>
        <HoverImageSequence
          design={design}
          width={413}
          height={257}
          containerClassName={styles['library-card-preview-img']}
        />
      </div>

      <div className={cardStyles.body}>
        {tagsLine ? (
          <div className={cardStyles.tagsRow}>
            <WbSunnyOutlinedIcon className={cardStyles.tagsIcon} aria-hidden />
            <span>{tagsLine}</span>
          </div>
        ) : null}

        <h3 className={cardStyles.title}>
          <Link href={productHref} className={cardStyles.titleLink}>
            {title}
          </Link>
        </h3>

        {fileFormats.length > 0 ? (
          <div className={cardStyles.formatRow}>
            {fileFormats.map((format) => (
              <span key={format} className={cardStyles.formatChip}>
                .{format}
              </span>
            ))}
          </div>
        ) : null}

        {quickLinks.length > 0 ? (
          <div className={cardStyles.quickLinks}>
            {quickLinks.map((link, index) => (
              <Link key={link.href} href={link.href} className={cardStyles.quickLink}>
                {index === 0 ? (
                  <VisibilityOutlinedIcon className={cardStyles.quickLinkIcon} aria-hidden />
                ) : (
                  <SwapHorizOutlinedIcon className={cardStyles.quickLinkIcon} aria-hidden />
                )}
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className={cardStyles.footer}>
          <span className={cardStyles.downloads}>
            <FileDownloadOutlinedIcon className={cardStyles.downloadsIcon} aria-hidden />
            {downloads} downloads
          </span>
          <div className={cardStyles.footerActions}>
            <Link href={productHref} className={cardStyles.previewButton}>
              <VisibilityOutlinedIcon fontSize="small" aria-hidden />
              Preview
            </Link>
            <Link href={productHref} className={cardStyles.getButton}>
              Get
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
