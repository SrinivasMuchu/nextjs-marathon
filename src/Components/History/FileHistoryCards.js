"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, DESIGN_GLB_PREFIX_URL, MARATHON_ASSET_PREFIX_URL } from '@/config';
import Image from 'next/image';
import styles from './FileHistory.module.css';
import EastIcon from '@mui/icons-material/East';
import { textLettersLimit } from '@/common.helper';
import Pagenation from '../CommonJsx/Pagenation';
import Loading from '../CommonJsx/Loaders/Loading';

function FileHistoryCards({ cad_type, currentPage, setCurrentPage, totalPages, setTotalPages }) {

  const [cadViewerFileHistory, setCadViewerFileHistory] = useState([]);
  const [cadConverterFileHistory, setConverterFileHistory] = useState([]);
  const [userCadFiles, setUserCadFiles] = useState([]);
  const [loading,setLoading] = useState(true);
  const limit = 10;
  console.log(cadConverterFileHistory, 'cadConverterFileHistory')
  useEffect(() => {


    const fetchFileHistory = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/v1/cad/get-file-history`, {
          params: { type: cad_type, page: currentPage, limit },
          headers: {
            "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security
          }
        }
        );

        if (response.data.meta.success) {
          const processedFiles = {
            cad_viewer_files: response.data.data.cad_viewer_files.map(file => ({
              ...file,
              createdAtFormatted: formatDate(file.createdAt)
            })),
            cad_converter_files: response.data.data.cad_converter_files.map(file => ({
              ...file,
              createdAtFormatted: formatDate(file.createdAt)
            }))
          };

          setCadViewerFileHistory(processedFiles.cad_viewer_files);
          setConverterFileHistory(processedFiles.cad_converter_files);
          setUserCadFiles(response.data.data.my_cad_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt)
          })));
          setCurrentPage(response.data.data.pagination.page);
          setTotalPages(response.data.data.pagination.cadFilesPages);
        }
        setLoading(false);
      } catch (err) {

        console.error('Error fetching file history:', err);
        setLoading(false);
      }
    };

    fetchFileHistory();
  }, [cad_type, currentPage]);



  // Helper function to format date (e.g., "April 30, 2025")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownload = async (file) => {
    try {
      const url = `${DESIGN_GLB_PREFIX_URL}${file._id}/${file.base_name}.${file.output_format}`;
      const response = await fetch(url);
      console.log(file, "file")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = downloadUrl;
      a.download = `${file?.file_name?.slice(0, file.file_name.lastIndexOf(".")) || 'design'}_converted.${file.output_format}`;

      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      // Optional: Add user feedback here (e.g., toast notification)
    }
  };


  return (
    <div className={styles.cadViewerContainer} style={{width: '100%'}}>
      {loading ? <Loading/> : <>
       {cad_type === 'CAD_VIEWER' && (
        <div className={styles.cadViewerContainerContent}>
          <h2>Rendered CAD Models</h2>
          <div className="max-w-xxl mx-auto mt-1 px-4 py-3 bg-yellow-100 text-yellow-800 text-sm rounded-md border border-yellow-300">
            ⚠️ Please refresh the page to see the latest status. Real-time updates are not yet enabled.
          </div>
          {cadViewerFileHistory.length > 0 ? (
            <>

              <div className={styles.historyContainer}>
                <div className={styles.historyItem} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', border: '2px dashed #e6e4f0', }}>
                  <span>Want to add more files</span>
                  <a href='/tools/cad-viewer' style={{ color: 'blue' }}>Click here</a>
                </div>
                {cadViewerFileHistory.map((file, index) => (
                  <a
                    key={index}
                    href="/tools/cad-renderer"
                    className={styles.historyItem}
                    onClick={() => {
                      localStorage.setItem("last_viewed_cad_key", file._id);
                    }}
                  >
                    <Image
                      src={`https://d1d8a3050v4fu6.cloudfront.net/${file._id}/sprite_90_180.webp`}
                      alt="file preview"
                      width={300}
                      height={250}
                    />
                    <div style={{ width: '100%', height: '2px', background: '#e6e4f0', marginBottom: '5px' }}></div>

                    <div className={styles.historyFileDetails}>
                      <span className={styles.historyFileDetailsKey}>File Name</span> <span >{textLettersLimit(file.file_name, 20)}</span></div>
                    <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey}>Status</span> <span style={{ color: 'green' }}>{file.status}</span></div>
                    <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey}>Created</span> <span>{file.createdAtFormatted}</span></div>

                    <div className={styles.historyFileDetailsbtn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <button style={{
                        background: '#610bee',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}>View design</button>
                    </div>
                  </a>
                ))}
              </div>
            </>

          ) : (
              <div className={styles.historyItem} style={{ display: 'flex', justifyContent: 'center', 
                alignItems: 'center', flexDirection: 'column', 
              border: '2px dashed #e6e4f0',height:'350px' }}>
                  <span>Want to add more files</span>
                  <a href='/tools/cad-viewer' style={{ color: 'blue' }}>Click here</a>
                </div>
          )}
        </div>
      )}
      {cad_type === 'CAD_CONVERTER' && (
        <div className={styles.cadViewerContainerContent}>
          <h2> Converted CAD files</h2>
          <div className="max-w-xxl mx-auto mt-1 px-4 py-3 bg-yellow-100 text-yellow-800 text-sm rounded-md border border-yellow-300">
            ⚠️ Please refresh the page to see the latest status. Real-time updates are not yet enabled.
          </div>
          {cadConverterFileHistory.length > 0 ? (
            <div className={styles.historyContainer}>
              <div className={styles.historyItem} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', border: '2px dashed #e6e4f0', }}>
                <span>Want to add more files</span>
                <a href='/tools/3d-file-converter' style={{ color: 'blue' }}>Click here</a>
              </div>
              {cadConverterFileHistory.map((file, index) => (
                <div
                  key={index}
                  href={`https://d1d8a3050v4fu6.cloudfront.net/${file._id}/${file.base_name}.${file.output_format}`}
                  className={styles.historyItem}
                  onClick={() => {
                    localStorage.setItem("last_viewed_cad_key", file._id);
                  }}
                >
                  <div className={styles.historyFileDetails}>
                    <span className={styles.historyFileDetailsKey} style={{ width: '100px' }}>File Name</span> <span>{textLettersLimit(file.file_name, 20)}</span></div>
                  <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey} style={{ width: '100px' }}>Conversion</span> <span>{file.input_format}</span> &nbsp;<EastIcon style={{ height: '25px' }} />&nbsp; <span>{file.output_format}</span></div>
                  <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey} style={{ width: '100px' }}>Status</span> <span style={{ color: 'green' }}>{file.status}</span></div>
                  <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey} style={{ width: '100px' }}>Created</span> <span>{file.createdAtFormatted}</span></div>
                  <div className={styles.historyFileDetailsbtn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{
                      background: '#610bee',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }} onClick={() => handleDownload(file)}>Download</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.historyItem} style={{ display: 'flex', justifyContent: 'center', 
                alignItems: 'center', flexDirection: 'column', 
              border: '2px dashed #e6e4f0',height:'250px' }}>
                  <span>Want to add more files</span>
                  <a href='/tools/3d-file-converter' style={{ color: 'blue' }}>Click here</a>
                </div>
          )}
        </div>

      )}
      {cad_type === 'user_cad_files' && (
        <div className={styles.cadViewerContainerContent}>
          <h2>Published CAD Files</h2>
          <div className="max-w-xxl mx-auto mt-1 px-4 py-3 bg-yellow-100 text-yellow-800 text-sm rounded-md border border-yellow-300">
            ⚠️ Please refresh the page to see the latest status. Real-time updates are not yet enabled.
          </div>
          {userCadFiles.length > 0 ? (
            <div className={styles.historyContainer}>
              <div className={styles.historyItem} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', border: '2px dashed #e6e4f0', }}>
                <span>Want to add more files</span>
                <a href='/publish-cad' style={{ color: 'blue' }}>Click here</a>
              </div>
              {userCadFiles.map((file, index) => (
                <a
                  key={index}
                  href={`/library/${file.route}/${file._id}`}
                  className={styles.historyItem}

                >
                 {file.is_uploaded ? <Image
                    src={`https://d1d8a3050v4fu6.cloudfront.net/${file._id}/sprite_90_180.webp`}
                    alt="file preview"
                    width={300}
                    height={160}
                  />:<div style={{ width: '100%', height: '160px', background: '#e6e4f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}/>} 
                  <div style={{ width: '100%', height: '2px', background: '#e6e4f0', marginBottom: '5px' }}></div>

                  <div className={styles.historyFileDetails}>
                    <span className={styles.historyFileDetailsKey}>File Name</span> <span >{textLettersLimit(file.page_title, 20)}</span></div>
                  <div className={styles.historyFileDetails}>
                    <span className={styles.historyFileDetailsKey}>Status</span>
                    <span style={{ color: file.is_uploaded === true ? 'green' : file.is_uploaded === false ? 'red' : 'blue' }}>
                      {file.is_uploaded === true
                        ? 'COMPLETED'
                        : file.is_uploaded === false
                          ? 'FAILED'
                          : 'PENDING'}
                    </span>
                  </div>
                  <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey}>Created</span> <span>{file.createdAtFormatted}</span></div>

                  <div className={styles.historyFileDetailsbtn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {file.is_uploaded  ? <a href={`/library/${file.route}`} style={{
                      background: '#610bee',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center'
                    }} >
                      <button style={{

                        cursor: 'pointer'
                      }}>View design</button>
                    </a>: <button disabled style={{
                      background: '#a270f2',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center'
                    }}>View design</button>}  
                  </div>
                </a>
              ))}
            </div>
          ) : (
              <div className={styles.historyItem} style={{ display: 'flex', justifyContent: 'center', 
                alignItems: 'center', flexDirection: 'column', 
              border: '2px dashed #e6e4f0',height:'350px' }}>
                  <span>Want to add more files</span>
                  <a href='/publish-cad' style={{ color: 'blue' }}>Click here</a>
                </div>
           
          )}
        </div>
      )}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {totalPages > 1 && <Pagenation currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}
      </div>
      
      </>}

     

    </div>
  )
}

export default FileHistoryCards
