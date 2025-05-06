import axios from 'axios';
import { BASE_URL } from '@/config';
import Image from 'next/image';
import styles from './Library.module.css';
import { textLettersLimit } from '@/common.helper';
import Link from 'next/link';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav';
import Footer from '../HomePages/Footer/Footer';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DownloadIcon from '@mui/icons-material/Download';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchFilter';


async function Library({ searchParams }) {
  const searchQuery = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = parseInt(searchParams?.page) || 1;
  const limit = parseInt(searchParams?.limit) || 100;

  const response = await axios.get(
    `${BASE_URL}/v1/cad/get-category-design?category=${category}&limit=${limit}&page=${page}&search=${searchQuery}`,
    { cache: 'no-store' }
  );
  const categoriesRes = await axios.get(`${BASE_URL}/v1/cad/get-categories`, {
    cache: 'no-store',
  });

  const allCategories = categoriesRes.data?.data || [];
  const data = response.data;
  const designs = data?.data?.designDetails || [];
  console.log("Designs:", designs);
  const pagination = data?.data?.pagination || {};

  const totalPages = pagination?.totalPages || 1;





  const selectedCategories = category ? category.split(",") : [];
  return (
    <>
      <HomeTopNav />
      <div className={styles["library-designs-filters"]}>
          <SearchBar initialSearchQuery={searchQuery} />
          <CategoryFilter allCategories={allCategories}
            initialSelectedCategories={category.split(",")} />
        </div>
      <div className={styles["library-designs"]}>
        {/* <div className={styles["library-designs-header"]}>
        <h2>Library</h2>
        <p>Category: {category || 'All'}</p>
      </div> */}
       



        <div className={styles["library-designs-items"]}>
          {designs.map((design) => (
            <a key={design._id} href={`/library/${design.route}`} className={styles["library-designs-items-container"]}>
              <div >
                <Image
                  className={styles["library-designs-items-container-img"]}
                  src={`https://d1d8a3050v4fu6.cloudfront.net/${design._id}/sprite_0_0.webp`}
                  alt={design.page_title}
                  width={300}
                  height={250}
                />
                <div style={{ width: '100%', height: '2px', background: 'grey', marginBottom: '5px' }}></div>
                <h6>{textLettersLimit(design.page_title, 40)}</h6>
                <p>{textLettersLimit(design.page_description, 75)}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles["library-pagination"]} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>



          {page > 1 && (
            <Link href={`?category=${category}&limit=${limit}&page=${page - 1}`}>
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
                href={`?category=${category}&limit=${limit}&page=1`}
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
                  href={`?category=${category}&limit=${limit}&page=${p}`}
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
                  href={`?category=${category}&limit=${limit}&page=${totalPages}`}
                  className={`${styles['pagination-button']} ${page === totalPages ? styles.active : ''}`}
                >
                  {totalPages}
                </Link>
              );
            }

            return pageLinks;
          })()}

          {page < totalPages && (
            <Link href={`?category=${category}&limit=${limit}&page=${page + 1}`}>
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
