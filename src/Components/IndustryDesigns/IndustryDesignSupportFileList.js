import React from 'react'
import styles from './IndustryDesign.module.css'
import { FaFile } from 'react-icons/fa'
import DownloadClientButton from '../CommonJsx/DownloadClientButton';

function IndustryDesignSupportFileList({ designData }) {
  const supportingFiles = Array.isArray(designData.supporting_files) ? designData.supporting_files : [];

  // Helper function to check if file is an image
  const isImageFile = (fileName) => {
    if (!fileName) return false;
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
    return imageExtensions.test(fileName);
  };

  // Helper function to get file extension
  const getFileExtension = (fileName) => {
    if (!fileName) return '';
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  };

  // Helper function to format file size
  const formatFileSize = (size) => {
    if (!size && size !== 0) return 'N/A';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Helper function to get file name (handle both name and fileName properties)
  const getFileName = (file, maxLength = 25) => {
    const fileName = file?.name || file?.fileName || 'Unknown';
    if (fileName.length > maxLength) {
      return fileName.substring(0, maxLength) + '...';
    }
    return fileName;
  };

  // Helper function to get file URL (handle both url and fileUrl properties)
  const getFileUrl = (file) => {
    return file?.url || file?.fileUrl || '';
  };

  // Helper function to get file size (handle both size and fileSize properties)
  const getFileSize = (file) => {
    return file?.size || file?.fileSize || null;
  };

  if (!supportingFiles || supportingFiles.length === 0) {
    return null;
  }

  return (
    <div className={styles['industry-design-files']}>
      <div className={styles['industry-design-files-bottom']}>
        <span className={styles['industry-design-files-count']}>
          Supporting Files {supportingFiles.length}
        </span>
        <table className={styles['industry-design-files-list']}>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Preview</th>
              <th style={{ width: '30%' }}>File Name</th>
              {/* <th style={{ width: '20%' }}>Size</th> */}
              {/* <th style={{ width: '15%' }}>Type</th> */}
               <th style={{ width: '15%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {supportingFiles.map((file, index) => {
              const fileName = getFileName(file);
              const fileUrl = getFileUrl(file);
              const fileSize = getFileSize(file);
              const isImage = isImageFile(fileName);
              const fileExtension = getFileExtension(fileName);

              return (
                <tr key={index}>
                  <td data-label="Preview">
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid #E0E0E0',
                      background: '#F5F5F5'
                    }}>
                      {isImage && fileUrl ? (
                        <img
                          src={fileUrl}
                          alt={fileName}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <FaFile
                          style={{
                            width: '24px',
                            height: '24px',
                            color: '#666'
                          }}
                        />
                      )}
                    </div>
                  </td>
                  <td data-label="File Name">
                    <div style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {fileName}
                    </div>
                  </td>
                  {/* <td data-label="Size">{formatFileSize(fileSize)}</td> */}
                  {/* <td data-label="Type">{fileExtension || 'N/A'}</td> */}
                  <td><DownloadClientButton folderId={designData._id} isDownladable={designData.is_downloadable} step={false} supportingFileUrl={file.url}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IndustryDesignSupportFileList
