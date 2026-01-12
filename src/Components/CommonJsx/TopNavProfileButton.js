"use client"
import React, { useState, useEffect, useContext, useRef } from 'react'
import DemoPopUp from '../HomePages/RequestDemo/DemoPopUp';
import styles from '../HomePages/HomepageTopNav/HomeTopNav.module.css'
import NameProfile from './NameProfile';
import { contextState } from './ContextProvider';
import axios from 'axios';
import { BASE_URL } from '@/config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import UserLoginPupUp from './UserLoginPupUp';
import { MdDashboard } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';

function TopNavProfileButton({isMobileMenu = false}) {
  const [openDemoForm, setOpenDemoForm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { user, setUser, setIsProfileComplete,isProfileComplete,updatedDetails, setUpdatedDetails, } = useContext(contextState);
  
  useEffect(() => {
    // Only run on client side
    setIsVerified(localStorage.getItem('is_verified'));
    getUserDetails();
  }, [updatedDetails]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const getUserDetails = async () => {
    const uuid = localStorage.getItem('uuid');
    if (!uuid) {
      return;
    }
    
    try {
      const res = await axios.get(`${BASE_URL}/v1/cad/get-user-details`, {
        headers: { 'user-uuid': uuid }
      });

      if (res.data.meta.success) {
        setIsProfileComplete(true)
        const data = res.data.data;
        console.log("User details fetched successfully:", data);
        setUser({
          _id:data?._id,
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
          designation:data?.designation||'',
          username:data?.username,
          downloadRating:data?.unrated_designs_count||0,
          kycStatus:data?.kyc_status||'',
        });
      }
    }
    catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    
    // Generate new UUID and store in localStorage
    const newUuid = uuidv4();
    localStorage.setItem('uuid', newUuid);
    
    // Reset user state to initial empty state
    setUser({});
    
    // Reset profile complete state
    setIsProfileComplete(false);
    
    // Reset updated details
    setUpdatedDetails(false);
    
    // Set verified to false
    setIsVerified(false);
    
    // Close dropdown
    setShowDropdown(false);
  };

  return (
    <>
      {isVerified ? (
        isMobileMenu ? (
          // Mobile menu: Show profile and logout buttons side by side
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <Link
              href="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <NameProfile userName={user?.name ? user.name : (user?.email || 'User')} memberPhoto={user?.photo} width={50} height={50} border={true}/>
            </Link>
            <button
              onClick={handleLogout}
              className={styles['try-demo']}
              style={{ 
                backgroundColor: '#fff', 
                color: '#e74c3c', 
                border: '1px solid #e74c3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 20px',
                whiteSpace: 'nowrap'
              }}
            >
              <FiLogOut style={{ marginRight: '8px', fontSize: '18px' }} />
              Logout
            </button>
          </div>
        ) : (
          // Desktop: Show dropdown
          <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'inline-block',
                margin: 0,
                textAlign: 'initial',
                justifyContent: 'initial',
                alignItems: 'initial',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            >
              <NameProfile userName={user?.name ? user.name : (user?.email || 'User')} memberPhoto={user?.photo} width={50} height={50} border={true}/>
            </button>
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  minWidth: '180px',
                  zIndex: 1000,
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  fontFamily: 'inherit'
                }}
              >
                <Link
                  href="/dashboard"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#333333',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                    border: 'none',
                    width: '100%',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                    margin: 0,
                    lineHeight: 'normal'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MdDashboard style={{ marginRight: '12px', fontSize: '18px', color: '#610bee', flexShrink: 0 }} />
                  <span style={{ display: 'inline-block', textAlign: 'left' }}>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: '#e74c3c',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                    border: 'none',
                    width: '100%',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                    margin: 0,
                    lineHeight: 'normal',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FiLogOut style={{ marginRight: '12px', fontSize: '18px' }} />
                  <span style={{ display: 'inline-block', textAlign: 'left' }}>Logout</span>
                </button>
              </div>
            )}
          </div>
        )
        ) : ( 
          <>
            <button className={styles['try-demo']} onClick={() => setOpenDemoForm('demo')}>
              Request demo
            </button>
            <button className={styles['try-demo']} style={{ backgroundColor: '#fff', color: '#610bee', border: '1px solid #610bee' }} onClick={() => setOpenDemoForm('login')}>
              Login
            </button>
            {openDemoForm === 'login' && (
              <UserLoginPupUp onClose={() => setOpenDemoForm(null)} type="login" />
            )}
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