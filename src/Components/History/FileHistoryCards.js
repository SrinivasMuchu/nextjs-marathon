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

import libraryStyles from '../Library/Library.module.css'
import TellUsAboutYourself from '../UserCadFileCreation/TellUsAboutYourself';
import EmailOTP from '../CommonJsx/EmailOTP';
import PublishCadPopUp from '../CommonJsx/PublishCadPopUp';
import { useRouter } from "next/navigation";
import ProfilePage from './ProfilePage'
import CadViewerFiles from './CadViewerFiles';
import CadConvertorFiles from './CadConvertorFiles';
import CadPublishedFiles from './CadPublishedFiles';

let cachedCadHistory = {};

function FileHistoryCards({ cad_type, currentPage, setCurrentPage, totalPages, setTotalPages }) {
  const { setUploadedFile } = useContext(contextState);
  const [cadViewerFileHistory, setCadViewerFileHistory] = useState([]);
  const [downloading, setDownloading] = useState({});
  const [cadConverterFileHistory, setConverterFileHistory] = useState([]);
  const [userCadFiles, setUserCadFiles] = useState([]);
  const [userDownloadFiles, setUserDownloadFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishCad, setPublishCad] = useState(false);
  const [isEmailVerify, setIsEmailVerify] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [publishCadPopUp, setPublishCadPopUp] = useState(null);
  const [editDetails, serEditDetails] = useState(null);
  const { user } = useContext(contextState);
  const limit = 10;
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({ id: 'All', label: 'All' }); // Initialize as object

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
    if (cad_type === 'USER_PROFILE') {
      return;
    }
    let isMounted = true;

    const fetchFileHistory = async () => {
      if (!isMounted) return;

      try {
        // Updated API call with search parameter and tag filter
        const apiParams = { 
          type: cad_type, 
          page: currentPage, 
          limit,
          search: debouncedSearchTerm
        };

        // Add tag parameter only if it's not 'All' and we're dealing with CAD files
        if (selectedFilter && selectedFilter.id !== 'All' && (cad_type === 'USER_CADS' || cad_type === 'USER_DOWNLOADS')) {
          apiParams.tags = selectedFilter.id; // Send the tag ID
        }

        console.log('API Params:', apiParams); // Debug log

        const response = await axios.get(`${BASE_URL}/v1/cad/get-file-history`, {
          params: apiParams,
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

          const my_download_files = response.data.data.user_download_files.map(file => ({
            ...file,
            createdAtFormatted: formatDate(file.createdAt),
          }));

          const page = response.data.data.pagination.page;
          const totalPages = response.data.data.pagination.cadFilesPages;

          // Update all states at once
          setCadViewerFileHistory(cad_viewer_files);
          setConverterFileHistory(cad_converter_files);
          setUserCadFiles(my_cad_files);
          setUserDownloadFiles(my_download_files);
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
  }, [cad_type, currentPage, debouncedSearchTerm, selectedFilter]); // Add selectedFilter to dependencies

  // Reset to page 1 when filter changes
  useEffect(() => {
    if (selectedFilter.id !== 'All') {
      setCurrentPage(1);
    }
  }, [selectedFilter, setCurrentPage]);

  // Helper function to format date (e.g., "April 30, 2025")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDesign = (file) => {
    if (!localStorage.getItem("is_verified")) {
      setPendingAction({ action: 'view', file });
      setIsEmailVerify(true);
      return;
    }
    
    if (cad_type === 'USER_CADS') {
      router.push(`/library/${file.route}`);
    } else {
      router.push(`/tools/cad-renderer?fileId=${file._id}`);
    }
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
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
      sendGAtagEvent({ event_name: 'converter_file_upload_download', event_category: CAD_CONVERTER_EVENT });
      router.push(`/tools/cad-renderer?fileId=${file._id}`);
      
      setDownloading(prev => ({ ...prev, [index]: false }));
    } catch (error) {
      console.error('Download error:', error);
      setDownloading(prev => ({ ...prev, [index]: false }));
    }
  };

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
          <CadViewerFiles 
            loading={loading} 
            cadViewerFileHistory={cadViewerFileHistory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
        {cad_type === 'CAD_CONVERTER' && (
          <CadConvertorFiles 
            loading={loading} 
            cadConverterFileHistory={cadConverterFileHistory} 
            downloading={downloading} 
            handleDownload={handleDownload}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
        {cad_type === 'USER_CADS' && (
          <CadPublishedFiles 
            loading={loading} 
            userCadFiles={userCadFiles}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            setPublishCadPopUp={setPublishCadPopUp}
          />
        )}
        {cad_type === 'USER_DOWNLOADS' && (
          <CadPublishedFiles 
            loading={loading} 
            userCadFiles={userDownloadFiles} 
            type='downloads'
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            setPublishCadPopUp={setPublishCadPopUp}
          />
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
  );
}

export default FileHistoryCards;
