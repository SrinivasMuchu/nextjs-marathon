import React from "react";
import ActiveLastBreadcrumb from "../CommonJsx/BreadCrumbs";
import Footer from "../HomePages/Footer/Footer";
import DesignHub from "../HomePages/DesignHub/DesignHub";
import RecentlyAddedDesigns from "../HomePages/RecentlyAddedDesigns/RecentlyAddedDesigns";
import IndustryDesignDropZone from "./IndustryDesignDropZone";
import LibraryDesignPageBanner from "../CadServicesBanners/LibraryDesignPageBanner";
import StickyCadStrip from "../CadServicesBanners/StickyCadStrip";
import TwoDTechnicalDrawingHero from "./TwoDTechnicalDrawingHero";
import styles from "./IndustryDesign.module.css";

const defaultBreadcrumbLinks = [
  { label: "Library", href: "/library" },
  {
    label: "Industrial IP67 Ethernet M12 Angle Connector",
    href: "/library/industrial-ip67-ethernet-m12-angle-conne-698ec00809bd85d18216b084",
  },
  {
    label: "2D Technical Drawings",
    href: "/library/2d-technical-drawing/industrial-ip67-ethernet-m12-angle-conne-698ec00809bd85d18216b084",
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
        <TwoDTechnicalDrawingHero {...heroProps} />
        {children}
      </div>
      <DesignHub headingLevel={3} />
      <RecentlyAddedDesigns />
      <IndustryDesignDropZone />
      <LibraryDesignPageBanner />
      <StickyCadStrip />
      <Footer />
    </>
  );
}
