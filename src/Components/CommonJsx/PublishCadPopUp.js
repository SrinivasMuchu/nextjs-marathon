import React from 'react'
import PopupWrapper from './PopupWrapper'
import styles from './CommonStyles.module.css';
import UploadYourCadDesign from '../UserCadFileCreation/UploadYourCadDesign';

function PublishCadPopUp({onClose,editedDetails,type}) {
  return (
    <PopupWrapper>
        <div className={styles.publishPopUp}>
            
                
                <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
            <UploadYourCadDesign editedDetails={editedDetails} onClose={onClose} type={type}/>
        </div>
    </PopupWrapper>
  )
}

export default PublishCadPopUp