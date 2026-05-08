import React from "react";
import axios from "axios";
import Link from "next/link";
import { BASE_URL } from "@/config";
import styles from "./Library.module.css";
import ServerBreadCrumbs from "../CommonJsx/ServerBreadCrumbs";
import DesignStats from "../CommonJsx/DesignStats";
import DesignDetailsStats from "../CommonJsx/DesignDetailsStats";
import Footer from "../HomePages/Footer/Footer";
import LibraryPageJsonLd from "../JsonLdSchemas/LibraryPageJsonLd";

const SITE_LIST_ORIGIN = "https://marathon-os.com";

function build2dLibraryHref({
  page,
  search,
  basePath = "/library/2d-technical-drawings",
}) {
  const qp = new URLSearchParams();
  if (page && Number(page) > 1) qp.set("page", String(page));
  if (search) qp.set("search", search);
  const qs = qp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

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
  }).toString();

  const response = await axios.get(
    `${BASE_URL}/v1/cad/get-2d-library-designs?${queryString}`,
    { cache: "no-store" }
  );

  const data = response?.data || {};
  const designs = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination || {};
  const total = Number(pagination.total || designs.length || 0);
  const totalPages = Number(pagination.total_pages || 1);

  return (
    <>
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
          listTitle="2D Technical Drawing Library"
          listDescription="Browse free 2D technical drawings generated from 3D CAD models. Download engineering drawing sheets in PDF, SVG and DXF formats for mechanical, robotics, automotive and industrial designs."
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
          <h1 className={styles["library-hero-title"]}>
            2D Technical Drawing Library — 2D CAD drawings
          </h1>
          <p className={styles["library-hero-description"]}>
            Browse free 2D CAD drawings generated from 3D CAD models. Open each
            technical drawing set and download PDF, SVG, and DXF formats.
          </p>
        </header>

        <div className={styles["library-below-hero"]}>
          <div className={styles["library-content"]}>
            <div className={styles["library-content-head"]}>
              <span className={styles["library-resources-count"]}>
                2D Designs ({total} results)
              </span>
            </div>

            <div className={styles["library-designs"]}>
              <div className={styles["library-designs-items"]}>
                {designs.map((design) => (
                  <div key={design._id} className={styles["library-designs-items-container"]}>
                    {(() => {
                      const route = String(design.route || "").trim();
                      const href = route
                        ? `/library/2d-technical-drawings/${encodeURIComponent(route)}`
                        : `/library/2d-technical-drawings/${design._id}`;
                      const previewSrc = design?._id
                        ? `/api/techdraw-file?designId=${encodeURIComponent(
                            design._id
                          )}&sheet=1&ext=svg`
                        : "";
                      return (
                    <Link
                      href={href}
                      className={styles["library-designs-primary-link"]}
                      aria-label={design.page_title || design.part_name || "2D design"}
                    >
                      <div className={styles["two-d-library-preview-wrap"]}>
                        {previewSrc ? (
                          <img
                            className={styles["two-d-library-preview-img"]}
                            src={previewSrc}
                            alt={`${design.page_title || design.part_name || "2D design"} preview`}
                          />
                        ) : (
                          <div className={styles["two-d-library-preview-fallback"]}>
                            2D Preview
                          </div>
                        )}
                      </div>
                      <h6 title={design.page_title || design.part_name}>
                        {design.page_title || design.part_name || "Untitled design"}
                      </h6>
                    </Link>
                      );
                    })()}

                    <div className={styles["design-title-wrapper"]}>
                      <div
                        className={styles["design-title-text"]}
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <DesignDetailsStats text="2D Drawing" type="category" />
                        {design.file_type ? (
                          <DesignDetailsStats
                            fileType={`.${String(design.file_type).toLowerCase()}`}
                            text={`.${String(design.file_type).toUpperCase()}`}
                          />
                        ) : null}
                        <div className={styles["design-stats-wrapper"]}>
                          <DesignStats
                            views={design.total_design_views ?? 0}
                            downloads={design.total_design_downloads ?? 0}
                          />
                        </div>
                      </div>
                      <span className={styles["design-title-wrapper-price"]}>
                        {design.price ? `$${design.price}` : "Free"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles["library-pagination"]}>
                {page > 1 ? (
                  <Link
                    href={build2dLibraryHref({ page: page - 1, search, basePath })}
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
                    href={build2dLibraryHref({ page: page + 1, search, basePath })}
                    className={styles["pagination-button"]}
                  >
                    next
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

