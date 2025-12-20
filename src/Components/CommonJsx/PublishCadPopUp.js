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

  // LIFTED STATE: Hold the form data here
  const [cadFormState, setCadFormState] = useState({
    // Set initial values as needed
    title: editedDetails ? editedDetails.page_title : '',
    description: editedDetails ? editedDetails.page_description : '',
    tags: '',
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