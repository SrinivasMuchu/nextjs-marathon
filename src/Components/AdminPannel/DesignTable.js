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

function statusBadge(status) {
  const base = styles.badge
  if (status === 'Approved') return `${base} ${styles.badgeSuccess}`
  if (status === 'In Review') return `${base} ${styles.badgeInfo}`
  return `${base} ${styles.badgeWarn}`
}

function DesignTable() {
  const [cadDesigns, setCadDesigns] = useState([]);
  const [isLoading,setIsLoading] = useState(false)

  // pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // search state
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchDesignDetails(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const fetchDesignDetails = async (page = 1, q = '') => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-cad-files`, {
        params: { page, limit, q },
        headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }
      });

      const respData = response?.data?.data || {};
      const designs = respData.designs || [];
      setCadDesigns(designs);
      setTotalPages(respData.totalPages || 1);
      setTotal(respData.total || 0);
      
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }

      console.log('CAD Designs response:', designs, { 
        page: respData.page, 
        total: respData.total, 
        totalPages: respData.totalPages 
      });
    } catch (error) {
      console.error('Error fetching CAD designs:', error);
      setCadDesigns([]);
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
            Showing results for "{searchTerm}" ({total} found)
          </p>
        )}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Design</th>
              <th>Owner</th>
              <th>Uploaded date</th>
            </tr>
          </thead>
          {isLoading ? (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <Loading />
            </div>
          ) : (
            <tbody>
              {cadDesigns.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 20 }}>
                    {searchTerm ? 'No designs found for your search' : 'No designs found'}
                  </td>
                </tr>
              ) : (
                cadDesigns.map(d => {
                  const route = d.route || d.page_title;
                  const href = `/admin/${encodeURIComponent(route)}`
                  return (
                    <tr key={d._id} className={styles.row}>
                      <td>
                        <Link href={href} className={styles.rowLink}>{d._id}</Link>
                      </td>
                      <td>
                        <Link href={href} className={styles.rowLink}>{d.page_title}</Link>
                      </td>
                      <td>
                        <Link href={href} className={styles.rowLink}>{d.fullName}</Link>
                      </td>
                      <td>
                        <Link href={href} className={styles.rowLink}>
                          <span>{formatDate(d.createdAt)}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          )}
        </table>
      </div>
      
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
        {totalPages > 1 && (
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  )
}

export default DesignTable