import React from "react";
import Link from "next/link";
import { BASE_URL } from "@/config";
import baseStyles from "../HomePages/RecentlyAddedDesigns/RecentlyAddedDesigns.module.css";
import libraryStyles from "../Library/Library.module.css";
import HoverImageSequence from "../CommonJsx/RotatedImages";
import ViewAllDesigns from "../HomePages/DesignHub/ViewAllDesigns";
import LeftRightBanner from "../CommonJsx/Adsense/AdsBanner";
import LibraryHireCtaCard from "../Library/LibraryHireCtaCard";
import slotStyles from "./TwoDRecentlyAddedStrip.module.css";

const LEADER_AD = "2408570633";
const MID_AD = "4799748492";

/**
 * “Recently added / trending” strip with library-parity ads + hire CTA.
 * Used only on 2D technical drawing pages — keeps the shared RecentlyAddedDesigns free of monetization.
 */
export default async function TwoDRecentlyAddedStrip() {
  try {
    const response = await fetch(
      `${BASE_URL}/v1/cad/get-recently-added-designs?limit=10`,
      { cache: "no-store" }
    );
    const data = await response.json();
    const designs = data?.data || [];

    return (
      <div className={baseStyles.recentlyAddedDesignsContainer}>
        <h2 className={baseStyles.recentlyAddedDesignsHead}>Recently added / Trending</h2>
        <p className={baseStyles.recentlyAddedDesignsDesc}>
          Everything you need to design faster, smarter, and with more impact.
        </p>
        <div className={baseStyles.recentlyAddedDesignsGrid}>
          {designs.length > 0 ? (
            designs.map((design, index) => (
              <React.Fragment key={design._id}>
                {index === 0 && (
                  <div
                    className={`${baseStyles.recentlyAddedDesignCard} ${slotStyles.monetizationSlot}`}
                  >
                    <LeftRightBanner adSlot={LEADER_AD} />
                  </div>
                )}
                {index === 4 && (
                  <div
                    className={`${baseStyles.recentlyAddedDesignCard} ${slotStyles.hireWrap}`}
                  >
                    <LibraryHireCtaCard />
                  </div>
                )}
                {index === 6 && (
                  <div
                    className={`${baseStyles.recentlyAddedDesignCard} ${slotStyles.monetizationSlot}`}
                  >
                    <LeftRightBanner adSlot={MID_AD} />
                  </div>
                )}
                <div className={baseStyles.recentlyAddedDesignCard}>
                  <Link
                    href={`/library/${design.route}`}
                    className={libraryStyles["library-designs-items-container-home"]}
                  >
                    <HoverImageSequence design={design} width={298} height={298} />
                  </Link>
                  <div className={baseStyles.recentlyAddedDesignTitle}>{design.page_title}</div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <p>No designs available</p>
          )}
          {designs.length > 0 && designs.length < 5 && (
            <div className={`${baseStyles.recentlyAddedDesignCard} ${slotStyles.hireWrap}`}>
              <LibraryHireCtaCard />
            </div>
          )}
        </div>
        <ViewAllDesigns />
      </div>
    );
  } catch {
    return (
      <div className={baseStyles.recentlyAddedDesignsContainer}>
        <h2 className={baseStyles.recentlyAddedDesignsHead}>Recently added / Trending</h2>
        <p className={baseStyles.recentlyAddedDesignsDesc}>
          Everything you need to design faster, smarter, and with more impact.
        </p>
        <div className={baseStyles.recentlyAddedDesignsGrid}>
          <p>Unable to load designs. Please try again later.</p>
        </div>
      </div>
    );
  }
}
