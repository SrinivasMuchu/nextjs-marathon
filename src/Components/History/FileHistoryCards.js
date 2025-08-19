"use client";
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { BASE_URL, DESIGN_GLB_PREFIX_URL, MARATHON_ASSET_PREFIX_URL, CAD_CONVERTER_EVENT, allowedFilesList, IMAGEURLS } from '@/config';
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
import TellUsAboutYourself from '../UserCadFileCreation/TellUsAboutYourself';
import EmailOTP from '../CommonJsx/EmailOTP';
import PublishCadPopUp from '../CommonJsx/PublishCadPopUp';
import { useRouter } from "next/navigation";
import ProfilePage from './ProfilePage'
import { IoAddSharp } from "react-icons/io5";
let cachedCadHistory = {};
function FileHistoryCards({ cad_type, currentPage, setCurrentPage, totalPages, setTotalPages }) {
  const {  setUploadedFile } = useContext(contextState);
  const [cadViewerFileHistory, setCadViewerFileHistory] = useState([]);
  const [downloading, setDownloading] = useState({});
  const [cadConverterFileHistory, setConverterFileHistory] = useState([]);
  const [userCadFiles, setUserCadFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishCad, setPublishCad] = useState(false);
  const [isEmailVerify, setIsEmailVerify] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [publishCadPopUp, setPublishCadPopUp] = useState(null);
   const { user } = useContext(contextState);
  const limit = 10;
  const router = useRouter();
  useEffect(() => {
    if(cad_type === 'USER_PROFILE') {
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
      if(!localStorage.getItem("is_verified")){
          setPendingAction({ action: 'download', file, index });
          setIsEmailVerify(true);
          return;
      }
      if(!user.email){
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

      (file.sample_file || file.is_published)? setPublishCad(false) : setPublishCad(true);
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

  const handleViewDesign = (file)=>{
    if(!localStorage.getItem("is_verified")){
          setPendingAction({ action: 'view', file });
          setIsEmailVerify(true);
          return;
      }
       
      if(cad_type === 'USER_CADS'){
      router.push(`/library/${file.route}`);
      }
      if(cad_type === 'CAD_VIEWER'){
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
              <div style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
            <button className={styles.cadUploadingButton} style={{borderRadius: '100px',
border: '1.5px solid  #610BEE',display:'flex',alignItems:'center',gap:'10px'}}>
  <Link href='/tools/cad-viewer' style={{display:'flex',alignItems:'center',gap:'10px'}}><IoAddSharp/> New file</Link></button>
          </div>

                <div className={styles.historyContainer}>
                  
                  {cadViewerFileHistory.map((file, index) => (
                    <a
                      key={index}
                      // href={file.status === 'COMPLETED' ? `/tools/cad-renderer?fileId=${file._id}` : undefined}
                      className={styles.historyItem}
                      onClick={e => {
                        if (file.status !== 'COMPLETED') {
                          e.preventDefault();
                          return;
                        }
                        // localStorage.setItem("last_viewed_cad_key", file._id);
                      }}
                    >
                      {file.status === 'COMPLETED' ? <HoverImageSequence design={{ _id:file._id,page_title:file.file_name}} width={300} height={160} /> : <div style={{ width: '100%', height: '160px', background: '#e6e4f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                      <div style={{ width: '100%', height: '2px', background: '#e6e4f0', marginBottom: '5px' }}></div>

                      <div className={styles.historyFileDetails}>
                        <span className={styles.historyFileDetailsKey}>File Name</span> <span >{textLettersLimit(file.file_name, 20)}</span></div>
                      <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey}>Status</span> <span style={{ color: 'green' }}>{file.status}</span></div>
                      <div className={styles.historyFileDetails}><span className={styles.historyFileDetailsKey}>Created</span> <span>{file.createdAtFormatted}</span></div>

                      <div className={styles.historyFileDetailsbtn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button onClick={() => handleViewDesign(file)} disabled={file.status !== 'COMPLETED'} style={{
                          background: file.status !== 'COMPLETED' ? '#a270f2' : '#610bee',
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
              <div  style={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center', flexDirection: 'column',
                width:'300px',textAlign:'center',gap:'40px'
                
              }}>
                <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135}/>
                <span>You don’t have any projects yet.<br/>
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
                 <div style={{width:'100%',display:'flex',justifyContent:'flex-end', marginBottom: '20px'}}>
            <button className={styles.cadUploadingButton} style={{borderRadius: '100px',
border: '1.5px solid  #610BEE',display:'flex',alignItems:'center',gap:'10px'}}><Link href='/tools/3d-file-converter'>Convert file</Link></button>
          </div>
          
          <table style={{width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
            <thead>
              <tr style={{backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6'}}>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057'}}>File Name</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057'}}>Conversion</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057'}}>Status</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600', color: '#495057'}}>Created</th>
                <th style={{padding: '12px', textAlign: 'center', fontWeight: '600', color: '#495057'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cadConverterFileHistory.map((file, index) => (
                <tr key={index} style={{borderBottom: '1px solid #dee2e6', '&:hover': {backgroundColor: '#f8f9fa'}}}>
                  <td style={{padding: '12px', color: '#495057'}}>
                    {textLettersLimit(file.file_name, 20)}
                  </td>
                  <td style={{padding: '12px', color: '#495057'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span>{file.input_format}</span>
                      <EastIcon style={{ height: '20px', color: '#6c757d' }} />
                      <span>{file.output_format}</span>
                    </div>
                  </td>
                  <td style={{padding: '12px'}}>
                    <span style={{ 
                      color: file.status === 'COMPLETED' ? '#28a745' : file.status === 'PROCESSING' ? '#ffc107' : '#dc3545',
                      fontWeight: '500'
                    }}>
                      {file.status}
                    </span>
                  </td>
                  <td style={{padding: '12px', color: '#495057'}}>
                    {file.createdAtFormatted}
                  </td>
                  <td style={{padding: '12px', textAlign: 'center'}}>
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
               <div  style={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center', flexDirection: 'column',
                width:'300px',textAlign:'center',gap:'40px'
                
              }}>
                <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135}/>
                <span>You don’t have any projects yet.<br/>
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
                 <div style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
            <button className={styles.cadUploadingButton} style={{borderRadius: '100px',
border: '1.5px solid  #610BEE',display:'flex',alignItems:'center',gap:'10px'}} onClick={() => setPublishCadPopUp(true)}><IoAddSharp/> New Project</button>
          </div>
                {userCadFiles.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => handleViewDesign(file)}
                    className={styles.historyItem}

                  >
                    {file.is_uploaded ? <HoverImageSequence design={file} width={300} height={160} /> : <div style={{ width: '100%', height: '160px', background: '#e6e4f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}
                    <div style={{ width: '100%', height: '2px', background: '#e6e4f0', marginBottom: '5px' }}></div>

                    <div className={styles.historyFileDetails}>
                      <span className={styles.historyFileDetailsKey}>Title</span> <span >{textLettersLimit(file.page_title, 20)}</span></div>
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
                      {file.is_uploaded ?
                       <div onClick={() => handleViewDesign(file)} style={{
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
                      </div> : <button disabled style={{
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
                    {file.is_uploaded === true && <DesignStats views={file.total_design_views} downloads={file.total_design_downloads} />}
                  </div>
                ))}
              </div>
            ) : (
              <div  style={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center', flexDirection: 'column',
                width:'300px',textAlign:'center',gap:'40px'
                
              }}>
                <Image src={IMAGEURLS.nofilesLogo} alt="No files" width={135} height={135}/>
                <span>You don’t have any projects yet.<br/>
                    <button onClick={() => setPublishCadPopUp(true)} style={{ color: 'blue' }}>Upload</button> your project files
                </span>
                {/* <Link href='/publish-cad' style={{ color: 'blue' }}>Click here</Link> */}
              </div>

            )}
          </>}
        </div>
      )}
      {cad_type === 'USER_PROFILE' && (
        <ProfilePage type = 'profile'/>
      )}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {totalPages > 1 && <Pagenation currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}
      </div>





    </div>
      {publishCad && <ConvertedFileUploadPopup setPublishCad={setPublishCad} />}
      {isEmailVerify && <EmailOTP setIsEmailVerify={setIsEmailVerify} email={user.email} saveDetails={handlePostVerificationAction} />}
      {publishCadPopUp && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <PublishCadPopUp onClose={() => setPublishCadPopUp(false)} />
      </div>}
    </>
    
  )
}

export default FileHistoryCards
