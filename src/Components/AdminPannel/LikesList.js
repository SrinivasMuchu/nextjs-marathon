"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import styles from './AdminPannel.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config';
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import SearchIcon from '@mui/icons-material/Search';

function LikesList() {
  const [likes, setLikes] = useState([]);
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
    fetchLikes(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const fetchLikes = async (page = 1, q = '') => {
    setIsLoading(true);
    try {
      const params = { page, limit, q };

      const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-liked-designs`, {
        params,
        headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }
      });

      const respData = response?.data?.data || {};
      const likesData = respData.likes || [];
      setLikes(likesData);
      setTotalPages(respData.totalPages || 1);
      setTotal(respData.total || 0);
      
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }

      console.log('Likes response:', likesData, { 
        page: respData.page, 
        total: respData.total, 
        totalPages: respData.totalPages 
      });
    } catch (error) {
      console.error('Error fetching likes:', error);
      setLikes([]);
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

  return (
    <>
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles["search-container"]}>
             <SearchIcon className={styles["search-icon"]} />
              <input
            type="text"
            placeholder="Search by design title or organization name..."
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
              <th>Liked By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
              {likes.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>
                    {searchTerm ? 'No likes found for your search' : 'No likes found'}
                  </td>
                </tr>
              ) : (
                likes.map(like => {
                  const route = like.route;
                  const href = route ? `/library/${encodeURIComponent(route)}` : null;
                  return (
                  <tr key={like._id} className={styles.row}>
                    <td>
                      {href ? (
                        <Link href={href} className={styles.rowLink}>
                          <span>{like.design_title || 'N/A'}</span>
                        </Link>
                      ) : (
                        <span>{like.design_title || 'N/A'}</span>
                      )}
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{like.organization_name || 'N/A'}</div>
                        {like.organization_email && (
                          <div style={{ fontSize: '12px', color: '#666' }}>{like.organization_email}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span>{formatDateTime(like.createdAt)}</span>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
        </table>
      </div>

      <div className={styles.mobileCards}>
        {likes.length === 0 ? (
          <div className={styles.mobileEmpty}>
            {searchTerm ? 'No likes found for your search' : 'No likes found'}
          </div>
        ) : (
          likes.map((like) => {
            const route = like.route
            const href = route ? `/library/${encodeURIComponent(route)}` : null
            const CardTag = href ? Link : 'div'
            const cardProps = href
              ? { href, className: styles.mobileCard, style: { textDecoration: 'none', color: 'inherit' } }
              : { className: styles.mobileCard }
            return (
              <CardTag key={like._id} {...cardProps}>
                <div className={styles.mobileCardHeader}>
                  <h3 className={styles.mobileCardTitle}>{like.design_title || 'N/A'}</h3>
                </div>
                <div className={styles.mobileCardBody}>
                  <div className={styles.mobileCardField}>
                    <span className={styles.mobileCardLabel}>Liked By</span>
                    <span className={styles.mobileCardValue}>{like.organization_name || 'N/A'}</span>
                    {like.organization_email ? (
                      <span className={styles.mobileCardSub}>{like.organization_email}</span>
                    ) : null}
                  </div>
                  <div className={styles.mobileCardMeta}>
                    <span className={styles.mobileCardDate}>Date: {formatDateTime(like.createdAt)}</span>
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

export default LikesList
