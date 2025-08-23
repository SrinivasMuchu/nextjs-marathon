import React from 'react'
import PopupWrapper from './PopupWrapper'
import styles from './CommonStyles.module.css';
import UploadYourCadDesign from '../UserCadFileCreation/UploadYourCadDesign';

function PublishCadPopUp({onClose,editedDetails}) {
  return (
    <PopupWrapper>
        <div className={styles.publishPopUp}>
            
                
                <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
            <UploadYourCadDesign editedDetails={editedDetails}/>
        </div>
    </PopupWrapper>
  )
}

export default PublishCadPopUp