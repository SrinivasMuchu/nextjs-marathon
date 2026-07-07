
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
import LibraryListingPageJsonLd from '../JsonLdSchemas/LibraryListingPageJsonLd';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { getLibraryPath, getLibraryPathWithQuery } from '@/common.helper';
import LibraryProductCard from './LibraryProductCard';
import LibraryBottomSections from './LibraryBottomSections';
import LibraryHeroSearch from './LibraryHeroSearch';
// import LibraryHubCards from './LibraryHubCards';
// import LibraryCategoryScroller from './LibraryCategoryScroller';
import {
  LIBRARY_DEFAULT_H1,
  LIBRARY_DEFAULT_INTRO,
  LIBRARY_DEFAULT_DESCRIPTION,
  LIBRARY_HUB_H1,
  LIBRARY_HUB_INTRO,
  LIBRARY_HUB_SEARCH_PLACEHOLDER,
  LIBRARY_3D_HUB_CARDS,
} from '@/data/libraryPage';

const SITE_LIST_ORIGIN = 'https://marathon-os.com';

const FIRST_GRID_SIZE = 6;

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

async function Library({ searchParams, pageConfig = null }) {
  
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

  // const showHubExperience =
  //   !pageConfig && !categoryLabel && !tagLabel && !searchQuery && !fileFormat;
  const showHubExperience = false;
  // const partsCountLabel = pagination?.totalItems
  //   ? `${Number(pagination.totalItems).toLocaleString()}+ parts`
  //   : '10,000+ parts';

  const heroTitle = pageConfig?.h1
    ? pageConfig.h1
    : categoryLabel && tagLabel
      ? `${tagLabel} CAD Models in ${categoryLabel}`
      : categoryLabel
        ? `${categoryLabel} CAD Models`
        : tagLabel
          ? `${tagLabel} CAD Models`
          : showHubExperience
            ? LIBRARY_HUB_H1
            : searchQuery
              ? `Search results for "${searchQuery}"`
              : LIBRARY_DEFAULT_H1;

  const heroDescription = pageConfig?.intro
    ? pageConfig.intro
    : categoryLabel && tagLabel
      ? `Browse ${tagLabel} CAD models within ${categoryLabel}. Preview online and download STEP/STP, IGES, STL and more. Filter by file type, price and popularity.`
      : categoryLabel
        ? `Explore ${categoryLabel} CAD models for engineering workflows. Preview online and download STEP/STP, IGES, STL and more. Filter by tags, file type, price and popularity.`
        : tagLabel
          ? `Browse ${tagLabel} CAD models used in real projects. Preview online and download STEP/STP, IGES, STL and more. Filter by category, file type, price and popularity.`
          : showHubExperience
            ? LIBRARY_HUB_INTRO
            : LIBRARY_DEFAULT_INTRO;

  const breadcrumbSchemaLinks = [{ label: 'Library', href: '/library' }];
  if (categoryLabel) {
    if (tagLabel) {
      breadcrumbSchemaLinks.push({
        label: categoryLabel,
        href: getLibraryPath({ categoryName: category }),
      });
      breadcrumbSchemaLinks.push({ label: tagLabel });
    } else {
      breadcrumbSchemaLinks.push({ label: categoryLabel });
    }
  } else if (tagLabel) {
    breadcrumbSchemaLinks.push({ label: tagLabel });
  }

  return (
    <>
      <LibraryListingPageJsonLd
        collectionName={LIBRARY_DEFAULT_H1}
        collectionUrl={`${SITE_LIST_ORIGIN}/library`}
        collectionDescription={LIBRARY_DEFAULT_DESCRIPTION}
        designs={designs}
        pagination={pagination}
        page={page}
        limit={limit}
        listTitle={LIBRARY_DEFAULT_H1}
        listDescription={LIBRARY_DEFAULT_DESCRIPTION}
      />
      <ServerBreadCrumbs links={breadcrumbSchemaLinks} />

      <div className={styles["library-page"]}>
        {/* Dark purple header: breadcrumb, title, description only */}
        <header className={styles["library-hero"]}>
          <nav className={styles["library-hero-breadcrumb"]} aria-label="Breadcrumb">
            <Link href="/" className={styles["library-hero-breadcrumb-link"]}>Home</Link>
            <span className={styles["library-hero-breadcrumb-sep"]}>/</span>
            {categoryLabel || tagLabel ? (
              <>
                <Link href="/library" className={styles["library-hero-breadcrumb-link"]}>Library</Link>
                {categoryLabel ? (
                  <>
                    <span className={styles["library-hero-breadcrumb-sep"]}>/</span>
                    {tagLabel ? (
                      <>
                        <Link
                          href={getLibraryPath({ categoryName: category })}
                          className={styles["library-hero-breadcrumb-link"]}
                        >
                          {categoryLabel}
                        </Link>
                        <span className={styles["library-hero-breadcrumb-sep"]}>/</span>
                        <span className={styles["library-hero-breadcrumb-current"]}>{tagLabel}</span>
                      </>
                    ) : (
                      <span className={styles["library-hero-breadcrumb-current"]}>{categoryLabel}</span>
                    )}
                  </>
                ) : (
                  <>
                    <span className={styles["library-hero-breadcrumb-sep"]}>/</span>
                    <span className={styles["library-hero-breadcrumb-current"]}>{tagLabel}</span>
                  </>
                )}
              </>
            ) : (
              <span className={styles["library-hero-breadcrumb-current"]}>Library</span>
            )}
          </nav>
          {/* {showHubExperience ? (
            <div className={styles['library-hero-badge']} aria-label="Library quality">
              ✓ Quality-checked • {partsCountLabel}
            </div>
          ) : null} */}
          <h1 className={styles["library-hero-title"]}>{heroTitle}</h1>
          <p className={styles["library-hero-description"]}>
            {heroDescription}
          </p>
          <div className={styles['library-hero-search']}>
            <LibraryHeroSearch
              initialSearchQuery={searchQuery}
              placeholder={LIBRARY_HUB_SEARCH_PLACEHOLDER}
            />
          </div>
        </header>

        {/* {showHubExperience ? <LibraryHubCards cards={LIBRARY_3D_HUB_CARDS} /> : null} */}

        <div className={styles["library-below-hero"]}>
        {/* <LibraryCategoryScroller
          categories={allCategories}
          activeCategory={category}
          libraryMode="3d"
        /> */}

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
          toolbarLeft={
            <div className={styles['library-content-head-left']}>
              <span className={styles['library-resources-count']}>
                {resultsCountLabel} models
              </span>
              <Link
                href="/library/2d-technical-drawings"
                prefetch
                className={styles['library-toolbar-2d-library-cta']}
              >
                <span className={styles['library-toolbar-2d-library-cta-icon']} aria-hidden>
                  📐
                </span>
                2D drawings
              </Link>
            </div>
          }
          toolbarSort={
            <SortBySelect initialSort={searchParams?.sort} className={styles['library-content-sort-select']} />
          }
        >
            <div className={styles["library-designs"]}>
              <div className={styles["library-designs-items"]}>
          {designs.map((design, index) => (
            <React.Fragment key={`design-${design._id}`}>
              {index === 0 && (
                <div
                  className={styles["library-designs-items-container"]}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <LeftRightBanner adSlot="2408570633" />
                </div>
              )}

              {index === 6 && (
                <div
                  className={styles["library-designs-items-container"]}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <LeftRightBanner adSlot="4799748492" />
                </div>
              )}

              <LibraryProductCard design={design} />

              {index === FIRST_GRID_SIZE - 1 && !pageConfig && !categoryLabel && !tagLabel ? (
                <LibraryBottomSections />
              ) : null}
            </React.Fragment>
          ))}
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
    
      <Footer />
    </>
  );
}

export default Library;
