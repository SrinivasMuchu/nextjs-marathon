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
import { toast } from 'react-toastify';
import axios from 'axios';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import Image from 'next/image';
import { PHOTO_LINK } from './../../../config';

function ViewRole({ activeNode, setAction }) {
  const [close, setClose] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editedValues, setEditedValues] = useState({
    fullName: activeNode.fullName,
    jobTitle: activeNode.jobTitle,
    phoneNumber: activeNode.phoneNumber,
    photo: activeNode.photo
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


  const handleSave = async () => {
    if(!editedValues.fullName){
      toast.error('Full name cannot be empty')
      return
    }
    if(!editedValues.jobTitle){
      toast.error('jobTitle cannot be empty')
      return
    }

    try {
      const response = await axios.put(BASE_URL + "/v1/org/edit-role-next", {
        entity_id: activeNode.entity_id,
        jobTitle: editedValues.jobTitle, fullName: editedValues.fullName,
        phoneNumber: editedValues.phoneNumber, org_id: localStorage.getItem('org_id'),
        photo: editedValues.photo
      },
        {
          headers: {
            'x-auth-token': localStorage.getItem("token")
          }
        });
      if (response.data.meta.success) {
        toast.success('Member details changed successfully. Refreshing the page')
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } else {
        toast.error(response.data.meta.message)
      }

    } catch (error) {
      toast.error(error.message);

    }
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setEditedValues((prev) => ({ ...prev, ['photo']: reader.result })); // Directly set base64 string
    reader.readAsDataURL(file);

  };
  return (
    <div className={styles["editRole"]} style={{ display: close ? "none" : "block" }}>
      <div className={styles["docTop"]}>
        <CloseButton handleClose={handleClose} heading='View Role' styles={styles} />
        <div className={styles["viewrole-photo-cont"]}>
          <div className={styles["general-upload"]} >
            {editedValues.photo ? <Image width={200} height={200} src={PHOTO_LINK+editedValues.photo} alt="Uploaded"
              className="upd-img" style={{ width: '200px', height: '200px', borderRadius: '50%' }} /> :
              <NameProfile userName={activeNode.fullName} width='200px' memberPhoto={activeNode.photo} fontSize='100px' fontweight='500' />}
            {isEditing && (
              <button
                className={styles["general-upload-btn"]}
                onClick={() => document.getElementById("fileupld-edit-photo")?.click()} // Added optional chaining
              >
                <Image
                  width={16}
                  height={16}
                  src={`${ASSET_PREFIX_URL}upload-plus.svg`}
                  alt="Upload"
                />
              </button>
            )}

          </div>

          {/* <NameProfile userName={name} memberPhoto={photoFile} width="200px" fontSize='38px' fontweight='500' /> */}


        </div>
        {/* <div className={styles["general-upload"]} >
          
        </div> */}
        <input
          type="file"
          id="fileupld-edit-photo"
          accept="image/jpeg, image/png"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          className="btn-upload"
        />
        <div className={styles["viewrole-details"]}>
          <div className={styles["viewrole-name"]}>
            {/* <span><b>{activeNode.fullName}</b></span> */}
            <span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedValues.fullName} className={styles["viewrole-input"]}
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
                  onChange={(e) => handleChange(e, "jobTitle")} className={styles["viewrole-input"]}
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
                    value={editedValues.phoneNumber} className={styles["viewrole-input"]}
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
