"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BASE_URL, DESIGN_GLB_PREFIX_URL, MARATHON_ASSET_PREFIX_URL, CAD_CONVERTER_EVENT, ASSET_PREFIX_URL, IMAGEURLS } from '@/config';
import Image from 'next/image';
import styles from './FileHistory.module.css';
import EastIcon from '@mui/icons-material/East';
import { textLettersLimit } from '@/common.helper';
import Pagenation from '../CommonJsx/Pagenation';
import Loading from '../CommonJsx/Loaders/Loading';
import { sendGAtagEvent } from "@/common.helper";
import ConvertedFileUploadPopup from '../CommonJsx/ConvertedFileUploadPopup';
import { contextState } from '../CommonJsx/ContextProvider';
import DesignStats from '../CommonJsx/DesignStats';
import HoverImageSequence from '../CommonJsx/RotatedImages';
import Link from 'next/link';
import { SiConvertio } from "react-icons/si";

import libraryStyles from '../Library/Library.module.css'
import TellUsAboutYourself from '../UserCadFileCreation/TellUsAboutYourself';
import EmailOTP from '../CommonJsx/EmailOTP';
import PublishCadPopUp from '../CommonJsx/PublishCadPopUp';
import { useRouter } from "next/navigation";
import ProfilePage from './ProfilePage'
import { IoAddSharp } from "react-icons/io5";
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import FileStatus from '../CommonJsx/FileStatus';
let cachedCadHistory = {};
function FileHistoryCards({ cad_type, currentPage, setCurrentPage, totalPages, setTotalPages }) {
  const { setUploadedFile } = useContext(contextState);
  const [cadViewerFileHistory, setCadViewerFileHistory] = useState([]);
  const [downloading, setDownloading] = useState({});
  const [cadConverterFileHistory, setConverterFileHistory] = useState([]);
  const [userCadFiles, setUserCadFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishCad, setPublishCad] = useState(false);
  const [isEmailVerify, setIsEmailVerify] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [publishCadPopUp, setPublishCadPopUp] = useState(null);
  const [editDetails, serEditDetails] = useState(null);
  const { user } = useContext(contextState);
  const limit = 10;
  const router = useRouter();
  useEffect(() => {
    if (cad_type === 'USER_PROFILE') {
      return
    }
    let isMounted = true;  // Add mounted check

    const fetchFileHistory = async () => {
      if (!isMounted) return;  // Don't update state if component unmounted

      try {
        // Check cache first


        // Fetch from API
        const response = await axios.get(`${BASE_URL}/v1/cad/get-file-history`, {
          params: { type: cad_type, page: currentPage, limit },
          headers: {
            "user-uuid": localStorage.getItem("uuid"),
          },
        });

        if (!isMounted) return;  // Don't update state if component unmounted

        if (response.data.meta.success) {
          const cad_viewer_files = response.data.data.cad_viewer_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt),
          }));

          const cad_converter_files = response.data.data.cad_converter_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt),
          }));

          const my_cad_files = response.data.data.my_cad_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt),
          }));

          const page = response.data.data.pagination.page;
          const totalPages = response.data.data.pagination.cadFilesPages;

          // Update all states at once
          setCadViewerFileHistory(cad_viewer_files);
          setConverterFileHistory(cad_converter_files);
          setUserCadFiles(my_cad_files);
          setCurrentPage(page);
          setTotalPages(totalPages);

          // Cache for reuse
          cachedCadHistory[cad_type] = {
            cad_viewer_files,
            cad_converter_files,
            my_cad_files,
            page,
            totalPages
          };
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching file history:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFileHistory();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [cad_type, currentPage]);



  // Helper function to format date (e.g., "April 30, 2025")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownload = async (file, index) => {
    try {
      if (!localStorage.getItem("is_verified")) {
        setPendingAction({ action: 'download', file, index });
        setIsEmailVerify(true);
        return;
      }
      if (!user.email) {
        router.push('/dashboard?cad_type=USER_PROFILE');
        return;
      }


      setDownloading(prev => ({ ...prev, [index]: true }));

      const url = `${DESIGN_GLB_PREFIX_URL}${file._id}/${file.base_name}.${file.output_format}`;

      if (!file.sample_file || file.is_published) {
        setUploadedFile({
          url: `${file?.file_name?.slice(0, file.file_name.lastIndexOf(".")) || 'design'}_converted.${file.output_format}`,
          output_format: file.input_format,
          file_name: file.file_name,
          base_name: file.base_name,
          _id: file._id,
          cad_type: 'CAD_CONVERTER',
        });

        // Wait a bit to ensure context is updated
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      (file.sample_file || file.is_published) ? setPublishCad(false) : setPublishCad(true);
      const response = await fetch(url);

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
      sendGAtagEvent({ event_name: 'converter_file_upload_download', event_category: CAD_CONVERTER_EVENT })
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      setDownloading(prev => ({ ...prev, [index]: false }));
    } catch (error) {
      setDownloading(prev => ({ ...prev, [index]: false }));
      console.error('Download failed:', error);
    }
  };

  const handleViewDesign = (file) => {
    if (!localStorage.getItem("is_verified")) {
      setPendingAction({ action: 'view', file });
      setIsEmailVerify(true);
      return;
    }

    if (cad_type === 'USER_CADS') {
      router.push(`/library/${file.route}`);
    }
    if (cad_type === 'CAD_VIEWER') {
      router.push(`/tools/cad-renderer?fileId=${file._id}`);
    }

  }

  const handlePostVerificationAction = () => {
    if (pendingAction) {
      if (pendingAction.action === 'download') {
        handleDownload(pendingAction.file, pendingAction.index);
      } else if (pendingAction.action === 'view') {
        handleViewDesign(pendingAction.file);
      }
      setPendingAction(null);
    }
    setIsEmailVerify(false);
  };

  return (
    <>
      <div className={styles.cadViewerContainer} style={{ width: '100%' }}>

        {cad_type === 'CAD_VIEWER' && (
          <div className={styles.cadViewerContainerContent}>

            {loading ? <Loading /> : <>
              {cadViewerFileHistory.length > 0 ? (
                <>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '24px',
                      padding: '8px 16px',
                      border: '1px solid #e9ecef',
                      minWidth: '280px',
                      gap: '8px'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                      </svg>
                      <input
                        type="text"
                        placeholder="Search project"
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
                    {/* <button className={styles.cadUploadingButton}  */}
                      {/* > */}
                      <Link href='/tools/cad-viewer' 
                      // style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                      style={{
                        borderRadius: '24px',
                        border: '2px solid #610BEE',
                        background: 'white',
                        color: '#610BEE',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}

                      onMouseEnter={(e) => {
                        e.target.style.background = '#610BEE';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = '#610BEE';
                      }}><IoAddSharp /> New file</Link>
                      {/* </button> */}
                  </div>

                  <div className={styles.historyContainer}>

                    {cadViewerFileHistory.map((file, index) => (
                      <a
                        key={index}

                        href={file.status === 'COMPLETED' ? `/tools/cad-renderer?fileId=${file._id}` : undefined}
                        className={styles.historyItem}
                        style={{ width: '310px', position: 'relative' }}
                        onClick={e => {
                          if (file.status !== 'COMPLETED') {
                            e.preventDefault();
                            return;
                          }
                          // localStorage.setItem("last_viewed_cad_key", file._id);
                        }}
                      >

                        <div style={{ position: 'absolute', top: '10px' }}>
                          <FileStatus status={file.status} />
                        </div>
                        {file.status === 'COMPLETED' ? <HoverImageSequence design={{ _id: file._id, page_title: file.file_name }} width={300} height={160} /> : <div style={{ width: '100%', height: '160px', background: '#e6e4f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                        {/* <div style={{ width: '100%', height: '2px', background: '#e6e4f0', marginBottom: '5px' }}></div> */}

                        <div className={styles.historyFileDetails}>
                          <span style={{ fontSize: '16px', fontWeight: '500' }}>{textLettersLimit(file.file_name, 20)}</span></div>
                        <div style={{ width: '75px', fontSize: '12px' }}>
                          <DesignDetailsStats fileType={file.file_type ? `.${file.file_type.toLowerCase()}` : '.STEP'} text={file.file_type ? `.${file.file_type.toUpperCase()}` : '.STEP'} />
                        </div>

                        {/* <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey}>Status</span> <span style={{ color: 'green' }}>{file.status}</span></div> */}
                        <div className={styles.historyFileDetails}> <span style={{ color: 'rgba(0, 19, 37, 0.50)', fontSize: '12px', fontWeight: '400' }}>{file.createdAtFormatted}</span></div>

                        {/* <div className={styles.historyFileDetailsbtn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <button onClick={() => handleViewDesign(file)} disabled={file.status !== 'COMPLETED'} style={{
                            background: file.status !== 'COMPLETED' ? '#a270f2' : '#610bee',
                            color: 'white',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}>View design</button>
                        </div> */}
                      </a>
                    ))}
                  </div>
                </>

              ) : (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  alignItems: 'center', flexDirection: 'column',
                  width: '300px', textAlign: 'center', gap: '40px'

                }}>
                  <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135} />
                  <span>You don’t have any projects yet.<br />
                    <Link href='/tools/cad-viewer' style={{ color: 'blue' }}>Upload</Link> your project files
                  </span>
                  {/* <Link href='/publish-cad' style={{ color: 'blue' }}>Click here</Link> */}
                </div>

              )}
            </>}
          </div>
        )}
        {cad_type === 'CAD_CONVERTER' && (
          <div className={styles.cadViewerContainerContent}>

            {loading ? <Loading /> : <>
              {cadConverterFileHistory.length > 0 ? (
                <div className={styles.historyContainer}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <Link
                    href='/tools/3d-file-converter' 
                      className={styles.cadUploadingButton}
                      style={{
                        borderRadius: '24px',
                        border: '2px solid #610BEE',
                        background: 'white',
                        color: '#610BEE',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      // onClick={() => setPublishCadPopUp(true)}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#610BEE';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = '#610BEE';
                      }}
                    >
                      <SiConvertio style={{ fontSize: '16px' }} />
                      Convert file
                    </Link>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>File Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Conversion</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Created</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#495057' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cadConverterFileHistory.map((file, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #dee2e6', '&:hover': { backgroundColor: '#f8f9fa' } }}>
                          <td style={{ padding: '12px', color: '#495057' }}>
                            {textLettersLimit(file.file_name, 20)}
                          </td>
                          <td style={{ padding: '12px', color: '#495057' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{file.input_format}</span>
                              <EastIcon style={{ height: '20px', color: '#6c757d' }} />
                              <span>{file.output_format}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <FileStatus status={file.status} />
                          </td>
                          <td style={{ padding: '12px', color: '#495057' }}>
                            {file.createdAtFormatted}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            {file.status === 'COMPLETED' ? (
                              <button
                                style={{
                                  background: '#610bee',
                                  color: 'white',
                                  padding: '8px 16px',
                                  border: 'none',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '500'
                                }}
                                onClick={() => handleDownload(file, index)}
                                disabled={downloading[index]}
                              >
                                {downloading[index] ? 'Downloading...' : 'Download'}
                              </button>
                            ) : (
                              <button
                                disabled
                                style={{
                                  background: '#a270f2',
                                  color: 'white',
                                  padding: '8px 16px',
                                  border: 'none',
                                  borderRadius: '5px',
                                  cursor: 'not-allowed',
                                  fontSize: '14px',
                                  fontWeight: '500'
                                }}
                              >
                                Download
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              ) : (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  alignItems: 'center', flexDirection: 'column',
                  width: '300px', textAlign: 'center', gap: '40px'

                }}>
                  <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135} />
                  <span>You don’t have any projects yet.<br />
                    <Link href='/tools/3d-file-converter' style={{ color: 'blue' }}>Upload</Link> your project files
                  </span>
                  {/* <Link href='/publish-cad' style={{ color: 'blue' }}>Click here</Link> */}
                </div>

              )}
            </>
            }
          </div>

        )}
        {cad_type === 'USER_CADS' && (
          <div className={styles.cadViewerContainerContent}>
            {loading ? <Loading /> : <>
              {userCadFiles.length > 0 ? (
                <div className={styles.historyContainer}>
                  {/* Search and Filter Header */}
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    gap: '16px'
                  }}>
                    {/* Left side - Search */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '24px',
                      padding: '8px 16px',
                      border: '1px solid #e9ecef',
                      minWidth: '280px',
                      gap: '8px'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                      </svg>
                      <input
                        type="text"
                        placeholder="Search project"
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

                    {/* Center - Filter Tabs */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'center'
                    }}>
                      {['All', 'Mechanical', 'Automotive', 'Industrial', 'Product'].map((filter, index) => (
                        <button
                          key={filter}
                          style={{
                            padding: '8px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            backgroundColor: index === 0 ? '#610BEE' : 'transparent',
                            color: index === 0 ? 'white' : '#6c757d',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (index !== 0) {
                              e.target.style.backgroundColor = '#f8f9fa';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (index !== 0) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    {/* Right side - New Project Button */}
                    <button
                      style={{
                        borderRadius: '24px',
                        border: '2px solid #610BEE',
                        background: 'white',
                        color: '#610BEE',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={() => setPublishCadPopUp(true)}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#610BEE';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = '#610BEE';
                      }}
                    >
                      <IoAddSharp style={{ fontSize: '16px' }} />
                      New Project
                    </button>
                  </div>

                  {/* Projects Grid */}
                  {userCadFiles.map((file, index) => (
                    <Link key={index} href={`/library/${file.route}`} className={libraryStyles["library-designs-items-container"]}
                      onClick={e => !file.is_uploaded && e.preventDefault()}
                    >
                      {/* <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                <FileStatus status={file.is_uploaded ? 'completed' : 'pending'} />
              </div>
              <button style={{ position: 'absolute', right: '10px', top: '10px' }}
                onClick={() => { setPublishCadPopUp(true), serEditDetails(file) }}><Image
                  src={`${ASSET_PREFIX_URL}edit-ticket.png`}
                  alt="edit"
                  width={16}
                  height={16}
                /></button> */}
                      {/* <div className={styles["library-designs-inner"]}> */}
                      <div className={libraryStyles["library-designs-items-container-cost"]}>Free</div>
                      {/* <div className={styles["library-designs-items-container-img"]}>
                            <Image
                          // className={styles["library-designs-items-container-img"]}
                          src={`${DESIGN_GLB_PREFIX_URL}${design._id}/sprite_0_0.webp`}
                          alt={design.page_title}
                          width={300}
                          height={250}
                        />
                        </div> */}
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                          <FileStatus status={!file.is_uploaded?'Pending':'Completed'} />
                        </div>
                      {file.is_uploaded ?
                        <HoverImageSequence design={file} width={300} height={250} />
                        : <div style={{ width: '100%', height: '250px', background: '#e6e4f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                      <div className={libraryStyles["design-stats-wrapper"]}>
                        <DesignStats views={file.total_design_views ?? 0}
                          downloads={file.total_design_downloads ?? 0} />
                      </div>
                      <div className={libraryStyles["design-title-wrapper"]}>
                        <h6 title={file.page_title}>{textLettersLimit(file.page_title, 30)}</h6>
                        <p title={file.page_description}>{textLettersLimit(file.page_description, 120)}</p>
                        <div className={libraryStyles["design-title-text"]} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* {design.industry_name &&<DesignDetailsStats  text={design.industry_name} />} */}
                          {file.category_labels && file.category_labels.map((label, index) => (
                            <DesignDetailsStats key={index} text={label} />
                          ))}
                          {file.tag_labels && file.tag_labels.map((label, index) => (
                            <DesignDetailsStats key={index} text={label} />
                          ))}
                          <DesignDetailsStats fileType={file.file_type ? `.${file.file_type.toLowerCase()}` : '.STEP'} text={file.file_type ? `.${file.file_type.toUpperCase()}` : '.STEP'} />
                        </div>
                        <span className={libraryStyles["design-title-wrapper-price"]}>Free</span>

                      </div>


                      {/* </div> */}
                    </Link>

                    // {file.is_uploaded === true && <DesignStats views={file.total_design_views} downloads={file.total_design_downloads} />}
                    // </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  display: 'flex', justifyContent: 'center',
                  alignItems: 'center', flexDirection: 'column',
                  width: '300px', textAlign: 'center', gap: '40px'

                }}>
                  <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135} />
                  <span>You don't have any projects yet.<br />
                    <button onClick={() => setPublishCadPopUp(true)} style={{ color: 'blue' }}>Upload</button> your project files
                  </span>
                </div>

              )}
            </>}
          </div>
        )}
        {cad_type === 'USER_PROFILE' && (
          <ProfilePage type='profile' />
        )}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {totalPages > 1 && <Pagenation currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}
        </div>





      </div>
      {publishCad && <ConvertedFileUploadPopup setPublishCad={setPublishCad} />}
      {isEmailVerify && <EmailOTP setIsEmailVerify={setIsEmailVerify} email={user.email} saveDetails={handlePostVerificationAction} />}
      {publishCadPopUp && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <PublishCadPopUp onClose={() => setPublishCadPopUp(false)} editedDetails={editDetails} />
      </div>}
    </>

  )
}

export default FileHistoryCards
