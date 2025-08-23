"use client"
import React, { useState, useEffect, useContext } from 'react'
import DemoPopUp from '../HomePages/RequestDemo/DemoPopUp';
import styles from '../HomePages/HomepageTopNav/HomeTopNav.module.css'
import NameProfile from './NameProfile';
import { contextState } from './ContextProvider';
import axios from 'axios';
import { BASE_URL } from '@/config';
import Link from 'next/link';

function TopNavProfileButton() {
  const [openDemoForm, setOpenDemoForm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { user, setUser, setIsProfileComplete,isProfileComplete,updatedDetails, setUpdatedDetails, } = useContext(contextState);
  
  useEffect(() => {
    // Only run on client side
    setIsVerified(localStorage.getItem('is_verified'));
    getUserDetails();
  }, [updatedDetails]);

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v1/cad/get-user-details`, {
        headers: { 'user-uuid': localStorage.getItem('uuid') }
      });

      if (res.data.meta.success) {
        setIsProfileComplete(true)
        const data = res.data.data;
        console.log("User details fetched successfully:", data);
        setUser({
          email: data?.user_email || '',
          name: data?.full_name || '',
          photo: data?.photo || '',
          user_access_key: data?.user_access_key || false,
          desc: data?.creator_des || '',
          skills: data?.creator_specific_cad_category || [],
          website: data?.website_url || '',
          linkedin: data?.linkedin_url || '',
          cover_image:data?.cover_photo || '',
          projects:data?.file_stats.totalFiles||0,
          views:data?.file_stats.totalViews||0,
          downloads:data?.file_stats.totalDownloads||0,
          designation:data?.designation||''
        });
      }
    }
    catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  return (
    <>
      {isVerified ? (
        <Link href="/dashboard?cad_type=USER_PROFILE" className={styles['profile-button']}>
          <NameProfile userName={user.name?user.name:user.email} memberPhoto={user.photo} width={50} height={50} border={true}/></Link>
        ) : ( 
          <>
            <button className={styles['try-demo']} onClick={() => setOpenDemoForm('demo')}>
              Request demo
            </button>
            {openDemoForm === 'demo' && (
              <DemoPopUp 
                onclose={() => setOpenDemoForm(null)} 
                openPopUp={openDemoForm} 
                setOpenDemoForm={setOpenDemoForm}
              />
            )}
          </>
        )}
    </>
  )
}

export default TopNavProfileButton