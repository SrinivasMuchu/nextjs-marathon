import React from "react";
import axios from "axios";
import Link from "next/link";
import { BASE_URL } from "@/config";
import styles from "./Library.module.css";
import cardStyles from "./TwoDLibrary.module.css";
import ServerBreadCrumbs from "../CommonJsx/ServerBreadCrumbs";
import Footer from "../HomePages/Footer/Footer";
import LibraryPageJsonLd from "../JsonLdSchemas/LibraryPageJsonLd";
import LeftRightBanner from "../CommonJsx/Adsense/AdsBanner";
import LibraryHireCtaCard from "./LibraryHireCtaCard";
import TechDrawPageViewTracker from "../CadDrawingPipeline/TechDrawPageViewTracker";
import TwoDLibraryCard from "./TwoDLibraryCard";
import TwoDLibraryLayoutWithFilters from "./TwoDLibraryLayoutWithFilters";
import TwoDLibraryBottomSections from "./TwoDLibraryBottomSections";
import {
  TWO_D_LIBRARY_DESCRIPTION,
  TWO_D_LIBRARY_H1,
  TWO_D_LIBRARY_INTRO,
  applyTwoDLibraryFilters,
  buildTwoDLibraryHref,
} from "@/data/twoDLibraryPage";

const SITE_LIST_ORIGIN = "https://marathon-os.com";
const FIRST_GRID_SIZE = 6;

export default async function TwoDLibrary({
  searchParams,
  basePath = "/library/2d-technical-drawings",
}) {
  const page = Math.max(1, parseInt(searchParams?.page, 10) || 1);
  const limit = 24;
  const search = (searchParams?.search || "").trim();

  const queryString = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
    ...(searchParams?.recently_generated === "1" ? { sort: "newest" } : {}),
  }).toString();

  const response = await axios.get(
    `${BASE_URL}/v1/cad/get-2d-library-designs?${queryString}`,
    { cache: "no-store" }
  );

  const data = response?.data || {};
  const rawDesigns = Array.isArray(data?.data) ? data.data : [];
  const designs = applyTwoDLibraryFilters(rawDesigns, searchParams);
  const pagination = data?.pagination || {};
  const total = Number(pagination.total || rawDesigns.length || 0);
  const totalPages = Number(pagination.total_pages || 1);

  const renderGridItems = (items, startIndex = 0) =>
    items.map((design, index) => {
      const absoluteIndex = startIndex + index;
      return (
        <React.Fragment key={`2d-design-${design._id}`}>
          {absoluteIndex === 0 && (
            <div className={cardStyles.gridFullWidth}>
              <LeftRightBanner adSlot="2408570633" />
            </div>
          )}
          {absoluteIndex === 4 && (
            <div className={`${cardStyles.gridFullWidth} ${styles.libraryHireCtaSlot}`}>
              <LibraryHireCtaCard />
            </div>
          )}
          <TwoDLibraryCard design={design} />
        </React.Fragment>
      );
    });

  const firstGrid = designs.slice(0, FIRST_GRID_SIZE);
  const remainingGrid = designs.slice(FIRST_GRID_SIZE);

  return (
    <>
      <TechDrawPageViewTracker pageType="library_list" />
      <ServerBreadCrumbs
        links={[
          { label: "2D Library", href: basePath },
        ]}
      />
      <div className={styles["library-page"]}>
        <LibraryPageJsonLd
          designs={designs}
          pagination={{ totalPages }}
          page={page}
          limit={limit}
          listUrl={`${SITE_LIST_ORIGIN}${basePath}`}
          listTitle={TWO_D_LIBRARY_H1}
          listDescription={TWO_D_LIBRARY_DESCRIPTION}
          defaultItemName="2D Technical Drawing"
          scriptId="json-ld-2d-library-itemlist"
          getItemPath={(design) => {
            const route = String(design?.route || "").trim();
            if (route) {
              return `${basePath}/${encodeURIComponent(route)}`;
            }
            return `${basePath}/${design._id}`;
          }}
        />
        <header className={styles["library-hero"]}>
          <nav className={styles["library-hero-breadcrumb"]} aria-label="Breadcrumb">
            <Link href="/" className={styles["library-hero-breadcrumb-link"]}>
              Home
            </Link>
            <span className={styles["library-hero-breadcrumb-sep"]}>/</span>
            <span className={styles["library-hero-breadcrumb-current"]}>2D Library</span>
          </nav>
          <h1 className={styles["library-hero-title"]}>{TWO_D_LIBRARY_H1}</h1>
          <p className={styles["library-hero-description"]}>{TWO_D_LIBRARY_INTRO}</p>
        </header>

        <div className={styles["library-below-hero"]}>
          <TwoDLibraryLayoutWithFilters
            basePath={basePath}
            searchParams={searchParams}
            total={designs.length || total}
          >
            <div className={styles["library-designs"]}>
              {designs.length === 0 ? (
                <p className={styles["library-resources-count"]}>
                  No 2D drawing sets match these filters. Try clearing filters or adjusting your search.
                </p>
              ) : (
                <>
                  <div className={cardStyles.grid}>{renderGridItems(firstGrid, 0)}</div>

                  {firstGrid.length > 0 ? (
                    <div className={cardStyles.gridFullWidth}>
                      <TwoDLibraryBottomSections basePath={basePath} />
                    </div>
                  ) : null}

                  {remainingGrid.length > 0 ? (
                    <div className={cardStyles.grid}>{renderGridItems(remainingGrid, FIRST_GRID_SIZE)}</div>
                  ) : null}

                  {designs.length > 0 && designs.length < 5 && (
                    <div className={`${cardStyles.gridFullWidth} ${styles.libraryHireCtaSlot}`}>
                      <LibraryHireCtaCard />
                    </div>
                  )}
                </>
              )}

              <div className={styles["library-pagination"]}>
                {page > 1 ? (
                  <Link
                    href={buildTwoDLibraryHref({
                      page: page - 1,
                      search,
                      basePath,
                      category: searchParams?.category,
                      source_format: searchParams?.source_format,
                      output_format: searchParams?.output_format,
                      sheets: searchParams?.sheets,
                      projection: searchParams?.projection,
                      free_paid: searchParams?.free_paid,
                      recently_generated: searchParams?.recently_generated,
                    })}
                    className={styles["pagination-button"]}
                  >
                    prev
                  </Link>
                ) : null}
                <span className={`${styles["pagination-button"]} ${styles.active}`}>
                  {page}
                </span>
                {page < totalPages ? (
                  <Link
                    href={buildTwoDLibraryHref({
                      page: page + 1,
                      search,
                      basePath,
                      category: searchParams?.category,
                      source_format: searchParams?.source_format,
                      output_format: searchParams?.output_format,
                      sheets: searchParams?.sheets,
                      projection: searchParams?.projection,
                      free_paid: searchParams?.free_paid,
                      recently_generated: searchParams?.recently_generated,
                    })}
                    className={styles["pagination-button"]}
                  >
                    next
                  </Link>
                ) : null}
              </div>
            </div>
          </TwoDLibraryLayoutWithFilters>
        </div>
      </div>
      <Footer />
    </>
  );
}
