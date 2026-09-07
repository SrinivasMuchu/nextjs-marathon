"use client";

import Link from "next/link";
import { ArrowRight, Box, Eye } from "lucide-react";
import HoverImageSequence from "@/Components/CommonJsx/RotatedImages";
import styles from "./CadProductsShowcase.module.css";

function formatPrice(price) {
  if (price == null || price === "" || Number(price) === 0) return "Free";
  const num = Number(price);
  if (!Number.isFinite(num)) return `$${price}`;
  return num % 1 === 0 ? `$${num}` : `$${num.toFixed(2)}`;
}

function getCategoryLabel(design) {
  return design?.category_labels?.[0] || design?.tag_labels?.[0] || "3D CAD";
}

function getFormatLabel(design) {
  return String(design?.file_type || "STEP").toUpperCase();
}

function CadProductCard({ design, index = 0 }) {
  const title = design.page_title || design.part_name || "Untitled design";
  const href = `/library/${design.route}`;
  const priceLabel = formatPrice(design.price);
  const categoryLabel = getCategoryLabel(design);
  const formatLabel = getFormatLabel(design);

  return (
    <Link className={styles.card} href={href}>
      <div className={styles.media}>
        {design._id ? (
          <HoverImageSequence
            design={design}
            width={320}
            height={225}
            loading="lazy"
            containerClassName={styles.mediaImage}
          />
        ) : (
          <div
            className={`${styles.placeholder} ${styles[`placeholder${(index % 3) + 1}`]}`}
            aria-hidden="true"
          >
            <Box size={35} />
            <span>3D CAD</span>
          </div>
        )}

        <span className={styles.formatChip}>{formatLabel}</span>
        <span className={styles.previewChip}>
          <Eye size={12} aria-hidden="true" />
          Preview available
        </span>
      </div>

      <div className={styles.copy}>
        <span className={styles.category}>{categoryLabel}</span>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.footer}>
          <strong>{priceLabel}</strong>
          <span>
            View product
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CadProductCard;
