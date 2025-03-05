"use client";
import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import styles from './EditHierarchy.module.css';
import NameProfile from '@/Components/CommonJsx.js/NameProfile';
import CloseButton from '../Common/CloseButton';
import CommonCancelButton from '../Common/CommonCancelButton';
import CommonSaveButton from '../Common/CommonSaveButton';

function ViewRole({ activeNode, setAction }) {
  const [close, setClose] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    fullName:activeNode.fullName,
    jobTitle: activeNode.jobTitle,
    phoneNumber: activeNode.phoneNumber,
  });

  const handleClose = () => {
    setClose(true);
    setAction(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e, field) => {
    setEditedValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle API call or state update here
  };

  return (
    <div className={styles["editRole"]} style={{ display: close ? "none" : "block" }}>
      <div className={styles["docTop"]}>
        <CloseButton handleClose={handleClose} heading='View Role' styles={styles} />
        <div className={styles["viewrole-photo-cont"]}>
          <NameProfile userName={activeNode.fullName} width='200px' memberPhoto={activeNode.photo} fontSize='100px' fontweight='500' />
        </div>
        <div className={styles["viewrole-details"]}>
          <div className={styles["viewrole-name"]}>
            {/* <span><b>{activeNode.fullName}</b></span> */}
            <span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedValues.fullName}  className={styles["viewrole-input"]}
                  onChange={(e) => handleChange(e, "fullName")} 
                />
              ) : (
                editedValues.fullName
              )}
            </span>
            <span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedValues.jobTitle} 
                  onChange={(e) => handleChange(e, "jobTitle")}  className={styles["viewrole-input"]}
                />
              ) : (
                editedValues.jobTitle
              )}
            </span>
          </div>
          <div className={styles["viewrole-contact"]}>
            <span><b>Contact</b></span>
            <div className={styles["viewrole-email"]}>
              <div className={styles["viewrole-email-label"]}>
                <DraftsOutlinedIcon />
                <span>Email</span>
              </div>
              <div className={styles["viewrole-email-detail"]}>
                <span>{activeNode.email}</span>
              </div>
            </div>
            <div className={styles["viewrole-phone"]}>
              <div className={styles["viewrole-phone-label"]}>
                <LocalPhoneOutlinedIcon />
                <span>Phone</span>
              </div>
              <div className={styles["viewrole-phone-detail"]}>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editedValues.phoneNumber}  className={styles["viewrole-input"]}
                    onChange={(e) => handleChange(e, "phoneNumber")} 
                  />
                ) : (
                  editedValues.phoneNumber
                )}
              </div>
            </div>
          </div>
          <div className={styles["edit-btns"]}>
          {!isEditing ? (
            <button onClick={handleEdit} className={styles["submit-edit-button"]}>Edit</button>
            // <EditIcon onClick={handleEdit} className={styles["edit-icon"]} />
          ) : (
            <>
            <CommonSaveButton handleClick={handleSave} className='submit-edit-button' styles={styles} />
           
            <CommonCancelButton handleClose={handleClose} styles={styles} />
           
            </>
            
          )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ViewRole;
