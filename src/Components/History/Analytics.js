"use client";
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/config';
import styles from './FileHistory.module.css';
import Pagenation from '../CommonJsx/Pagenation';
import Loading from '../CommonJsx/Loaders/Loading';
import { useRouter } from 'next/navigation';

function Analytics({ currentPage, setCurrentPage, totalPages, setTotalPages, creatorId }) {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('views'); // 'views' | 'downloads'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [totals, setTotals] = useState({ totalViews: 0, totalDownloads: 0 }); // summary cards (frontend)
  const router = useRouter();
  const limit = 12;

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, setCurrentPage]);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      if (!isMounted) return;
      try {
        setLoading(true);
        // Query params control pagination/search/basic flags (backend unchanged)
        const apiParams = {
          type: 'ANALYTICS',
          page: currentPage,
          limit,
          search: debouncedSearchTerm,
          sortBy,
          sortOrder,
        };
        // Backend only expects analytics flag + basic params
        const response = await axios.get(`${BASE_URL}/v1/cad/get-file-history`, {
          params: apiParams,
          headers: {
            "user-uuid": localStorage.getItem("uuid"),
          },
        });

        if (!isMounted) return;

        if (response.data.meta.success) {
          const analytics_files = response.data.data.analytics_files || [];
          const page = response.data.data.pagination.page;
          const totalPages = response.data.data.pagination.cadFilesPages;
          const publisher_analytics = response.data.data.publisher_analytics || {};

          setAnalyticsData(analytics_files);
          setCurrentPage(page);
          setTotalPages(totalPages);

          // Use totals from publisher_analytics (backend provides aggregated totals)
          setTotals({
            totalViews: Number(publisher_analytics.total_views ?? 0),
            totalDownloads: Number(publisher_analytics.total_downloads ?? 0),
          });
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearchTerm, sortBy, sortOrder, creatorId, setCurrentPage, setTotalPages]);

  // Toggle sort order helper
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Backend handles sorting, so we can use the data directly
  // But keep this for client-side fallback if needed
  const sortedAnalyticsData = useMemo(() => {
    // Backend should handle sorting, but if we need client-side sorting as fallback:
    return analyticsData;
  }, [analyticsData]);

  const handleRowClick = (file) => {
    // Only navigate if route exists
    if (file.route) {
      router.push(`/library/${file.route}`);
    }
    // If route doesn't exist, the row won't be clickable (no cursor pointer)
  };

  return (
    <div className={styles.cadViewerContainerContent}>
      {/* All controls in one line: Summary cards + Search + Sort */}
      <div className={styles.analyticsTopSection}>
        {/* Total Views Card */}
        <div className={styles.summaryCard}>
          <span className={styles.summaryCardLabel}>
            TOTAL VIEWS
          </span>
          <span className={styles.summaryCardValue}>
            {totals.totalViews.toLocaleString()}
          </span>
        </div>

        {/* Total Downloads Card */}
        <div className={styles.summaryCard}>
          <span className={styles.summaryCardLabel}>
            TOTAL DOWNLOADS
          </span>
          <span className={styles.summaryCardValue}>
            {totals.totalDownloads.toLocaleString()}
          </span>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Sorting controls */}
        <div className={styles.sortControls}>
          <span className={styles.sortLabel}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="views">Views</option>
            <option value="downloads">Downloads</option>
          </select>

          <button
            type="button"
            onClick={toggleSortOrder}
            className={styles.sortButton}
          >
            <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
            <span className={styles.sortArrow}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <Loading smallScreen={true} />
      ) : (
        <>
          {analyticsData.length > 0 ? (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className={styles["industry-design-files-list"]} style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Views</th>
                    <th>Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAnalyticsData.map((file, index) => (
                    <tr
                      key={file._id || index}
                      onClick={() => handleRowClick(file)}
                      style={{ cursor: file.route ? 'pointer' : 'default' }}
                    >
                      <td>{file.page_title || 'Untitled'}</td>
                      <td>{file.total_design_views ?? 0}</td>
                      <td>{file.total_design_downloads ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>No analytics data available</span>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      <div className={styles.paginationWrapper}>
        {totalPages > 1 && (
          <Pagenation
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
}

export default Analytics;

