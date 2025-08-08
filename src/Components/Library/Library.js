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
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchFilter';
import ActiveLastBreadcrumb from '../CommonJsx/BreadCrumbs';
import DesignStats from '../CommonJsx/DesignStats';
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import LeftRightBanner from '../CommonJsx/Adsense/LeftRightBanner';

// Utility function to build the query string
const buildQueryString = (params) => {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.limit) query.set('limit', params.limit);
  if (params.page) query.set('page', params.page);
  if (params.tags) query.set('tags', params.tags);
  return `?${query.toString()}`;
};

async function Library({ searchParams }) {
  const searchQuery = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = parseInt(searchParams?.page) || 1;
  const limit = parseInt(searchParams?.limit) || 20;
  const tags = searchParams?.tags || '';
  let response;

    response = await axios.get(
       `${BASE_URL}/v1/cad/get-category-design?category=${category}&limit=${limit}&page=${page}&search=${searchQuery}&tags=${tags}`,
    { cache: 'no-store' }
    );

  
  const categoriesRes = await axios.get(`${BASE_URL}/v1/cad/get-categories`, {
    cache: 'no-store',
  });
  const tagsResponse = await axios.get(`${BASE_URL}/v1/cad/get-cad-tags`, {
    cache: 'no-store',
  });


  const allCategories = categoriesRes.data?.data || [];
  const data = response.data;
  const designs = data?.data?.designDetails || [];
  const pagination = data?.data?.pagination || {};
  const totalPages = pagination?.totalPages || 1;
  const allTags = tagsResponse.data?.data || [];
  // console.log(designs)
  return (
    <>
      {/* <HomeTopNav /> */}
      <ActiveLastBreadcrumb links={[
        { label: 'Library', href: '/library' },
        // { label: `${industryData.industry}`, href: `/industry/${industry}` },

      ]} />
      <div className={styles["library-designs-filters"]}>
        <SearchBar initialSearchQuery={searchQuery} />
        <CategoryFilter
          allCategories={allCategories} allTags={allTags}
          initialSelectedCategories={category.split(",")}
          initialTagSelectedOption={tags}
        />
        {Object.keys(searchParams || {}).length > 0 && (
          <Link href='/library' style={{ background: '#610bee', padding: '5px 10px', borderRadius: '4px', color: 'white' }}>
            <button>Reset filters</button>
          </Link>
        )}
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
                <div className={styles["library-designs-items-container-cost"]}>Free</div>
                  {/* <div className={styles["library-designs-items-container-img"]}>
                      <Image
                    // className={styles["library-designs-items-container-img"]}
                    src={`${DESIGN_GLB_PREFIX_URL}${design._id}/sprite_0_0.webp`}
                    alt={design.page_title}
                    width={300}
                    height={250}
                  />
                  </div> */}
                  <HoverImageSequence design={design} width={300} height={250}/>
                
                  <div className={styles["design-stats-wrapper"]}>
                    <DesignStats views={design.total_design_views ?? 0}
                      downloads={design.total_design_downloads ?? 0} />
                  </div>
                  <div className={styles["design-title-wrapper"]}>
                    <h6 title={design.page_title}>{textLettersLimit(design.page_title, 30)}</h6>
                     <p title={design.page_description}>{textLettersLimit(design.page_description, 120)}</p>
                    <div className={styles["design-title-text"]} style={{ display: 'flex', gap: '10px', alignItems: 'center',flexWrap:'wrap' }}>
                      {/* {design.industry_name &&<DesignDetailsStats  text={design.industry_name} />} */}
                      {design.category_labels && design.category_labels.map((label, index) => (
                        <DesignDetailsStats key={index} text={label} />
                      ))}
                      {design.tag_labels && design.tag_labels.map((label, index) => (
                        <DesignDetailsStats key={index} text={label} />
                      ))}
                      <DesignDetailsStats fileType={design.file_type ? `.${design.file_type.toLowerCase()}` : '.STEP'} text={design.file_type ? `.${design.file_type.toUpperCase()}`  : '.STEP'} />
                    </div>
                    <span className={styles["design-title-wrapper-price"]}>Free</span>
                  
                  </div>
                  
                  
                {/* </div> */}
              </Link>
            </React.Fragment>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles["library-pagination"]} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
          {page > 1 && (
            <Link href={buildQueryString({ category, search: searchQuery, limit, page: page - 1, tags })}>
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
                href={buildQueryString({ category, search: searchQuery, limit, page: 1, tags })}
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
                  href={buildQueryString({ category, search: searchQuery, limit, page: p, tags })}
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
                  href={buildQueryString({ category, search: searchQuery, limit, page: totalPages, tags })}
                  className={`${styles['pagination-button']} ${page === totalPages ? styles.active : ''}`}
                >
                  {totalPages}
                </Link>
              );
            }

            return pageLinks;
          })()}

          {page < totalPages && (
            <Link href={buildQueryString({ category, search: searchQuery, limit, page: page + 1, tags })}>
              <button>next <KeyboardBackspaceIcon style={{ transform: "rotate(180deg)" }} /></button>
            </Link>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Library;
