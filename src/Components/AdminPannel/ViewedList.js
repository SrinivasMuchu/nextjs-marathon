"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import styles from './AdminPannel.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config';
import { formatDate } from '@/common.helper'
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import SearchIcon from '@mui/icons-material/Search';

function ViewedList() {
  const [viewedDesigns, setViewedDesigns] = useState([]);
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
    fetchViewedDesigns(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const fetchViewedDesigns = async (page = 1, q = '') => {
    setIsLoading(true);
    try {
      const params = { page, limit, q };

      const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-most-viewed-cad-files`, {
        params,
        headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }
      });

      const respData = response?.data?.data || {};
      const designs = respData.designs || respData.viewedDesigns || [];
      setViewedDesigns(designs);
      setTotalPages(respData.totalPages || 1);
      setTotal(respData.total || 0);
      
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }

      console.log('Viewed Designs response:', designs, { 
        page: respData.page, 
        total: respData.total, 
        totalPages: respData.totalPages 
      });
    } catch (error) {
      console.error('Error fetching viewed designs:', error);
      setViewedDesigns([]);
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

  const formatPrice = (price) => {
    if (!price || price === 0 || price === '0') {
      return 'Free'
    }
    return `$${price}`
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles["search-container"]}>
             <SearchIcon className={styles["search-icon"]} />
              <input
            type="text"
            placeholder="Search ..."
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
      <div className={`${styles.tableWrap} ${styles.desktopTable}`}>
        <table className={styles.table}>
          <thead>
            <tr>
            
              <th>Title</th>
              <th>Price</th>
              <th>Views</th>
            
            </tr>
          </thead>
          <tbody>
              {viewedDesigns.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>
                    {searchTerm ? 'No designs found for your search' : 'No viewed designs found'}
                  </td>
                </tr>
              ) : (
                viewedDesigns.map(d => {
                  const route = d.route || d.page_title;
                  const href = `/library/${encodeURIComponent(route)}`
                  return (
                    <tr key={d._id} className={styles.row}>
                     
                      <td>
                        <Link href={href} className={styles.rowLink}>{d.page_title || d.title}</Link>
                      </td>
                      <td>
                        <Link href={href} className={styles.rowLink}>
                          <span>{formatPrice(d.price)}</span>
                        </Link>
                      </td>
                      <td>
                        <Link href={href} className={styles.rowLink}>
                          <span>{d.total_design_views|| 0}</span>
                        </Link>
                      </td>
                      <td>
                        
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
        </table>
      </div>

      <div className={styles.mobileCards}>
        {viewedDesigns.length === 0 ? (
          <div className={styles.mobileEmpty}>
            {searchTerm ? 'No designs found for your search' : 'No viewed designs found'}
          </div>
        ) : (
          viewedDesigns.map((d) => {
            const route = d.route || d.page_title
            const href = `/library/${encodeURIComponent(route)}`
            return (
              <Link key={d._id} href={href} className={styles.mobileCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.mobileCardHeader}>
                  <h3 className={styles.mobileCardTitle}>{d.page_title || d.title || 'Design'}</h3>
                  <span className={styles.mobileCardAside}>{formatPrice(d.price)}</span>
                </div>
                <div className={styles.mobileCardBody}>
                  <div className={styles.mobileCardField}>
                    <span className={styles.mobileCardLabel}>Views</span>
                    <span className={styles.mobileCardValue}>{d.total_design_views || 0}</span>
                  </div>
                </div>
              </Link>
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

export default ViewedList

