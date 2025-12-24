"use client";
import React, { useState, useContext } from 'react'
import PopupWrapper from './PopupWrapper'
import styles from './CommonStyles.module.css';
import UploadYourCadDesign from '../UserCadFileCreation/UploadYourCadDesign';
import { contextState } from './ContextProvider';
import Kyc from '../KYC/Kyc';

function PublishCadPopUp({ onClose, editedDetails, type, rejected }) {
  const [showKyc, setShowKyc] = useState(false);
  const { setUser } = useContext(contextState);

  // Helper function to normalize supporting files from API format to component format
  const normalizeSupportingFiles = (files) => {
    if (!files || !Array.isArray(files)) return [];
    return files.map(file => ({
      _id: file._id || file.id || null, // Preserve ID if it exists (for existing files)
      fileName: file.fileName || file.name || file.file_name || 'Unknown',
      type: file.type || file.fileType || (file.fileName || file.name || '').split('.').pop() || 'unknown',
      size: file.size || file.fileSize || 0,
      url: file.url || file.fileUrl || ''
    }));
  };

  // Convert file size from bytes to MB if needed (if > 1000, assume it's in bytes)
  const getFileSizeInMB = (rawSize) => {
    if (!rawSize) return 0;
    return rawSize > 1000 ? rawSize / (1024 * 1024) : rawSize;
  };

  // LIFTED STATE: Hold the form data here
  const [cadFormState, setCadFormState] = useState({
    // Set initial values as needed
    title: editedDetails ? editedDetails.page_title : '',
    description: editedDetails ? editedDetails.page_description : '',
    tags: '',
    selectedOptions: [],
    selectedCategory: null,
    isChecked: editedDetails ? editedDetails.is_downloadable : true,
    fileName: editedDetails ? (editedDetails.file_name || editedDetails.fileName || '') : '',
    fileSize: editedDetails ? getFileSizeInMB(editedDetails.file_size || editedDetails.fileSize || 0) : '',
    fileFormat: editedDetails ? (editedDetails.file_type || editedDetails.fileFormat || editedDetails.fileType || '') : '',
    url: editedDetails ? (editedDetails.url || editedDetails.file_url || editedDetails.fileUrl || '') : '',
    uploadProgress: editedDetails ? 100 : 0,
    supportedFiles: editedDetails?.supporting_files ? normalizeSupportingFiles(editedDetails.supporting_files) : [],
    supportingFilesTotalSize: editedDetails?.supporting_files 
      ? normalizeSupportingFiles(editedDetails.supporting_files).reduce((acc, file) => acc + (file.size || 0), 0)
      : 0,
    // ...add other fields as needed
  });

  return (
    <PopupWrapper>
      {showKyc ? (
        <Kyc onClose={() => setShowKyc(false)} setUser={setUser} />
      ) : (
        <div className={styles.publishPopUp}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          <UploadYourCadDesign
            cadFormState={cadFormState}
            setCadFormState={setCadFormState}
            showKyc={showKyc}
            setShowKyc={setShowKyc}
            editedDetails={editedDetails}
            onClose={onClose}
            type={type}
            rejected={rejected}
          />
        </div>
      )}
    </PopupWrapper>
  );
}

export default PublishCadPopUp;