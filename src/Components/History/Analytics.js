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
          type: 'USER_CADS',
          username: creatorId && creatorId,
          page: currentPage,
          profile_page: true,
          analytics: true,
          limit,
          search: debouncedSearchTerm,
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
          const my_cad_files = response.data.data.my_cad_files || [];
          const page = response.data.data.pagination.page;
          const totalPages = response.data.data.pagination.cadFilesPages;

          setAnalyticsData(my_cad_files);
          setCurrentPage(page);
          setTotalPages(totalPages);

          // Compute totals for current page (frontend only)
          const totalsFromPage = my_cad_files.reduce(
            (acc, file) => {
              acc.totalViews += Number(file.total_design_views ?? 0);
              acc.totalDownloads += Number(file.total_design_downloads ?? 0);
              return acc;
            },
            { totalViews: 0, totalDownloads: 0 }
          );
          setTotals(totalsFromPage);
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
  }, [currentPage, debouncedSearchTerm, creatorId, setCurrentPage, setTotalPages]);

  // Toggle sort order helper
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Client-side sorting based on sortBy/sortOrder
  const sortedAnalyticsData = useMemo(() => {
    const data = [...analyticsData];
    const field = sortBy === 'downloads' ? 'total_design_downloads' : 'total_design_views';
    data.sort((a, b) => {
      const aVal = Number(a[field] ?? 0);
      const bVal = Number(b[field] ?? 0);
      if (sortOrder === 'asc') {
        return aVal - bVal;
      }
      return bVal - aVal;
    });
    return data;
  }, [analyticsData, sortBy, sortOrder]);

  const handleRowClick = (file) => {
    if (file.route) {
      router.push(`/library/${file.route}`);
    }
  };

  return (
    <div className={styles.cadViewerContainerContent}>
      {/* Top summary + search/sort row */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Summary cards */}
       

        {/* Search (left) + Sort (right) */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search Bar (left aligned) */}
          <div
            style={{
              flex: '1 1 260px',
              maxWidth: '480px',
              minWidth: '200px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '24px',
                padding: '8px 16px',
                border: '1px solid #e9ecef',
                gap: '8px',
                width: '100%',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search analytics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  flex: 1,
                  fontSize: '14px',
                  color: '#495057',
                }}
              />
            </div>
          </div>

          {/* Sorting controls (right side) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'flex-end',
              flex: '0 0 auto',
            }}
          >
            <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 500 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                backgroundColor: '#fff',
                fontSize: '13px',
                color: '#495057',
              }}
            >
              <option value="views">Views</option>
              <option value="downloads">Downloads</option>
            </select>

            <button
              type="button"
              onClick={toggleSortOrder}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e9ecef',
                backgroundColor: '#fff',
                fontSize: '13px',
                color: '#495057',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
              <span style={{ fontSize: '12px' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div
            style={{
              
              width: '160px',
              padding: '16px 20px',
              borderRadius: '12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#6c757d' }}>
              TOTAL VIEWS
            </span>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#212529' }}>
              {totals.totalViews.toLocaleString()}
            </span>
          </div>

          <div
            style={{
            
              width: '160px',
              padding: '16px 20px',
              borderRadius: '12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#6c757d' }}>
              TOTAL DOWNLOADS
            </span>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#212529' }}>
              {totals.totalDownloads.toLocaleString()}
            </span>
          </div>
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
                      style={{ cursor: 'pointer' }}
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
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              width: '100%',
              textAlign: 'center',
              gap: '40px',
              padding: '40px'
            }}>
              <span>No analytics data available</span>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
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

