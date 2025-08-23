"use client"
import React, { useEffect, useState } from 'react'
import CreatorLeftCont from './CreatorLeftCont'
import CreatorsRightCont from './CreatorsRightCont'
import CreatorCoverPage from './CreatorCoverPage'
import UserLoginPupUp from '../CommonJsx/UserLoginPupUp'
import axios from 'axios'
import { BASE_URL } from '@/config'
import styles from './Creators.module.css'

function CreatorsHome({ creatorId }) {
  console.log(creatorId)
  const [isVerified, setIsVerified] = useState(false);
  const [viewer, setViewer] = useState({});

  useEffect(() => {
    if (!creatorId) {
      if (!localStorage.getItem('is_verified')) {
        setIsVerified(true);

      }
    } else {
      getUserDetails(creatorId);
    }

  }, [creatorId]);


  const getUserDetails = async (creatorId) => {
    try {
      const res = await axios.get(`${BASE_URL}/v1/cad-creator/get-creator-details/${creatorId}`);

      if (res.data.meta.success) {
        // setIsProfileComplete(true)
        const data = res.data.data;
        console.log("User details fetched successfully:", data);
        setViewer(prev => ({
          ...prev,
          email: data?.user_email || '',
          name: data?.full_name || '',
          photo: data?.photo || '',
          user_access_key: data?.user_access_key || false,
          desc: data?.creator_des || '',
          skills: data?.creator_specific_cad_category || [],
          website: data?.website_url || '',
          linkedin: data?.linkedin_url || '',
          cover_image: data?.cover_photo || '',
          projects: data?.totalFiles || 0,
          views: data?.totalViews || 0,
          downloads: data?.totalDownloads || 0,
          designation: data?.designation || ''
        }));
      }
    }
    catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  return (
    <>
      {isVerified && <UserLoginPupUp onClose={() => setIsVerified(false)} type='creator' />}
      <CreatorCoverPage viewer={viewer} creatorId={creatorId} />
      <div className={styles.creatorDetails} >
        <CreatorLeftCont viewer={viewer} creatorId={creatorId} />
        <CreatorsRightCont viewer={viewer} creatorId={creatorId} />
      </div>
    </>

  )
}

export default CreatorsHome