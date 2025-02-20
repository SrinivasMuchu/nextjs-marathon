"use client";
import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import styles from './EditHierarchy.module.css';
import NameProfile from '@/Components/CommonJsx.js/NameProfile';
import CloseButton from '../Common/CloseButton';


function ViewRole({ activeNode, setAction }) {
  const [close, setClose] = useState(false);


  const handleClose = () => {
    setClose(true);
    setAction(false)
  };




  return (
    <>

      <div className={styles["editRole"]} style={{ display: close ? "none" : "block" }}>
        <div className={styles["docTop"]}> 
          
          <CloseButton handleClose={handleClose} heading='View role' styles={styles}/>
          <div className={styles["viewrole-photo-cont"]}>
          <NameProfile userName={activeNode.fullName} width='200px' memberPhoto={activeNode.photo} fontSize='100px' fontweight='500' />
            {/* <img className='viewrole-photo' src={activeNode.photo ? PHOTO_LINK + activeNode.photo : DEFAULT_PHOTO} alt='' /> */}
          </div>
          <div className={styles["viewrole-details"]}>
            <div className={styles["viewrole-name"]}>
              <span><b>{activeNode.fullName}</b></span>
              <span>{activeNode.jobTitle}</span>
            </div>

            <div className={styles["viewrole-contact"]} >
              <span><b>Contact</b></span>
              <div className={styles["viewrole-email"]} >
                <div className={styles["viewrole-email-label"]}>
                  <DraftsOutlinedIcon />
                  <span>Email</span>
                </div>
                <div className={styles["viewrole-email-detail"]} >
                  <span>{activeNode.email}</span>
                </div>
              </div>
              <div className={styles["viewrole-phone"]}>
                <div className={styles["viewrole-phone-label"]}>

                  <LocalPhoneOutlinedIcon />
                  <span>Phone</span>
                </div>
                <div className={styles["viewrole-phone-detail"]} >
                  <span>{activeNode.phoneNumber}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>


  );
}

export default ViewRole;
