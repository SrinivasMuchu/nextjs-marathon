"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import styles from './AdminPannel.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config';
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';

function RatingsList() {
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  // pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // search state
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchRatings(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const fetchRatings = async (page = 1, q = '') => {
    setIsLoading(true);
    try {
      const params = { page, limit, q };

      const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-design-ratings`, {
        params,
        headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }
      });

      const respData = response?.data?.data || {};
      const ratingsData = respData.ratings || [];
      setRatings(ratingsData);
      setTotalPages(respData.totalPages || 1);
      setTotal(respData.total || 0);
      
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }

      console.log('Ratings response:', ratingsData, { 
        page: respData.page, 
        total: respData.total, 
        totalPages: respData.totalPages 
      });
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setRatings([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchTerm(searchInput.trim())
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-GB', options);
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={styles.starIcon}
          style={{
            color: i <= rating ? '#FFD700' : '#ddd',
            fontSize: '18px'
          }}
        />
      );
    }
    return <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>;
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles["search-container"]}>
             <SearchIcon className={styles["search-icon"]} />
              <input
            type="text"
            placeholder="Search by design title, user name, or comment..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles["search-input"]}
          />
          </div>

          
          
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
          {searchTerm && (
            <button type="button" onClick={handleClearSearch} className={styles.clearBtn}>
              Clear
            </button>
          )}
        </form>
        {searchTerm && (
          <p className={styles.searchInfo}>
            Showing results for &quot;{searchTerm}&quot; ({total} found)
          </p>
        )}
      </div>

      {isLoading ? (
        <div className={styles.loadingWrap}>
          <Loading />
        </div>
      ) : (
        <>
      <div className={`${styles.tableWrap} ${styles.desktopTable}`} style={{width:"100%"}}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Design Title</th>
              <th>Rated By</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
              {ratings.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>
                    {searchTerm ? 'No ratings found for your search' : 'No ratings found'}
                  </td>
                </tr>
              ) : (
                ratings.map(rating => {
                  const route = rating.route;
                  const href = route ? `/library/${encodeURIComponent(route)}` : null;
                  return (
                  <tr key={rating._id} className={styles.row}>
                    <td>
                      {href ? (
                        <Link href={href} className={styles.rowLink}>
                          <span>{rating.design_title || 'N/A'}</span>
                        </Link>
                      ) : (
                        <span>{rating.design_title || 'N/A'}</span>
                      )}
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{rating.user_name || 'N/A'}</div>
                        {rating.user_email && (
                          <div style={{ fontSize: '12px', color: '#666' }}>{rating.user_email}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      {rating.star_rating ? renderStars(rating.star_rating) : 'N/A'}
                    </td>
                    <td>
                      <span style={{ 
                        maxWidth: '300px', 
                        display: 'inline-block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {rating.comment || '-'}
                      </span>
                    </td>
                    <td>
                      <span>{formatDateTime(rating.createdAt)}</span>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
        </table>
      </div>

      <div className={styles.mobileCards}>
        {ratings.length === 0 ? (
          <div className={styles.mobileEmpty}>
            {searchTerm ? 'No ratings found for your search' : 'No ratings found'}
          </div>
        ) : (
          ratings.map((rating) => {
            const route = rating.route
            const href = route ? `/library/${encodeURIComponent(route)}` : null
            const CardTag = href ? Link : 'div'
            const cardProps = href
              ? { href, className: styles.mobileCard, style: { textDecoration: 'none', color: 'inherit' } }
              : { className: styles.mobileCard }
            return (
              <CardTag key={rating._id} {...cardProps}>
                <div className={styles.mobileCardHeader}>
                  <h3 className={styles.mobileCardTitle}>{rating.design_title || 'N/A'}</h3>
                  <span className={styles.mobileCardAside}>
                    {rating.star_rating ? renderStars(rating.star_rating) : 'N/A'}
                  </span>
                </div>
                <div className={styles.mobileCardBody}>
                  <div className={styles.mobileCardField}>
                    <span className={styles.mobileCardLabel}>Rated By</span>
                    <span className={styles.mobileCardValue}>{rating.user_name || 'N/A'}</span>
                    {rating.user_email ? (
                      <span className={styles.mobileCardSub}>{rating.user_email}</span>
                    ) : null}
                  </div>
                  {rating.comment ? (
                    <div className={styles.mobileCardField}>
                      <span className={styles.mobileCardLabel}>Comment</span>
                      <span className={styles.mobileCardValue}>{rating.comment}</span>
                    </div>
                  ) : null}
                  <div className={styles.mobileCardMeta}>
                    <span className={styles.mobileCardDate}>Date: {formatDateTime(rating.createdAt)}</span>
                  </div>
                </div>
              </CardTag>
            )
          })
        )}
      </div>
        </>
      )}
      
      <div className={styles.paginationWrap}>
        {totalPages > 1 && (
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            noPages={true}
          />
        )}
      </div>
    </>
  )
}

export default RatingsList
