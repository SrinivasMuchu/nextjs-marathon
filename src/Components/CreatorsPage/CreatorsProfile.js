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

function CreatorsProfile() {
  const photoInputRef = useRef(null);
  const { user, setUser, setIsProfileComplete } = useContext(contextState);
  const [editField, setEditField] = useState({ name: false, email: false, photo: false });
  

  const handleEditClick = (field) => {
    setEditField(prev => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  // const handleSaveField = (field) => {
  //   // Here you can add API call to save the data
  //   console.log(`Saving ${field}:`, user[field]);
  //   setEditField(prev => ({ ...prev, [field]: false }));
    
  //   // Update context if needed
  //   if (field === 'name') {
  //     setUser(prev => ({ ...prev, name: user.name }));
  //   }
  // };

  const handleCancelEdit = (field) => {
    // Reset to original value
    if (field === 'name') {
      setUser(prev => ({ ...prev, name: user?.name || 'Srinivas muchu' }));
    } else if (field === 'email') {
      setUser(prev => ({ ...prev, email: user?.email }));
    }
    setEditField(prev => ({ ...prev, [field]: false }));
  };

  const handleClick = () => photoInputRef.current?.click();

const handleFileUpload = async (e) => {
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
        setIsProfileComplete(user);
        console.log("Photo uploaded successfully ✅");
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
    }
  };
  reader.readAsDataURL(file);
};



  const handleSaveField = async (field) => {
      // console.log(originalUser[field], user[field]);
      
      
  
      // Check if the field value hasn't changed
      // if (user[field] === originalUser[field]) {
      //   setEditField(prev => ({ ...prev, [field]: false }));
      //   return;
      // }
      // console.log(field)
  
      try {
        if (!localStorage.getItem('is_verified') || field === 'email') {
          // setIsEmailVerify(true);
          return;
        }
        if (field === 'email') {
          return;
        }
  
  
        // setSigningUp(true);
        const uuid = localStorage.getItem('uuid');
        const response = await axios.post(`${BASE_URL}/v1/cad/create-user-details`, {
          user_email: user.email,
          full_name: user.name,
          photo: user.photo
        }, {
          headers: { 'user-uuid': uuid }
        });
  
        if (response.data.meta.success) {
          setIsProfileComplete(user)
         
          // setUser({...user,[field]:})
          // sendGAtagEvent({ event_name: 'publish_cad_profile_complete', event_category: CAD_PUBLISH_EVENT });
          // toast.success(`${field} updated successfully`);
          setEditField(prev => ({ ...prev, [field]: false }));
          // setErrors(prev => ({ ...prev, [field]: '' }));
          // setOriginalUser({ ...user });
          // setHasChanges(false);
          // setIsEmailVerify(false);
        }
        // setSigningUp(false);
      } catch (err) {
        // setSigningUp(false);
        console.error(`Error updating ${field}:`, err);
        toast.error(`Failed to update ${field}`);
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
        
        <div className={styles.photoUpload} onClick={handleClick}>
          <div className={styles.cameraIcon}>
            <FaCamera />
          </div>
          {user.photo ? (
            !user.photo.startsWith('data') ? (
              <NameProfile userName={user.name?user.name:user.email} memberPhoto={user.photo} width='120px' />
            ) : (
              <Image 
                src={user.photo} 
                alt="Profile" 
                width={120} 
                height={120} 
                style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }} 
              />
            )
          ) : (
            <NameProfile width='100px' userName={user.name} />
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

      <div className={styles.profileDetails}>
        {/* Name Field */}
        <div className={styles.editableField}>
          {!editField.name ? (
            <div className={styles.fieldDisplay}>
              <span className={styles.profileDetailsTitle}>
                {user.name} 
              </span>
              <button 
                className={styles.editButton} 
                onClick={() => handleEditClick('name')}
              >
                <Image
                  src={`${ASSET_PREFIX_URL}edit-ticket.png`}
                  alt="edit"
                  width={16}
                  height={16}
                />
              </button>
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
              />
              <div className={styles.editActions}>
                <button onClick={() => handleSaveField('name')}>
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

        {/* Email Field */}
        <div className={styles.editableField}>
          {!editField.email ? (
            <div className={styles.fieldDisplay}>
              <span className={styles.profileDetailsRole}>{user.email}</span>
              {/* <button 
                className={styles.editButton} 
                onClick={() => handleEditClick('email ')}
              >
                <Image
                  src={`${ASSET_PREFIX_URL}edit-ticket.png`}
                  alt="edit"
                  width={16}
                  height={16}
                />
              </button> */}
            </div>
          ) : (
            <div className={styles.fieldEdit}>
              <input
                type="text"
                value={user.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className={styles.editInput}
                autoFocus
              />
              <div className={styles.editActions}>
                <button onClick={() => handleSaveField('email')}>
                  <Image
                    src={`${ASSET_PREFIX_URL}save-details.png`}
                    alt="save"
                    width={16}
                    height={16}
                  />
                </button>
                <button onClick={() => handleCancelEdit('email')}>
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
      </div>

      {/* <div className={styles.profileActions}>
        <button className={styles.followButton}>Follow</button>
        <button className={styles.actionButton}>Message</button>
        <button className={styles.actionButton}>Book a call</button>
      </div> */}
    </div>
  )
}

export default CreatorsProfile