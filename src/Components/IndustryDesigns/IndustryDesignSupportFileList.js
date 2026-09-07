import React from 'react'
import styles from './IndustryDesign.module.css'
import { FaFile } from 'react-icons/fa'
import DownloadClientButton from '../CommonJsx/DownloadClientButton'

function IndustryDesignSupportFileList({ designData }) {
  const supportingFiles = Array.isArray(designData?.supporting_files)
    ? designData.supporting_files
    : [];

  const isImageFile = (file) => {
    const fileName = file?.name || file?.fileName || '';
    const mime = String(file?.type || '').toLowerCase();
    if (mime.startsWith('image/')) return true;
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
  };

  const getFileName = (file, maxLength = 40) => {
    const fileName = file?.name || file?.fileName || 'Unknown';
    if (fileName.length > maxLength) {
      return fileName.substring(0, maxLength) + '...';
    }
    return fileName;
  };

  const getFileUrl = (file) => file?.url || file?.fileUrl || '';

  return (
    <>
      <div className={styles['industry-design-files-supporting-head']}>
        Supporting Files ({supportingFiles.length})
      </div>
      <div className={styles['industry-design-files-bottom']}>
        <table className={styles['industry-design-files-list']}>
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Preview</th>
              <th style={{ width: '52%' }}>File Name</th>
              <th style={{ width: '30%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {supportingFiles.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  data-label="File Name"
                  className={styles['industry-design-files-empty-row']}
                >
                  No supporting files
                </td>
              </tr>
            ) : (
              supportingFiles.map((file, index) => {
                const fileName = getFileName(file);
                const fileUrl = getFileUrl(file);
                const isImage = isImageFile(file);

                return (
                  <tr key={`${fileName}-${index}`}>
                    <td data-label="Preview">
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid #E0E0E0',
                          background: '#F5F5F5',
                        }}
                      >
                        {isImage && fileUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={fileUrl}
                            alt={fileName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <FaFile
                            style={{
                              width: '22px',
                              height: '22px',
                              color: '#666',
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td data-label="File Name">
                      <div
                        style={{
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={file?.name || file?.fileName || ''}
                      >
                        {fileName}
                      </div>
                    </td>
                    <td>
                      <DownloadClientButton
                        folderId={designData._id}
                        isDownladable={designData.is_downloadable}
                        step={false}
                        supportingFileUrl={fileUrl}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default IndustryDesignSupportFileList
