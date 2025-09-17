"use client"
import React, { useContext, useRef, useState } from 'react'
import { contextState } from '../CommonJsx/ContextProvider';
import Image from 'next/image'
import { MARATHON_ASSET_PREFIX_URL, BASE_URL, IMAGEURLS, PHOTO_LINK } from '@/config'
import styles from './Creators.module.css'
import axios from 'axios';
import ShareYourDesignItems from '../CreatorsLanding/ShareYourDesignItems';

function CreatorCoverPage({ creatorId,setIsVerified }) {
  
  const { user, setUser, setUpdatedDetails,viewer } = useContext(contextState);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [previewCover, setPreviewCover] = useState(null);

  const profileData = !creatorId ? user : viewer;


  const handleFileUpload = async (e) => {
     if(!localStorage.getItem('is_verified')){
      setIsVerified(true)
      return
    }
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Hide previous image while uploading
    setUser(prev => ({ ...prev, cover_image: null }));

    // Convert to base64 preview first
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Photo = reader.result;
      setPreviewCover(base64Photo);

      try {
        const uuid = localStorage.getItem("uuid");
        const response = await axios.post(`${BASE_URL}/v1/cad-creator/create-creator-profile`, {
          cover_photo: base64Photo
        }, {
          headers: { 'user-uuid': uuid }
        });

        if (response.data.meta.success) {
          setUpdatedDetails(user);
          if (response.data.data && response.data.data.cover_image) {
            setUser(prev => ({ ...prev, cover_image: response.data.data.cover_image }));
          } else {
            console.warn("No cover_image in response:", response.data);
          }
          setPreviewCover(null);
          console.log("Photo uploaded successfully ✅");
        }
      } catch (err) {
        console.error("Error uploading photo:", err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleCoverClick = () => {
     if(!localStorage.getItem('is_verified')){
      setIsVerified(true)
      return
    }
    fileInputRef.current?.click();
  };

  return (
    <>
     <div>
      <div className={styles.coverPhotoCont}>
        {uploading ? (
          <div className={styles.coverPhoto} style={{ background: 'none', position: 'relative' }}>
            <div className={styles.uploadingOverlay}>
              Uploading...
            </div>
          </div>
        ) : profileData.cover_image ? (
          <div className={styles.coverPhoto} style={{ background: 'none' }}>
            <Image
              src={PHOTO_LINK + profileData.cover_image}
              alt="Cover Image"
              layout="fill"
              objectFit="cover"
            />
            {!creatorId && (
              <>
                {/* <input
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
                  Add cover image <br/>(1440 x 180px)
                </button> */}
                 <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',flexDirection:'column'}}>
      <h1>Share Your Designs on Marathon-OS</h1>
       <Image
              src={MARATHON_ASSET_PREFIX_URL+'publish-banner.webp'}
              alt="Cover Image"
              width={1200}
              height={300}
            />
      <button className={styles.coverPhotoPublishCad}>Publish CAD</button>
    </div>
              </>
            )}
          </div>
        ) : (
          <div className={styles.coverPhoto}>
            {!creatorId && (
              <>
                {/* <input
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
                  Add cover image <br/>(1440 x 180px)
                </button> */}
                 <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',flexDirection:'column'}}>
      <h1>Share Your Designs on Marathon-OS</h1>
       <Image
              src={MARATHON_ASSET_PREFIX_URL+'publish-banner.webp'}
              alt="Cover Image"
              width={1200}
              height={300}
            />
      <button className={styles.coverPhotoPublishCad}>Publish CAD</button>
    </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
   
    </>
   
  )
}

export default CreatorCoverPage
