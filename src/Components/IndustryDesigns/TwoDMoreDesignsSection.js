import React from "react";
import Link from "next/link";
import { BASE_URL } from "@/config";
import styles from "./TwoDMoreDesignsSection.module.css";
import FallbackImageClient from "../CommonJsx/FallbackImageClient";
import LeftRightBanner from "../CommonJsx/Adsense/AdsBanner";
import LibraryHireCtaCard from "../Library/LibraryHireCtaCard";

/** Same slots as main library grid */
const LIBRARY_LEADER_AD_SLOT = "2408570633";
const LIBRARY_MID_GRID_AD_SLOT = "4799748492";

/** How many “more” cards to show (excluding current design). */
const MORE_2D_DESIGNS_COUNT = 8;

async function fetchMoreTwoDDesigns(currentDesignId) {
  if (!BASE_URL) return [];
  /** Fetch extra rows so we still have eight cards after removing the current design. */
  const query = new URLSearchParams({
    page: "1",
    limit: String(MORE_2D_DESIGNS_COUNT + 8),
  }).toString();
  try {
    const res = await fetch(`${BASE_URL}/v1/cad/get-2d-library-designs?${query}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const payload = await res.json();
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    return rows
      .filter((d) => String(d?._id || "") !== String(currentDesignId || ""))
      .slice(0, MORE_2D_DESIGNS_COUNT);
  } catch {
    return [];
  }
}

export default async function TwoDMoreDesignsSection({ currentDesignId }) {
  const designs = await fetchMoreTwoDDesigns(currentDesignId);
  if (!designs.length) return null;

  return (
    <section className={styles.section} aria-label="More 2D designs">
      <div className={styles.header}>
        <h2 className={styles.title}>Explore More 2D Designs</h2>
        <Link href="/library/2d-technical-drawings" className={styles.link}>
          View all
        </Link>
      </div>

      <div className={styles.grid}>
        {designs.map((design, index) => {
          const id = String(design?._id || "").trim();
          const route = String(design?.route || "").trim();
          const href = route
            ? `/library/2d-technical-drawings/${encodeURIComponent(route)}`
            : `/library/2d-technical-drawings/${id}`;
          const title = String(design?.page_title || design?.part_name || "2D Design");
          const previewSrc = id
            ? `/api/techdraw-file?designId=${encodeURIComponent(id)}&sheet=1&ext=svg`
            : "";
          return (
            <React.Fragment key={id}>
              {index === 0 && (
                <div className={styles.monetizationCell}>
                  <LeftRightBanner adSlot={LIBRARY_LEADER_AD_SLOT} />
                </div>
              )}
              {index === 4 && (
                <div className={`${styles.monetizationCell} ${styles.hireCell}`}>
                  <LibraryHireCtaCard />
                </div>
              )}
              {index === 6 && (
                <div className={styles.monetizationCell}>
                  <LeftRightBanner adSlot={LIBRARY_MID_GRID_AD_SLOT} />
                </div>
              )}
              <Link href={href} className={styles.card}>
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
                <div className={styles.cardTitle}>{title}</div>
                <div className={styles.cardMeta}>
                  <span>2D Drawing</span>
                  <span>{design?.price ? `$${design.price}` : "Free"}</span>
                </div>
              </Link>
            </React.Fragment>
          );
        })}
        {designs.length > 0 && designs.length < 5 && (
          <div className={`${styles.monetizationCell} ${styles.hireCell}`}>
            <LibraryHireCtaCard />
          </div>
        )}
      </div>
    </section>
  );
}
