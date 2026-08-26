"use client"
import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import CreatorLeftCont from './CreatorLeftCont'
import CreatorsRightCont from './CreatorsRightCont'
import CreatorCoverPage from './CreatorCoverPage'
import UserLoginPupUp from '../CommonJsx/UserLoginPupUp'
import axios from 'axios'
import { BASE_URL } from '@/config'
import styles from './Creators.module.css'
import { contextState } from '../CommonJsx/ContextProvider';
import DashboardMobileChrome from './DashboardMobileChrome';

function CreatorsHome({ creatorId }) {
  // viewer, setViewer
  const { setViewer } = useContext(contextState);
  const [isVerified, setIsVerified] = useState(false);
  const searchParams = useSearchParams();
  const showMobileProfile = !creatorId && searchParams.get('cad_type') === 'USER_PROFILE';

  useEffect(() => {
    if (creatorId) {
      getUserDetails(creatorId);
      return;
    }
    document.body.classList.add('dashboard-mobile-app');
    return () => document.body.classList.remove('dashboard-mobile-app');
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
          views: data?.totalViews || "0",
          downloads: data?.totalDownloads || "0",

          designation: data?.designation || '',
          username: data?.username || '',
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
      {!creatorId ? <DashboardMobileChrome /> : null}
      <div className={styles.desktopDashboardChrome}>
      <CreatorCoverPage creatorId={creatorId} setIsVerified={setIsVerified}/>
      </div>
      <div className={styles.creatorDetails} >
        <CreatorLeftCont
          creatorId={creatorId}
          setIsVerified={setIsVerified}
          className={showMobileProfile ? styles.showOnMobileProfile : ''}
        />
        {/* <div className={styles.creatorDetailsVertical} style={{ width: '2px', background: '#edf2f7', marginTop: '80px' }} />
        <div className={styles.creatorDetailsHorizontal} style={{ width: '100%', background: '#edf2f7', height: '2px' }} /> */}
        <CreatorsRightCont creatorId={creatorId} />
      </div>
    </>

  )
}

export default CreatorsHome