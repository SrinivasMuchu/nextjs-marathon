"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import styles from './AdminPannel.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config';
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import SearchIcon from '@mui/icons-material/Search';
import UpdateSearchTextPopup from './UpdateSearchTextPopup';
import { toast } from 'react-toastify';

function SearchedList() {
  const [searchLogs, setSearchLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  // pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // search state
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // popup state
  const [editingRowId, setEditingRowId] = useState(null)
  const [updatedSearchText, setUpdatedSearchText] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchSearchLogs(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const fetchSearchLogs = async (page = 1, q = '') => {
    setIsLoading(true);
    try {
      const params = { page, limit, q };

      const response = await axios.get(`${BASE_URL}/v1/admin-pannel/get-search-logs`, {
        params,
        headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }
      });

      const respData = response?.data?.data || {};
      const logs = respData.searchLogs || [];
      setSearchLogs(logs);
      setTotalPages(respData.totalPages || 1);
      setTotal(respData.total || 0);
      
      if (respData.page && respData.page !== page) {
        setCurrentPage(respData.page)
      }

      console.log('Search Logs response:', logs, { 
        page: respData.page, 
        total: respData.total, 
        totalPages: respData.totalPages 
      });
    } catch (error) {
      console.error('Error fetching search logs:', error);
      setSearchLogs([]);
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

  const handleUpdateSearchTextClick = (log) => {
    setEditingRowId(log._id)
    setUpdatedSearchText(log.marathon_search_text || log.search_text || '')
  }

  const handleClosePopup = () => {
    setEditingRowId(null)
    setUpdatedSearchText('')
  }

  const handleUpdateSearchText = async (newSearchText) => {
    if (!editingRowId) return

    setIsUpdating(true)
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/admin-pannel/update-marathon-search-text`,
        {
          search_id: editingRowId,
          marathon_search_text: newSearchText
        },
        {
          headers: { 'admin-uuid': localStorage.getItem('admin-uuid') }
        }
      )

      if (response.data.meta.success) {
        toast.success(response.data.meta.message || 'Search text updated successfully')
        handleClosePopup()
        // Refresh the table data
        fetchSearchLogs(currentPage, searchTerm)
      } else {
        toast.error(response.data.meta.message || 'Failed to update search text')
      }
    } catch (error) {
      console.error('Error updating search text:', error)
      toast.error(error.response?.data?.meta?.message || 'Failed to update search text')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCrawlClick = async (log) => {
    // Placeholder for crawl functionality
    console.log('Crawl clicked for:', log._id)
    toast.info('Crawl functionality to be implemented')
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

      <div className={styles.tableWrap} style={{width:"100%"}}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Search Text</th>
              <th>Marathon Search Term</th>
              <th>User Email</th>
              <th>Username</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {isLoading ? (
            <div style={{ padding: 20, textAlign: 'center' }}>
              <Loading />
            </div>
          ) : (
            <tbody>
              {searchLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>
                    {searchTerm ? 'No search logs found for your search' : 'No search logs found'}
                  </td>
                </tr>
              ) : (
                searchLogs.map(log => (
                  <tr key={log._id} className={styles.row}>
                    <td>
                      <span>{log.search_text || ''}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{log.marathon_search_text || 'N/A'}</span>
                        {log.is_marathon_search_text_crawled && (
                          <span style={{ 
                            color: '#22c55e', 
                            fontSize: '18px',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}>✓</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span>{log.user_email || 'N/A'}</span>
                    </td>
                    <td>
                      {log.username && log.username !== 'N/A' ? (
                        <Link 
                          href={`/creator/${log.username}`}
                          style={{ 
                            color: '#0070f3', 
                            textDecoration: 'none',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                          {log.username}
                        </Link>
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                    <td>
                      <span>{formatDateTime(log.createdAt)}</span>
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionApprove}`}
                          onClick={() => handleCrawlClick(log)}
                          title="Crawl"
                        >
                          Crawl
                        </button>
                        <button
                          className={`${styles.actionBtn}`}
                          onClick={() => handleUpdateSearchTextClick(log)}
                          title="Update Search Text"
                          style={{
                            background: 'rgba(59, 130, 246, .12)',
                            color: '#3b82f6',
                            borderColor: 'rgba(59, 130, 246, .35)'
                          }}
                        >
                          Update Search Text
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
            noPages={true}
          />
        )}
      </div>

      {editingRowId && (
        <UpdateSearchTextPopup
          onClose={handleClosePopup}
          currentSearchText={updatedSearchText}
          onUpdate={handleUpdateSearchText}
          isLoading={isUpdating}
        />
      )}
    </>
  )
}

export default SearchedList

