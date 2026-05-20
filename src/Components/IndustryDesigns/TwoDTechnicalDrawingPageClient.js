"use client";

import React from "react";
import ActiveLastBreadcrumb from "../CommonJsx/BreadCrumbs";
import Footer from "../HomePages/Footer/Footer";
import TwoDTechnicalDrawingHero from "./TwoDTechnicalDrawingHero";
import LeftRightBanner from "../CommonJsx/Adsense/AdsBanner";
import styles from "./IndustryDesign.module.css";

/**
 * Client-safe 2D drawing page shell for dashboard pipeline results.
 * Omits async server blocks (DesignHub, RecentlyAddedDesigns, etc.) that break when
 * imported from a "use client" parent.
 */
export default function TwoDTechnicalDrawingPageClient({
  breadcrumbLinks = [],
  heroProps = {},
  children = null,
}) {
  return (
    <>
      <div className={styles["industry-design-page-root"]}>
        <ActiveLastBreadcrumb alignWithHeader links={breadcrumbLinks} />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
            position: "relative",
            minHeight: "100px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "970px", margin: "0 auto" }}>
            <LeftRightBanner adSlot="2408570633" />
          </div>
        </div>
        <TwoDTechnicalDrawingHero {...heroProps} />
        {children}
      </div>
      <Footer />
    </>
  );
}
