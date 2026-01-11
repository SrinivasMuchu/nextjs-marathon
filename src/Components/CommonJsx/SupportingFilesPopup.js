"use client";
import React from 'react';
import Image from 'next/image';
import PopupWrapper from './PopupWrapper';
import styles from './CommonStyles.module.css';
import { FaFile, FaDownload } from 'react-icons/fa';
import { IMAGEURLS} from '@/config';

function SupportingFilesPopup({ files, onClose, loading, onDownloadMainFile, isDownloadingMainFile, cadFilenName }) {
  // Helper function to get file extension
  const getFileExtension = (fileName) => {
    if (!fileName) return '';
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
  };

  // Helper function to format file size
  const formatFileSize = (size) => {
    if (!size && size !== 0) return 'N/A';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper function to get file name
  const getFileName = (file) => {
    return file?.name || 'Unknown';
  };

  // Helper function to get file URL
  const getFileUrl = (file) => {
    return file?.url || file?.fileUrl || '';
  };

  // Helper function to get file size
  const getFileSize = (file) => {
    return file?.size || file?.fileSize || null;
  };

  // Helper function to get file type
  const getFileType = (file) => {
    return file?.type || getFileExtension(getFileName(file));
  };

  // Handle download using anchor tag to avoid popup blockers
  // Fetch as blob to force download instead of viewing (for PDFs, images, etc.)
  const handleDownload = async (file) => {
    const url = getFileUrl(file);
    if (!url) {
      console.error('No download URL available for file:', file);
      return;
    }

    try {
      // Fetch the file as a blob to force download
      // Use mode: 'cors' to handle cross-origin requests if needed
      const response = await fetch(url, {
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Get the file name with proper extension
      const fileName = getFileName(file);
      
      // Create a new blob with explicit type to force download
      // Some browsers need this to prevent viewing
      const downloadBlob = new Blob([blob], { 
        type: 'application/octet-stream' // Force as binary to prevent viewing
      });
      const downloadUrl = window.URL.createObjectURL(downloadBlob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName; // Force download with filename
      link.setAttribute('download', fileName); // Explicitly set download attribute
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up immediately
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: Try to force download by appending ?download=1 or using download attribute
      const fileName = getFileName(file);
      const link = document.createElement('a');
      
      // Try to modify URL to force download (some servers respect this)
      const downloadUrl = url.includes('?') ? `${url}&download=1` : `${url}?download=1`;
      
      link.href = downloadUrl;
      link.download = fileName;
      link.setAttribute('download', fileName);
      link.style.display = 'none';
      link.setAttribute('target', '_self');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  // Show loading indicator if loading is true
  if (loading) {
    return (
      <PopupWrapper>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          padding: '40px 32px',
          width: '400px',
          maxWidth: '95vw',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          position: 'relative'
        }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#2d3748', marginBottom: 24 }}>Fetching Supporting Files...</div>
          <div style={{ marginBottom: 24 }}>
            <div className={styles['loader']} style={{ width: 48, height: 48, border: '6px solid #eee', borderTop: '6px solid #610BEE', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => { e.target.style.background = '#5a6268'; }}
            onMouseLeave={e => { e.target.style.background = '#6c757d'; }}
          >
            Close
          </button>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </PopupWrapper>
    );
  }

  // if (!files || files.length === 0) {
  //   return null;
  // }

  return (
    <PopupWrapper>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        padding: '24px 32px',
        width: '600px',
        maxWidth: '95vw',
        maxHeight: '80vh',
        overflowY: 'auto',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '16px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            color: '#2d3748'
          }}>
            Files ({files.length+1})
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#999',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Main 3D design row with download button */}
        {onDownloadMainFile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            marginBottom: 24
          }}>
            {/* Main file thumbnail or indicator */}
           
              <div style={{ minWidth: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src={IMAGEURLS.fileformat}
                  alt="3D Design Thumbnail"
                  width={60}
                  height={60}
                  style={{ objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' }}
                />
              </div>
         
            {/* File Info */}
            <div style={{
              flex: 1,
              minWidth: 0
            }}>
              <div style={{
                fontWeight: 600,
                fontSize: '16px',
                color: '#222',
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {cadFilenName ? cadFilenName : '3D Design'}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#666'
              }}>
                {/* Optionally, you can show a description or leave blank */}
              </div>
            </div>
            {/* Download Button */}
            <button
              onClick={onDownloadMainFile}
              disabled={isDownloadingMainFile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#610BEE',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: isDownloadingMainFile ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                minWidth: '120px',
                justifyContent: 'center',
                opacity: isDownloadingMainFile ? 0.7 : 1
              }}
              onMouseEnter={e => { if (!isDownloadingMainFile) e.target.style.background = '#4c0bc5'; }}
              onMouseLeave={e => { if (!isDownloadingMainFile) e.target.style.background = '#610BEE'; }}
            >
              <FaDownload style={{ fontSize: '14px' }} />
              {isDownloadingMainFile ? 'Downloading...' : 'Download'}
            </button>
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {files.map((file, index) => {
            const fileName = getFileName(file);
            const fileSize = getFileSize(file);
            const fileType = getFileType(file);
            const fileExtension = getFileExtension(fileName);
            const fileUrl = getFileUrl(file);

            // Check if file is an image
            const imageExtensions = ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'BMP', 'SVG'];
            const isImage = imageExtensions.includes(fileExtension.toUpperCase());

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}
              >
                {/* File Type Indicator or Image Thumbnail */}
                {isImage && fileUrl ? (
                  <img
                    src={fileUrl}
                    alt={fileName}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      background: '#fff'
                    }}
                  />
                ) : (
                  <div style={{
                    minWidth: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: '#14b8a6',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '4px'
                  }}>
                    .{fileExtension || 'FILE'}
                  </div>
                )}

                {/* File Info */}
                <div style={{
                  flex: 1,
                  minWidth: 0
                }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#222',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {fileName}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    {formatFileSize(fileSize)}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(file)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#610BEE',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#4c0bc5';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#610BEE';
                  }}
                >
                  <FaDownload style={{ fontSize: '14px' }} />
                  Download
                </button>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#5a6268';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#6c757d';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
}

export default SupportingFilesPopup;
