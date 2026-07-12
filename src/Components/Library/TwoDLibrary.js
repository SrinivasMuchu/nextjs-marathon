import React from 'react';
import axios from 'axios';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { BASE_URL } from '@/config';
import { fetchCadTagsPage, fetchCadTagsByRank } from '@/api/cadTagsApi';
import { fetchLibraryClusters } from '@/api/libraryClustersApi';
import { fetchTwoDLibraryCategories } from '@/api/twoDLibraryDesignsApi';
import { buildTwoDLibraryDesignsParams } from '@/api/twoDLibraryDesignsApi';
import {
  formatLibraryResultsCount,
  getLibraryPaginationWindow,
} from '@/utils/libraryPagination';
import styles from './Library.module.css';
import ServerBreadCrumbs from '../CommonJsx/ServerBreadCrumbs';
import Footer from '../HomePages/Footer/Footer';
import LibraryListingPageJsonLd from '../JsonLdSchemas/LibraryListingPageJsonLd';
import LeftRightBanner from '../CommonJsx/Adsense/AdsBanner';
import LibraryLayoutWithFilters from './LibraryLayoutWithFilters';
import SortBySelect from './SortBySelect';
import TwoDLibraryCard from './TwoDLibraryCard';
import TwoDLibraryBottomSections from './TwoDLibraryBottomSections';
import LibraryHeroSearch from './LibraryHeroSearch';
// import LibraryHubCards from './LibraryHubCards';
import LibraryCategoryScroller from './LibraryCategoryScroller';
import LibraryDiscoverySections from './LibraryDiscoverySections';
import TechDrawPageViewTracker from '../CadDrawingPipeline/TechDrawPageViewTracker';
import {
  TWO_D_LIBRARY_H1,
  TWO_D_LIBRARY_INTRO,
  TWO_D_LIBRARY_DESCRIPTION,
  TWO_D_LIBRARY_BASE,
  TWO_D_LIBRARY_HUB_H1,
  TWO_D_LIBRARY_HUB_INTRO,
  TWO_D_LIBRARY_HUB_SEARCH_PLACEHOLDER,
  TWO_D_LIBRARY_HUB_CARDS,
  get2DLibraryPath,
  get2DLibraryPathWithQuery,
  hasTwoDLibraryNarrowingFilters,
} from '@/data/twoDLibraryPage';

const SITE_LIST_ORIGIN = 'https://marathon-os.com';
const FIRST_GRID_SIZE = 6;

function build2dLibraryHref(params) {
  return get2DLibraryPathWithQuery({
    categoryName: params.category || null,
    tagName: params.tags || null,
    search: params.search,
    page: params.page,
    sort: params.sort,
    recency: params.recency,
    free_paid: params.free_paid,
    file_format: params.file_format,
    output_format: params.output_format,
    projection: params.projection,
  });
}

export default async function TwoDLibrary({
  searchParams,
  basePath = TWO_D_LIBRARY_BASE,
}) {
  const listRootPath = TWO_D_LIBRARY_BASE;
  const searchQuery = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = parseInt(searchParams?.page, 10) || 1;
  const limit = 22;
  const tags = searchParams?.tags || '';
  const tagLabel = tags ? tags.replace(/-/g, ' ') : '';
  const sort = searchParams?.sort || '';
  const recency = searchParams?.recency || '';
  const freePaid = searchParams?.free_paid || '';
  const fileFormat = searchParams?.file_format || '';
  const outputFormat = searchParams?.output_format || '';
  const projection = searchParams?.projection || '';

  const cookieStore = cookies();
  const uuid = cookieStore.get('uuid')?.value || null;

  // Keep browse parts + build kits visible even when filters are applied
  const showDiscoverySections = true;

  const apiParams = buildTwoDLibraryDesignsParams({
    category,
    tags,
    search: searchQuery,
    sort: sort || 'newest',
    recency,
    free_paid: freePaid,
    file_format: fileFormat,
    output_format: outputFormat,
    projection,
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

  const [response, allCategories, tagsFirstPage, rankedBrowseTags, buildKitClusters] = await Promise.all([
    designsRequest,
    fetchTwoDLibraryCategories(),
    fetchCadTagsPage(0, 10, null, category || null, true),
    showDiscoverySections ? fetchCadTagsByRank(100, true) : Promise.resolve([]),
    showDiscoverySections ? fetchLibraryClusters({ limit: 3, twoDims: true }) : Promise.resolve([]),
  ]);
  const data = response.data;

  if (data?.meta?.success === false && data?.meta?.message === 'Page not found') {
    notFound();
  }

  const designs = data?.data?.designDetails || [];
  const pagination = data?.data?.pagination || {};
  const totalPages = pagination?.totalPages || 1;
  const dataPage = pagination?.currentPage ?? page;
  const initialTags = Array.isArray(tagsFirstPage?.data) ? tagsFirstPage.data : [];
  const initialTagsHasMore = tagsFirstPage?.hasMore === true;
  const hasFilters = hasTwoDLibraryNarrowingFilters({
    category,
    tags,
    search: searchQuery,
    recency,
    free_paid: freePaid,
    file_format: fileFormat,
    output_format: outputFormat,
    projection,
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
  //   !categoryLabel && !tagLabel && !searchQuery && !outputFormat && !projection;
  const showHubExperience = false;
  // const drawingsCountLabel = pagination?.totalItems
  //   ? `${Number(pagination.totalItems).toLocaleString()}+ drawing sets`
  //   : '1,000+ drawing sets';

  const heroTitle =
    categoryLabel && tagLabel
      ? `${tagLabel} 2D drawings in ${categoryLabel}`
      : categoryLabel
        ? `${categoryLabel} 2D technical drawings`
        : tagLabel
          ? `${tagLabel} 2D technical drawings`
          : showHubExperience
            ? TWO_D_LIBRARY_HUB_H1
            : searchQuery
              ? `Search results for "${searchQuery}"`
              : TWO_D_LIBRARY_H1;

  const heroDescription =
    categoryLabel && tagLabel
      ? `Browse ${tagLabel} 2D technical drawings in ${categoryLabel}. Download drawing sets with orthographic views, section cuts and PDF, SVG and DXF files.`
      : categoryLabel
        ? `Browse ${categoryLabel} 2D technical drawings generated from 3D CAD models. Download PDF, SVG and DXF drawing sets for engineering review.`
        : tagLabel
          ? `Browse ${tagLabel} 2D technical drawings. Download drawing sets with orthographic views, section cuts and PDF, SVG and DXF files.`
          : showHubExperience
            ? TWO_D_LIBRARY_HUB_INTRO
            : TWO_D_LIBRARY_INTRO;

  const breadcrumbSchemaLinks = [
    { label: 'Library', href: '/library' },
    { label: '2D Technical Drawings', href: listRootPath },
  ];
  if (categoryLabel) {
    if (tagLabel) {
      breadcrumbSchemaLinks.push({
        label: categoryLabel,
        href: get2DLibraryPath({ categoryName: category }),
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
      <TechDrawPageViewTracker pageType="library_list" />
      <LibraryListingPageJsonLd
        collectionName={TWO_D_LIBRARY_H1}
        collectionUrl={`${SITE_LIST_ORIGIN}${basePath}`}
        collectionDescription={TWO_D_LIBRARY_DESCRIPTION}
        designs={designs}
        pagination={pagination}
        page={page}
        limit={limit}
        listTitle={TWO_D_LIBRARY_H1}
        listDescription={TWO_D_LIBRARY_DESCRIPTION}
        defaultItemName="2D Technical Drawing"
        scriptId="json-ld-2d-library-itemlist"
        getItemPath={(design) => {
          const route = String(design?.route || '').trim();
          if (route) {
            return `${listRootPath}/${encodeURIComponent(route)}`;
          }
          return `${listRootPath}/${design._id}`;
        }}
      />
      <ServerBreadCrumbs links={breadcrumbSchemaLinks} />

      <div className={styles['library-page']}>
        <header className={styles['library-hero']}>
          <nav className={styles['library-hero-breadcrumb']} aria-label="Breadcrumb">
            <Link href="/" className={styles['library-hero-breadcrumb-link']}>
              Home
            </Link>
            <span className={styles['library-hero-breadcrumb-sep']}>/</span>
            <Link href="/library" className={styles['library-hero-breadcrumb-link']}>
              Library
            </Link>
            <span className={styles['library-hero-breadcrumb-sep']}>/</span>
            {categoryLabel || tagLabel ? (
              <>
                <Link href={listRootPath} className={styles['library-hero-breadcrumb-link']}>
                  2D Library
                </Link>
                <span className={styles['library-hero-breadcrumb-sep']}>/</span>
                {categoryLabel ? (
                  <>
                    {tagLabel ? (
                      <>
                        <Link
                          href={get2DLibraryPath({ categoryName: category })}
                          className={styles['library-hero-breadcrumb-link']}
                        >
                          {categoryLabel}
                        </Link>
                        <span className={styles['library-hero-breadcrumb-sep']}>/</span>
                        <span className={styles['library-hero-breadcrumb-current']}>{tagLabel}</span>
                      </>
                    ) : (
                      <span className={styles['library-hero-breadcrumb-current']}>{categoryLabel}</span>
                    )}
                  </>
                ) : (
                  <span className={styles['library-hero-breadcrumb-current']}>{tagLabel}</span>
                )}
              </>
            ) : (
              <span className={styles['library-hero-breadcrumb-current']}>2D Library</span>
            )}
          </nav>
          {/* {showHubExperience ? (
            <div className={styles['library-hero-badge']} aria-label="Library quality">
              ✓ Quality-checked • {drawingsCountLabel}
            </div>
          ) : null} */}
          <h1 className={styles['library-hero-title']}>{heroTitle}</h1>
          <p className={styles['library-hero-description']}>{heroDescription}</p>
          <div className={styles['library-hero-search']}>
            <LibraryHeroSearch
              initialSearchQuery={searchQuery}
              placeholder={TWO_D_LIBRARY_HUB_SEARCH_PLACEHOLDER}
              libraryMode="2d"
              browseCards={TWO_D_LIBRARY_HUB_CARDS}
            />
          </div>
        </header>

        {/* {showHubExperience ? <LibraryHubCards cards={TWO_D_LIBRARY_HUB_CARDS} /> : null} */}

        <div className={styles['library-below-hero']}>
          <LibraryCategoryScroller
            categories={allCategories}
            activeCategory={category}
            libraryMode="2d"
          />

          {showDiscoverySections ? (
            <LibraryDiscoverySections
              browsePartsTags={rankedBrowseTags}
              buildKitClusters={buildKitClusters}
              libraryMode="2d"
            />
          ) : null}

          <LibraryLayoutWithFilters
            filterProps={{
              initialTags,
              initialHasMore: initialTagsHasMore,
              initialSearchQuery: searchQuery,
              category,
              tags,
              allCategories,
              initialSort: searchParams?.sort,
              initialRecency: recency,
              initialFreePaid: freePaid,
              initialFileFormat: fileFormat,
              initialOutputFormat: outputFormat,
              initialProjection: projection,
              hasActiveFilters: hasFilters,
              libraryListMode: '2d',
              library2d: true,
              resetListHref: listRootPath,
              show2DExtraFilters: false,
            }}
            toolbarLeft={
              <div className={styles['library-content-head-left']}>
                <span className={styles['library-resources-count']}>
                  {resultsCountLabel} drawing sets
                </span>
                <Link
                  href="/library"
                  prefetch
                  className={styles['library-toolbar-2d-library-cta']}
                >
                  <span className={styles['library-toolbar-2d-library-cta-icon']} aria-hidden>
                    📦
                  </span>
                  3D models
                </Link>
              </div>
            }
            toolbarSort={
              <SortBySelect
                initialSort={searchParams?.sort}
                className={styles['library-content-sort-select']}
              />
            }
          >
            <div className={styles['library-designs']}>
              <div className={styles['library-designs-items']}>
                {designs.map((design, index) => (
                  <React.Fragment key={`2d-design-${design._id}`}>
                    {index === 0 && (
                      <div
                        className={`${styles['library-designs-items-container']} ${styles.libraryAdSlot}`}
                      >
                        <LeftRightBanner adSlot="2408570633" />
                      </div>
                    )}
                    {index === 6 && (
                      <div
                        className={`${styles['library-designs-items-container']} ${styles.libraryAdSlot}`}
                      >
                        <LeftRightBanner adSlot="4799748492" />
                      </div>
                    )}
                    <TwoDLibraryCard design={design} />

                    {index === FIRST_GRID_SIZE - 1 && !categoryLabel && !tagLabel ? (
                      <TwoDLibraryBottomSections />
                    ) : null}
                  </React.Fragment>
                ))}
              </div>

              <div className={styles['library-pagination']}>
                {paginationWindow.hasPrev && (
                  <Link
                    href={build2dLibraryHref({
                      category,
                      search: searchQuery,
                      page: dataPage - 1,
                      tags,
                      sort,
                      recency,
                      free_paid: freePaid,
                      file_format: fileFormat,
                      output_format: outputFormat,
                      projection,
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
                    href={build2dLibraryHref({
                      category,
                      search: searchQuery,
                      page: p,
                      tags,
                      sort,
                      recency,
                      free_paid: freePaid,
                      file_format: fileFormat,
                      output_format: outputFormat,
                      projection,
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
                    href={build2dLibraryHref({
                      category,
                      search: searchQuery,
                      page: dataPage + 1,
                      tags,
                      sort,
                      recency,
                      free_paid: freePaid,
                      file_format: fileFormat,
                      output_format: outputFormat,
                      projection,
                    })}
                    className={styles['pagination-button']}
                  >
                    next <KeyboardBackspaceIcon style={{ transform: 'rotate(180deg)' }} />
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
