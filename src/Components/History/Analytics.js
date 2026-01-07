"use client";
import React, { useState, useEffect } from 'react';
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
        const apiParams = {
          type: 'USER_CADS',
          username: creatorId && creatorId,
          page: currentPage,
          profile_page:true,
          analytics:true,
          limit,
          search: debouncedSearchTerm,
        };

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

  const handleRowClick = (file) => {
    if (file.route) {
      router.push(`/library/${file.route}`);
    }
  };

  return (
    <div className={styles.cadViewerContainerContent}>
      {/* Search Bar */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '24px',
          padding: '8px 16px',
          border: '1px solid #e9ecef',
          minWidth: '280px',
          gap: '8px',
          width: '100%',
          maxWidth: '500px'
        }}>
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
              color: '#495057'
            }}
          />
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
                  {analyticsData.map((file, index) => (
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

