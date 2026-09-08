"use client";

import Link from "next/link";
import { ArrowRight, Files } from "lucide-react";
import FallbackImageClient from "@/Components/CommonJsx/FallbackImageClient";
import {
  TWO_D_DEFAULT_OUTPUT_FORMATS,
  TWO_D_DEFAULT_PROJECTION,
  TWO_D_DEFAULT_SHEET_LABEL,
  getTwoDPriceLabel,
} from "@/data/twoDLibraryPage";
import styles from "./CadDrawingsShowcase.module.css";

function getOutputFormatsLabel(design) {
  const raw = design?.two_d_output_formats || TWO_D_DEFAULT_OUTPUT_FORMATS;
  return String(raw)
    .split(/[,·|/]+/)
    .map((part) => part.trim().toUpperCase())
    .filter(Boolean)
    .join(" · ");
}

function getDrawingLabel(design) {
  const sheets = Number(design?.two_d_sheet_count);
  if (Number.isFinite(sheets) && sheets > 0) {
    return sheets === 1 ? "1 sheet" : `Up to ${sheets} sheets`;
  }

  const projection = design?.two_d_projection || TWO_D_DEFAULT_PROJECTION;
  if (projection) {
    return `${String(projection).toLowerCase()} projection`;
  }

  return TWO_D_DEFAULT_SHEET_LABEL;
}

function CadDrawingCard({ design, defaultPriceLabel = "" }) {
  const title = design.page_title || design.part_name || "Untitled drawing";
  const route = String(design.route || "").trim();
  const href = route
    ? `/library/2d-technical-drawings/${encodeURIComponent(route)}`
    : `/library/2d-technical-drawings/${design._id}`;
  const priceLabel = getTwoDPriceLabel(design, defaultPriceLabel);
  const formatsLabel = getOutputFormatsLabel(design);
  const drawingLabel = getDrawingLabel(design);
  const previewSrc = design?._id
    ? `/api/techdraw-file?designId=${encodeURIComponent(design._id)}&sheet=1&ext=svg`
    : "";

  return (
    <Link className={styles.card} href={href}>
      <div className={styles.media}>
        <span className={styles.formatChip}>{formatsLabel}</span>
        <span className={styles.previewChip}>
          <Files size={12} aria-hidden="true" />
          Drawing set
        </span>

        <div className={styles.preview}>
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
      </div>

      <div className={styles.copy}>
        <span className={styles.category}>{drawingLabel}</span>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.footer}>
          {priceLabel ? <strong>{priceLabel}</strong> : <span />}
          <span>
            View drawing
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CadDrawingCard;
