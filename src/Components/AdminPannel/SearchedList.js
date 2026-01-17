"use client"
import React, {useState, useEffect} from 'react'
import styles from './AdminPannel.module.css'
import axios from 'axios'
import { BASE_URL } from '@/config';
import Pagenation from '@/Components/CommonJsx/Pagenation'
import Loading from '../CommonJsx/Loaders/Loading'
import SearchIcon from '@mui/icons-material/Search';

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
              <th>User Email</th>
              <th>Username</th>
              <th>Date</th>
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
                  <td colSpan={4} style={{ textAlign: 'center', padding: 20 }}>
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
                      <span>{log.user_email || 'N/A'}</span>
                    </td>
                    <td>
                      <span>{log.username || 'N/A'}</span>
                    </td>
                    <td>
                      <span>{formatDateTime(log.createdAt)}</span>
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
    </>
  )
}

export default SearchedList

