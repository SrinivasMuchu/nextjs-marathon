
import React from 'react';
import axios from 'axios';
import { notFound } from 'next/navigation';
import { BASE_URL, DESIGN_GLB_PREFIX_URL } from '@/config';
import { fetchCadTagsPage } from '@/api/cadTagsApi';
import { buildLibraryDesignsParams } from '@/api/libraryDesignsApi';
import {
  formatLibraryResultsCount,
  getLibraryPaginationWindow,
  hasLibraryNarrowingFilters,
} from '@/utils/libraryPagination';
import Image from 'next/image';
import styles from './Library.module.css';
import { textLettersLimit } from '@/common.helper';
import Link from 'next/link';
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import Footer from '../HomePages/Footer/Footer';
import LibraryLayoutWithFilters from './LibraryLayoutWithFilters';
import SortBySelect from './SortBySelect';
import ServerBreadCrumbs from '../CommonJsx/ServerBreadCrumbs';
import DesignStats from '../CommonJsx/DesignStats';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import LeftRightBanner from '../CommonJsx/Adsense/AdsBanner';
import { cookies } from 'next/headers';
import LibraryPageJsonLd from '../JsonLdSchemas/LibraryPageJsonLd';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { getLibraryPath, getLibraryPathWithQuery } from '@/common.helper';
import LibraryDesignPageBanner from '../CadServicesBanners/LibraryDesignPageBanner';
import LibraryHireCtaCard from './LibraryHireCtaCard';

/** Build library URL (path for category/tag + query for search, page, sort, etc.). Limit is not included in URL. */
function buildLibraryHref(params) {
  return getLibraryPathWithQuery({
    categoryName: params.category || null,
    tagName: params.tags || null,
    search: params.search,
    page: params.page,
    sort: params.sort,
    recency: params.recency,
    free_paid: params.free_paid,
    file_format: params.file_format,
    two_dims: params.two_dims,
  });
}

async function Library({ searchParams }) {
  
  const searchQuery = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = parseInt(searchParams?.page) || 1;
  const limit =  22;
  const tags = searchParams?.tags || ''; // raw cad_tag_name (e.g. "103-linear-bearing")
  const tagLabel = tags ? tags.replace(/-/g, ' ') : ''; // nicer display in H1/description
  const sort = searchParams?.sort || '';
  const recency = searchParams?.recency || '';
  const freePaid = searchParams?.free_paid || '';
  const fileFormat = searchParams?.file_format || '';
  const rawTwoDims = searchParams?.two_dims;
  const twoDimsOn = ['1', 'true', 'yes'].includes(
    String(rawTwoDims || '').trim().toLowerCase()
  );
  const twoDimsParam = twoDimsOn ? '1' : '';

  // Read UUID from cookies (server-side)
  const cookieStore = cookies();
  const uuid = cookieStore.get('uuid')?.value || null;

  // Build query parameters for get-category-design API (see docs/BACKEND_LIBRARY_API_SPEC.md)
  const apiParams = buildLibraryDesignsParams({
    category,
    tags,
    search: searchQuery,
    // Default sort should match UI: "Newest First"
    sort: sort || 'newest',
    recency: recency,
    free_paid: freePaid,
    file_format: fileFormat,
    two_dims: twoDimsParam,
    page,
    limit,
    uuid,
  });
  const queryString = new URLSearchParams(apiParams).toString();

  const designsRequest = axios
    .get(`${BASE_URL}/v1/cad/get-category-design?${queryString}`, { cache: 'no-store' })
    .catch((err) => {
      const status = err.response?.status;
      const message = err.response?.data?.meta?.message;
      if (status === 404 || message === 'Page not found') {
        notFound();
      }
      throw err;
    });

  const [response, categoriesRes, tagsFirstPage] = await Promise.all([
    designsRequest,
    axios.get(`${BASE_URL}/v1/cad/get-categories`, { cache: 'no-store' }),
    fetchCadTagsPage(0, 10, null, category || null),
  ]);

  const allCategories = categoriesRes.data?.data || [];
  const data = response.data;

  if (data?.meta?.success === false && data?.meta?.message === 'Page not found') {
    notFound();
  }

  const designs = data?.data?.designDetails || [];
  const pagination = data?.data?.pagination || {};
  const totalPages = pagination?.totalPages || 1;
  // URL page (searchParams) may exceed range; API returns last-page data in currentPage when clamped
  const dataPage = pagination?.currentPage ?? page;
  const initialTags = Array.isArray(tagsFirstPage?.data) ? tagsFirstPage.data : [];
  const initialTagsHasMore = tagsFirstPage?.hasMore === true;
  const hasFilters = hasLibraryNarrowingFilters({
    category,
    tags,
    search: searchQuery,
    recency,
    free_paid: freePaid,
    file_format: fileFormat,
    two_dims: twoDimsParam,
  });

  const paginationWindow = getLibraryPaginationWindow({
    currentPage: dataPage,
    totalPages,
    hasNextPage: pagination?.hasNextPage,
    hasPrevPage: pagination?.hasPrevPage,
    showCompactTotals: hasFilters,
  });
  const resultsCountLabel = formatLibraryResultsCount(pagination, designs?.length ?? 0);

  const activeCategory =
    allCategories.find(
      (cat) =>
        cat?.industry_category_name === category ||
        cat?.industry_category_label === category
    ) || null;
  const categoryLabel = activeCategory?.industry_category_label || category;

  const heroTitle = categoryLabel && tagLabel
    ? `${tagLabel} CAD Models in ${categoryLabel}`
    : categoryLabel
      ? `${categoryLabel} CAD Models`
      : tagLabel
        ? `${tagLabel} CAD Models`
        : 'Engineering CAD Design Library';

  const heroDescription = categoryLabel && tagLabel
    ? `Browse ${tagLabel} CAD models within ${categoryLabel}. Preview online and download STEP/STP, IGES, STL and more. Filter by file type, price and popularity.`
    : categoryLabel
      ? `Explore ${categoryLabel} CAD models for engineering workflows. Preview online and download STEP/STP, IGES, STL and more. Filter by tags, file type, price and popularity.`
      : tagLabel
        ? `Browse ${tagLabel} CAD models used in real projects. Preview online and download STEP/STP, IGES, STL and more. Filter by category, file type, price and popularity.`
        : 'Browse quality-checked 3D CAD models. Preview online and download STEP/STP, IGES, STL and more—filter by category, tags, file type, price and popularity.';

  return (
    <>
      <LibraryPageJsonLd
        designs={designs}
        pagination={pagination}
        page={page}
        limit={limit}
      />
      <ServerBreadCrumbs links={[{ label: 'Library', href: '/library' }]} />

      <div className={styles["library-page"]}>
        {/* Dark purple header: breadcrumb, title, description only */}
        <header className={styles["library-hero"]}>
          <nav className={styles["library-hero-breadcrumb"]} aria-label="Breadcrumb">
            <Link href="/" className={styles["library-hero-breadcrumb-link"]}>Home</Link>
            <span className={styles["library-hero-breadcrumb-sep"]}>/</span>
            <span className={styles["library-hero-breadcrumb-current"]}>Library</span>
          </nav>
          <h1 className={styles["library-hero-title"]}>{heroTitle}</h1>
          <p className={styles["library-hero-description"]}>
            {heroDescription}
          </p>
        </header>

        <div className={styles["library-below-hero"]}>
        {/* Categories row - outside header, below hero */}
        <div className={styles["library-category-tags-wrap"]}>
          <div className={styles["library-category-tags"]}>
            <Link
              href="/library"
              className={styles["library-category-tag"] + (!category ? ` ${styles["library-category-tag-active"]}` : '')}
            >
              All
            </Link>
            {(allCategories || []).map((cat) => (
              <Link
                key={cat.industry_category_name}
                href={getLibraryPath({ categoryName: cat.industry_category_name })}
                className={styles["library-category-tag"] + (category === cat.industry_category_name ? ` ${styles["library-category-tag-active"]}` : '')}
              >
                {cat.industry_category_label}
              </Link>
            ))}
          </div>
        </div>

        <LibraryLayoutWithFilters
          filterProps={{
            initialTags,
            initialHasMore: initialTagsHasMore,
            initialSearchQuery: searchQuery,
            category,
            tags,
            allCategories,
            initialSort: searchParams?.sort,
            initialRecency: searchParams?.recency,
            initialFreePaid: searchParams?.free_paid,
            initialFileFormat: searchParams?.file_format,
            initialTwoDims: twoDimsParam,
            hasActiveFilters: Object.keys(searchParams || {}).length > 0,
          }}
          contentHead={
            <>
              <div className={styles['library-content-head-left']}>
                <span className={styles['library-resources-count']}>
                  All Designs ({resultsCountLabel} results)
                  {hasFilters && totalPages > 1 && totalPages <= 5
                    ? ` · Page ${dataPage} of ${totalPages}`
                    : ''}
                </span>
                <Link
                  href="/library/2d-technical-drawings"
                  prefetch
                  className={styles['library-toolbar-2d-library-cta']}
                >
                  <span className={styles['library-toolbar-2d-library-cta-icon']} aria-hidden>
                    📐
                  </span>
                  2D technical drawing library
                </Link>
              </div>
              <div className={styles['library-content-sort']}>
                <SortBySelect initialSort={searchParams?.sort} className={styles['library-content-sort-select']} />
              </div>
            </>
          }
        >
            <div className={styles["library-designs"]}>
              <div className={styles["library-designs-items"]}>
          {designs.map((design, index) => (
            <React.Fragment key={`design-${design._id}`}>
              {/* Insert ad at position 1 (before first design) */}
              {index === 0 && (
                <div
                  className={styles["library-designs-items-container"]}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <LeftRightBanner adSlot="2408570633" />
                </div>
              )}

              {/* Insert ad after 7 grid slots (before 8th item = design index 6) */}
              {index === 6 && (
                <div
                  className={styles["library-designs-items-container"]}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <LeftRightBanner adSlot="4799748492" />
                </div>
              )}

              {/* Hire CTA card: 6th grid slot (after leading ad + first 4 designs) */}
              {index === 4 && (
                <div
                  className={`${styles["library-designs-items-container"]} ${styles.libraryHireCtaSlot}`}
                >
                  <LibraryHireCtaCard />
                </div>
              )}

              <div className={styles["library-designs-items-container"]}>
                <Link
                  href={`/library/${design.route}`}
                  className={styles["library-designs-primary-link"]}
                  aria-label={design.page_title}
                >
                  <HoverImageSequence design={design} width={280} height={233} />
                  <h6 title={design.page_title}>{design.page_title}</h6>
                </Link>

                <div className={styles["design-title-wrapper"]}>
                  {/* <p title={design.page_description}>{textLettersLimit(design.page_description, 120)}</p> */}
                  <div className={styles["design-title-text"]} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* {design.industry_name &&<DesignDetailsStats  text={design.industry_name} />} */}
                    {design.category_labels && design.category_labels.map((label, index) => (
                      <DesignDetailsStats key={index} text={label} type="category"/>
                    ))}
                    {/* send only 2 tags */}
                    {design.tag_labels && design.tag_labels.slice(0, 2).map((label, index) => (
                      <DesignDetailsStats key={index} text={label} type="tag"/>
                    ))}
                    <DesignDetailsStats fileType={design.file_type ? `.${design.file_type.toLowerCase()}` : '.STEP'} text={design.file_type ? `.${design.file_type.toUpperCase()}` : '.STEP'} />
                    <div className={styles["design-stats-wrapper"]}>
                      <DesignStats
                        views={design.total_design_views ?? 0}
                        downloads={design.total_design_downloads ?? 0}
                        // ratings={{ average: design.average_rating, total: design.rating_count }}
                      />
                    </div>
                  </div>
                  <span className={styles["design-title-wrapper-price"]}>{design.price ? `$${design.price}` : 'Free'}</span>
                </div>
              </div>
            </React.Fragment>
          ))}
          {/* Fewer than 5 designs: index 4 never runs — show CTA after last card */}
          {designs.length > 0 && designs.length < 5 && (
            <div
              className={`${styles["library-designs-items-container"]} ${styles.libraryHireCtaSlot}`}
            >
              <LibraryHireCtaCard />
            </div>
          )}
        </div>

        <div className={styles["library-pagination"]}>
          {paginationWindow.hasPrev && (
            <Link
              href={buildLibraryHref({
                category,
                search: searchQuery,
                page: dataPage - 1,
                tags,
                sort,
                recency,
                free_paid: freePaid,
                file_format: fileFormat,
                two_dims: twoDimsParam,
              })}
              className={styles['pagination-button']}
            >
              <KeyboardBackspaceIcon /> prev
            </Link>
          )}

          {paginationWindow.showLeadingEllipsis && (
            <span className={styles.dots}>...</span>
          )}

          {paginationWindow.pages.map((p) => (
            <Link
              key={p}
              href={buildLibraryHref({
                category,
                search: searchQuery,
                page: p,
                tags,
                sort,
                recency,
                free_paid: freePaid,
                file_format: fileFormat,
                two_dims: twoDimsParam,
              })}
              className={`${styles['pagination-button']} ${dataPage === p ? styles.active : ''}`}
            >
              {p}
            </Link>
          ))}

          {paginationWindow.showTrailingEllipsis && (
            <span className={styles.dots}>...</span>
          )}

          {paginationWindow.hasNext && (
            <Link
              href={buildLibraryHref({
                category,
                search: searchQuery,
                page: dataPage + 1,
                tags,
                sort,
                recency,
                free_paid: freePaid,
                file_format: fileFormat,
                two_dims: twoDimsParam,
              })}
              className={styles['pagination-button']}
            >
              next <KeyboardBackspaceIcon style={{ transform: "rotate(180deg)" }} />
            </Link>
          )}
        </div>
            </div>
        </LibraryLayoutWithFilters>
        </div>
      </div>
    
      <LibraryDesignPageBanner />
      <Footer />
    </>
  );
}

export default Library;
