import React from "react";
import ActiveLastBreadcrumb from "../CommonJsx/BreadCrumbs";
import Footer from "../HomePages/Footer/Footer";
import DesignHub from "../HomePages/DesignHub/DesignHub";
import TwoDRecentlyAddedStrip from "./TwoDRecentlyAddedStrip";
import IndustryDesignDropZone from "./IndustryDesignDropZone";
import LibraryDesignPageBanner from "../CadServicesBanners/LibraryDesignPageBanner";
import StickyCadStrip from "../CadServicesBanners/StickyCadStrip";
import TwoDTechnicalDrawingHero from "./TwoDTechnicalDrawingHero";
import LeftRightBanner from "../CommonJsx/Adsense/AdsBanner";
import styles from "./IndustryDesign.module.css";

const defaultBreadcrumbLinks = [
  { label: "Library", href: "/library" },
  {
    label: "Industrial IP67 Ethernet M12 Angle Connector",
    href: "/library/industrial-ip67-ethernet-m12-angle-conne-698ec00809bd85d18216b084",
  },
  {
    label: "2D Technical Drawings",
    href: "/library/2d-technical-drawings/industrial-ip67-ethernet-m12-angle-conne-698ec00809bd85d18216b084",
  },
];

/**
 * Main layout for 2D technical drawing pages — mirrors IndustryDesign shell (root, breadcrumbs, footer bands).
 * Pass breadcrumbLinks, hero props, and optional children for the rest of the page.
 */
export default function TwoDTechnicalDrawingPage({
  breadcrumbLinks = defaultBreadcrumbLinks,
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
      <DesignHub headingLevel={3} />
      <TwoDRecentlyAddedStrip />
      <IndustryDesignDropZone />
      <LibraryDesignPageBanner />
      <StickyCadStrip />
      <Footer />
    </>
  );
}
