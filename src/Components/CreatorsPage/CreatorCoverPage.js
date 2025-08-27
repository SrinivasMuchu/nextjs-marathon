"use client"
import React, { useContext, useRef } from 'react'
import { contextState } from '../CommonJsx/ContextProvider';
import Image from 'next/image'
import { BASE_URL, IMAGEURLS, PHOTO_LINK } from '@/config'
import styles from './Creators.module.css'
import axios from 'axios';

function CreatorCoverPage({ creatorId }) {
  
  const { user, setUser, setUpdatedDetails,viewer } = useContext(contextState);
  const fileInputRef = useRef(null);


  const profileData = !creatorId ? user : viewer;


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64 preview first
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Photo = reader.result;
      setUser(prev => ({ ...prev, cover_image: base64Photo }));

      try {
        const uuid = localStorage.getItem("uuid");
        const response = await axios.post(`${BASE_URL}/v1/cad-creator/create-creator-profile`, {
          cover_photo: base64Photo
        }, {
          headers: { 'user-uuid': uuid }
        });

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
  const handleCoverClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className={styles.coverPhotoCont}>
        {profileData.cover_image ? (
          <div className={styles.coverPhoto} style={{ background: 'none' }}>
            <Image
              src={PHOTO_LINK + profileData.cover_image}
              alt="Cover Image"
              layout="fill"
              objectFit="cover"
            />
            {!creatorId && <>
              <input
                ref={fileInputRef}
                id="coverUpload"
                type="file"
                accept="image/*"
                className={styles.uploadInput}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button onClick={handleCoverClick} className={styles.coverBtn}>
                <Image
                  src={IMAGEURLS.uploadCover}
                  alt="Upload Cover"
                  width={24}
                  height={24}
                />
                Add cover image
              </button>
            </> }
                    </div>

        ) : (
          <div className={styles.coverPhoto}>
            {!creatorId && <>
              <input
                ref={fileInputRef}
                id="coverUpload"
                type="file"
                accept="image/*"
                className={styles.uploadInput}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button onClick={handleCoverClick} className={styles.coverBtn}>
                <Image
                  src={IMAGEURLS.uploadCover}
                  alt="Upload Cover"
                  width={24}
                  height={24}
                />
                Add cover image
              </button>
            </> }
          </div>
        )}


      </div>
    </div>
  )
}

export default CreatorCoverPage
