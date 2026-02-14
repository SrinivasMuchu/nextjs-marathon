import React from 'react';
import axios from 'axios';
import { BASE_URL, DESIGN_GLB_PREFIX_URL } from '@/config';
import Image from 'next/image';
import styles from './Library.module.css';
import { textLettersLimit } from '@/common.helper';
import Link from 'next/link';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import Footer from '../HomePages/Footer/Footer';
import LibraryFilters from './LibraryFilters';
import SortBySelect from './SortBySelect';
import ActiveLastBreadcrumb from '../CommonJsx/BreadCrumbs';
import DesignStats from '../CommonJsx/DesignStats';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import LeftRightBanner from '../CommonJsx/Adsense/AdsBanner';
import { cookies } from 'next/headers';
import LibraryPageJsonLd from '../JsonLdSchemas/LibraryPageJsonLd';

// Utility function to build the query string
const buildQueryString = (params) => {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.limit) query.set('limit', params.limit);
  if (params.page) query.set('page', params.page);
  if (params.tags) query.set('tags', params.tags);
  if (params.sort) query.set('sort', params.sort);
  if (params.recency) query.set('recency', params.recency);
  if (params.free_paid) query.set('free_paid', params.free_paid);
  if (params.file_format) query.set('file_format', params.file_format);
  return `?${query.toString()}`;
};

async function Library({ searchParams }) {
  const searchQuery = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = parseInt(searchParams?.page) || 1;
  const limit = parseInt(searchParams?.limit) || 20;
  const tags = searchParams?.tags || '';
  const sort = searchParams?.sort || '';
  const recency = searchParams?.recency || '';
  const freePaid = searchParams?.free_paid || '';
  const fileFormat = searchParams?.file_format || '';

  // Read UUID from cookies (server-side)
  const cookieStore = cookies();
  const uuid = cookieStore.get('uuid')?.value || null;

  // Build query parameters for get-category-design API
  const queryParams = new URLSearchParams();
  if (category) queryParams.set('category', category);
  queryParams.set('limit', limit.toString());
  queryParams.set('page', page.toString());
  if (searchQuery) queryParams.set('search', searchQuery);
  if (tags) queryParams.set('tags', tags);
  if (sort) queryParams.set('sort', sort);
  if (recency) queryParams.set('recency', recency);
  if (freePaid) queryParams.set('free_paid', freePaid);
  if (fileFormat) queryParams.set('file_format', fileFormat);
  if (uuid) queryParams.set('uuid', uuid);

  const [response, categoriesRes, tagsResponse] = await Promise.all([
    axios.get(`${BASE_URL}/v1/cad/get-category-design?${queryParams.toString()}`, { cache: 'no-store' }),
    axios.get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' }),
    axios.get(`${BASE_URL}/v1/cad/get-cad-tags`, { cache: 'no-store' }),
  ]);


  const allCategories = categoriesRes.data?.data || [];
  const data = response.data;
  const designs = data?.data?.designDetails || [];
  const pagination = data?.data?.pagination || {};
  const totalPages = pagination?.totalPages || 1;
  const allTags = tagsResponse.data?.data || [];

  return (
    <>
      {/* <HomeTopNav /> */}
      <LibraryPageJsonLd
        designs={designs}
        pagination={pagination}
        page={page}
        limit={limit}
      />
      <ActiveLastBreadcrumb links={[
        { label: 'Marathon OS', href: '/' },
        { label: 'Library', href: '/library' },
      ]} />

      <div className={styles["library-page"]}>
        <header className={styles["library-header"]}>
          <h1 className={styles["library-title"]}>Engineering CAD Design Library</h1>
          <p className={styles["library-description"]}>
            Browse quality-checked 3D CAD models. Preview online and download STEP/STP, IGES, STL and more—filter by category, tags, file type, price and popularity.
          </p>
          {/* <div className={styles["library-category-tags"]}>
            <Link
              href="/library"
              className={styles["library-category-tag"] + (!category ? ` ${styles.active}` : '')}
            >
              All
            </Link>
            {(allCategories || []).slice(0, 4).map((cat) => (
              <Link
                key={cat.industry_category_name}
                href={`/library?category=${encodeURIComponent(cat.industry_category_name)}`}
                className={styles["library-category-tag"] + (category === cat.industry_category_name ? ` ${styles.active}` : '')}
              >
                {cat.industry_category_label}
              </Link>
            ))}
          </div> */}
        </header>

        <div className={styles["library-layout"]}>
          <aside className={styles["library-filters"]}>
            <LibraryFilters
              initialSearchQuery={searchQuery}
              category={category}
              tags={tags}
              allCategories={allCategories}
              allTags={allTags}
              initialSort={searchParams?.sort}
              initialRecency={searchParams?.recency}
              initialFreePaid={searchParams?.free_paid}
              initialFileFormat={searchParams?.file_format}
              hasActiveFilters={Object.keys(searchParams || {}).length > 0}
            />
          </aside>

          <main className={styles["library-content"]}>
            <div className={styles["library-content-head"]}>
              <h2 className={styles["library-content-title"]}>
                {category
                  ? (allCategories.find((c) => c.industry_category_name === category)?.industry_category_label || category)
                  : 'All designs'}
              </h2>
              <div className={styles["library-content-sort"]}>
                <span>Sort: </span>
                <SortBySelect initialSort={searchParams?.sort} className={styles["library-content-sort-select"]} />
              </div>
            </div>

            <div className={styles["library-designs"]}>
              <div className={styles["library-designs-items"]}>
          {designs.map((design, index) => (
            <React.Fragment key={`design-${design._id}`}>
              {/* Insert ad at position 1 (before first design) */}
              {index === 0 && (
                <div className={styles["library-designs-items-container"]} style={{ minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LeftRightBanner adSlot="2408570633" />
                </div>
              )}

              {/* Insert ad at position 6 (before 6th design) */}
              {index === 6 && (
                <div className={styles["library-designs-items-container"]} style={{ minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LeftRightBanner adSlot="4799748492" />
                </div>
              )}

              <Link href={`/library/${design.route}`} className={styles["library-designs-items-container"]}>
                {/* <div className={styles["library-designs-inner"]}> */}
                {/* <div className={styles["library-designs-items-container-cost"]}>{design.price ? `$${design.price}` : 'Free'}</div> */}
                {/* <div className={styles["library-designs-items-container-img"]}>
                      <Image
                    // className={styles["library-designs-items-container-img"]}
                    src={`${DESIGN_GLB_PREFIX_URL}${design._id}/sprite_0_0.webp`}
                    alt={design.page_title}
                    width={300}
                    height={250}
                  />
                  </div> */}
                <HoverImageSequence design={design} width={300} height={250} />


                <div className={styles["design-title-wrapper"]}>
                  <h6 title={design.page_title}>{design.page_title}</h6>
                  {/* <p title={design.page_description}>{textLettersLimit(design.page_description, 120)}</p> */}
                  <div className={styles["design-title-text"]} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* {design.industry_name &&<DesignDetailsStats  text={design.industry_name} />} */}
                    {design.category_labels && design.category_labels.map((label, index) => (
                      <DesignDetailsStats key={index} text={label} />
                    ))}
                    {design.tag_labels && design.tag_labels.map((label, index) => (
                      <DesignDetailsStats key={index} text={label} />
                    ))}
                    <DesignDetailsStats fileType={design.file_type ? `.${design.file_type.toLowerCase()}` : '.STEP'} text={design.file_type ? `.${design.file_type.toUpperCase()}` : '.STEP'} />
                    <div className={styles["design-stats-wrapper"]}>
                      <DesignStats views={design.total_design_views ?? 0}
                        downloads={design.total_design_downloads ?? 0}
                        ratings={{ average: design.average_rating, total: design.rating_count }} />
                    </div>
                  </div>
                  <span className={styles["design-title-wrapper-price"]}>{design.price ? `$${design.price}` : 'Free'}</span>

                </div>


                {/* </div> */}
              </Link>
            </React.Fragment>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles["library-pagination"]} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          {page > 1 && (
            <Link href={buildQueryString({ category, search: searchQuery, limit, page: page - 1, tags, sort, recency, free_paid: freePaid, file_format: fileFormat })}>
              <button><KeyboardBackspaceIcon /> prev</button>
            </Link>
          )}

          {(() => {
            const pageLinks = [];
            const siblingCount = 1;
            const totalVisible = 5 + siblingCount * 2;

            const showLeftDots = page > 2 + siblingCount;
            const showRightDots = page < totalPages - (1 + siblingCount);

            const startPage = showLeftDots ? Math.max(2, page - siblingCount) : 2;
            const endPage = showRightDots ? Math.min(totalPages - 1, page + siblingCount) : totalPages - 1;

            // First page
            pageLinks.push(
              <Link
                key={1}
                href={buildQueryString({ category, search: searchQuery, limit, page: 1, tags, sort, recency, free_paid: freePaid, file_format: fileFormat })}
                className={`${styles['pagination-button']} ${page === 1 ? styles.active : ''}`}
              >
                1
              </Link>
            );

            // Dots on the left
            if (showLeftDots) {
              pageLinks.push(<span key="dots-left" className={styles.dots}>...</span>);
            }

            // Middle pages
            for (let p = startPage; p <= endPage; p++) {
              pageLinks.push(
                <Link
                  key={p}
                  href={buildQueryString({ category, search: searchQuery, limit, page: p, tags, sort, recency, free_paid: freePaid, file_format: fileFormat })}
                  className={`${styles['pagination-button']} ${page === p ? styles.active : ''}`}
                >
                  {p}
                </Link>
              );
            }

            // Dots on the right
            if (showRightDots) {
              pageLinks.push(<span key="dots-right" className={styles.dots}>...</span>);
            }

            // Last page
            if (totalPages > 1) {
              pageLinks.push(
                <Link
                  key={totalPages}
                  href={buildQueryString({ category, search: searchQuery, limit, page: totalPages, tags, sort, recency, free_paid: freePaid, file_format: fileFormat })}
                  className={`${styles['pagination-button']} ${page === totalPages ? styles.active : ''}`}
                >
                  {totalPages}
                </Link>
              );
            }

            return pageLinks;
          })()}

          {page < totalPages && (
            <Link href={buildQueryString({ category, search: searchQuery, limit, page: page + 1, tags, sort, recency, free_paid: freePaid, file_format: fileFormat })}>
              <button>next <KeyboardBackspaceIcon style={{ transform: "rotate(180deg)" }} /></button>
            </Link>
          )}
        </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Library;
