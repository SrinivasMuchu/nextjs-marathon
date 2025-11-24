"use client";
import React, { useState, useRef, useContext } from 'react'
import NameProfile from '../CommonJsx/NameProfile'
import styles from './Creators.module.css'
import { MdVerified } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import Image from 'next/image';
import { contextState } from '../CommonJsx/ContextProvider';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import axios from 'axios'
import { RiUserLine } from "react-icons/ri";

function CreatorsProfile({ creatorId,setIsVerified }) {
  const photoInputRef = useRef(null);
  
  const { user, setUser, setUpdatedDetails,viewer } = useContext(contextState);
  const [editField, setEditField] = useState({ name: false, email: false, photo: false, designation: false });
  const [originalValues, setOriginalValues] = useState({ name: user?.name, designation: user?.designation });

  const profileData = !creatorId ? user : viewer;

  const handleEditClick = (field) => {
     if(!localStorage.getItem('is_verified')){
      setIsVerified(true)
      return
    }
    setOriginalValues(prev => ({ ...prev, [field]: user[field] }));
    setEditField(prev => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = (field) => {
    setUser(prev => ({ ...prev, [field]: originalValues[field] }));
    setEditField(prev => ({ ...prev, [field]: false }));
  };

  const handleClick = () => {
     if(!localStorage.getItem('is_verified')){
      setIsVerified(true)
      return
    }
    photoInputRef.current?.click()
  };

  const handleFileUpload = async (e) => {
     if(!localStorage.getItem('is_verified')){
      setIsVerified(true)
      return
    }
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64 preview first
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Photo = reader.result;
      setUser(prev => ({ ...prev, photo: base64Photo }));

      try {
        const uuid = localStorage.getItem("uuid");
        const response = await axios.post(
          `${BASE_URL}/v1/cad/create-user-details`,
          {
            user_email: user.email,
            full_name: user.name,
            photo: base64Photo
          },
          { headers: { "user-uuid": uuid } }
        );

        if (response.data.meta.success) {
          setUpdatedDetails(user);
          console.log("Photo uploaded successfully ✅");
        }
      } catch (err) {
        console.error("Error uploading photo:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveField = async (field) => {
    try {
      if (!localStorage.getItem('is_verified') || field === 'email') {
        return;
      }
      if (field === 'email') {
        return;
      }

      const uuid = localStorage.getItem('uuid');
      const response = await axios.post(`${BASE_URL}/v1/cad/create-user-details`, {
        user_email: user.email,
        full_name: user.name,
        photo: user.photo
      }, {
        headers: { 'user-uuid': uuid }
      });

      if (response.data.meta.success) {
        setUpdatedDetails(user)
        setEditField(prev => ({ ...prev, [field]: false }));
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
    }
  };

  const handleSaveDesignationField = async (field) => {
    try {
      const uuid = localStorage.getItem('uuid');
      const response = await axios.post(`${BASE_URL}/v1/cad-creator/create-creator-profile`, {
        designation: user.designation,
      }, {
        headers: { 'user-uuid': uuid }
      });

      if (response.data.meta.success) {
        setUpdatedDetails(user);
        setEditField(prev => ({ ...prev, designation: false }));
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Profile Photo Section */}
      <div className={styles.photoWrapper}>
        <input
          type="file"
          ref={photoInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileUpload}
        />
        
        <div className={styles.photoUpload} >
          {!creatorId && <div className={styles.cameraIcon} onClick={handleClick}>
            <FaCamera />
          </div>}
          {profileData.photo ? (
  !profileData.photo.startsWith('data') ? (
    <NameProfile 
      userName={profileData.name ? profileData.name : profileData.email} 
      memberPhoto={profileData.photo} 
      width="120px"
      fontSize="48px"  
    />
  ) : (
    <Image 
      src={profileData.photo} 
      alt="Profile" 
      width={120} 
      height={120} 
      style={{ 
        borderRadius: '50%', 
        width: '100px', 
        height: '100px', 
        objectFit: 'cover' 
      }} 
    />
  )
) : (
  profileData.name || profileData.email ? (
    <NameProfile 
      width="100px" 
      userName={profileData.name ? profileData.name : profileData.email} 
      fontSize="48px" 
      memberPhoto={profileData.photo}
    />
  ) : (
    <div 
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <RiUserLine size={48} color="#610bee" />
    </div>
  )
)}
        </div>

        {editField.photo && (
          <div className={styles.photoActions}>
            <button onClick={() => handleSaveField('photo')}>
              <Image 
                src={`${ASSET_PREFIX_URL}save-details.png`} 
                alt="save" 
                width={20} 
                height={20} 
              />
            </button>
            <button onClick={() => handleCancelEdit('photo')}>
              <Image 
                src={`${ASSET_PREFIX_URL}cancel-detail.png`} 
                alt="cancel" 
                width={20} 
                height={20} 
              />
            </button>
          </div>
        )}
      </div>
      <div className={styles.horizontalDivider}></div>
      {!creatorId ? (
        <div className={styles.profileDetails}>
          {/* Name Field */}
          <div
            className={`${styles.editableField} ${!editField.name ? styles.editableBorder : styles.editingBorder}`}
            style={{ cursor: 'pointer' }}
            onClick={() => !editField.name && handleEditClick('name')}
          >
            {!editField.name ? (
              <div className={styles.fieldDisplay} style={{ position: 'relative' }}>
                <span className={styles.profileDetailsTitle} style={{ color: !user.name ? '#999' : undefined }}>
                  {user.name || "Enter your name"}
                </span>
              </div>
            ) : (
              <div className={styles.fieldEdit}>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  className={styles.editInput}
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
                <div className={styles.editActions}>
                  <button
                    onClick={() => user.name && handleSaveField('name')}
                    disabled={!user.name || user.name.trim() === ""}
                    style={{ opacity: !user.name || user.name.trim() === "" ? 0.5 : 1 }}
                  >
                    <Image
                      src={`${ASSET_PREFIX_URL}save-details.png`}
                      alt="save"
                      width={16}
                      height={16}
                    />
                  </button>
                  <button onClick={() => handleCancelEdit('name')}>
                    <Image
                      src={`${ASSET_PREFIX_URL}cancel-detail.png`}
                      alt="cancel"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
          {user.username && <div className={styles.editableField}>
            <div className={styles.fieldDisplay}>
              <span className={styles.profileDetailsRole} style={{color:'#610bee',fontSize:'16px',fontWeight:'400'}}>@{user.username}</span>
            </div>
          </div>}
          
          {/* Email Field */}
          

          {/* Designation Field */}
          <div
            className={`${styles.editableField} ${!editField.designation ? styles.editableBorder : styles.editingBorder}`}
            style={{ cursor: 'pointer' }}
            onClick={() => !editField.designation && handleEditClick('designation')}
          >
            {!editField.designation ? (
              <div className={styles.fieldDisplay} style={{ position: 'relative' }}>
                <span className={styles.profileDetailsTitle} style={{ fontSize: '18px', fontWeight: '500', color: !user.designation ? '#999' : undefined }}>
                  {user.designation || "Enter your designation"}
                </span>
              </div>
            ) : (
              <div className={styles.fieldEdit}>
                <input
                  type="text"
                  value={user.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Enter your designation"
                  className={styles.editInput}
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
                <div className={styles.editActions}>
                  <button onClick={() => handleSaveDesignationField('designation')}>
                    <Image
                      src={`${ASSET_PREFIX_URL}save-details.png`}
                      alt="save"
                      width={16}
                      height={16}
                    />
                  </button>
                  <button onClick={() => handleCancelEdit('designation')}>
                    <Image
                      src={`${ASSET_PREFIX_URL}cancel-detail.png`}
                      alt="cancel"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={styles.editableField}>
            <div className={styles.fieldDisplay}>
              <span className={styles.profileDetailsRole}>{user.email}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.profileDetails}>
          {/* Name Field - View Only */}
          <div className={styles.editableField}>
            <span className={styles.profileDetailsTitle}>
              {profileData.name}
            </span>
          </div>
          <div className={styles.editableField}>
            <div className={styles.fieldDisplay}>
              <span className={styles.profileDetailsRole} style={{color:'#610bee',fontSize:'16px',fontWeight:'400'}}>@{profileData.username}</span>
            </div>
          </div>

          {/* Email Field - View Only */}
         

          {/* Designation Field - View Only */}
          <div className={styles.editableField}>
            <span className={styles.profileDetailsTitle} style={{ fontSize: '18px', fontWeight: '500' }}>
              {profileData.designation}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatorsProfile