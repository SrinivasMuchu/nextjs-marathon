'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './UserCadFileUpload.module.css';
import Image from 'next/image';
import { toast } from 'react-toastify';
import NameProfile from "@/Components/CommonJsx/NameProfile";
import axios from 'axios';
import { BASE_URL, ASSET_PREFIX_URL } from '@/config';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
function TellUsAboutYourself() {
  const photoInputRef = useRef(null);

  const [isClient, setIsClient] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userUuid, setUserUuid] = useState('');
  const [user, setUser] = useState({ name: '', email: '', photo: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [editField, setEditField] = useState({ name: false, email: false });

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (isClient) {
      const uuid = localStorage.getItem('uuid') || '';
      setUserUuid(uuid);
      getUserDetails(uuid);
    }
  }, [isClient]);

  const getUserDetails = async (uuid) => {
    try {
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const photo = localStorage.getItem('user_photo');

      if (email && name) {
        setUser({ name, email, photo });
        setIsProfileComplete(true);
      } else {
        const res = await axios.get(`${BASE_URL}/v1/cad/get-user-details`, {
          headers: { 'user-uuid': uuid }
        });

        if (res.data.meta.success) {
          const data = res.data.data;
          setUser({
            email: data?.user_email || '',
            name: data?.full_name || '',
            photo: data?.photo || ''
          });

          if (data?.user_email && data?.full_name && data?.photo) {
            localStorage.setItem('user_email', data.user_email);
            localStorage.setItem('user_name', data.full_name);
            localStorage.setItem('user_photo', data.photo);
            setIsProfileComplete(true);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const validate = (field, value) => {
    if (field === 'name') return value.trim() ? '' : 'Full name is required';
    if (field === 'email') {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? '' : 'Enter a valid email';
    }
    return '';
  };

  const updateField = async (field) => {

    const error = validate(field, user[field]);
    if (error) return setErrors(prev => ({ ...prev, [field]: error }));

    try {
      const uuid = localStorage.getItem('uuid');
      const response = await axios.post(`${BASE_URL}/v1/cad/create-user-details`, {
        user_email: user.email,
        full_name: user.name,
        photo: user.photo
      }, {
        headers: { 'user-uuid': uuid }
      });

      if (response.data.meta.success) {
        toast.success(`Profile updated successfully`);
        if (field !== 'photo') {
          localStorage.setItem(`user_${field}`, user[field]);
          setEditField(prev => ({ ...prev, [field]: false }));
          setErrors(prev => ({ ...prev, [field]: '' }));
        } else {

          localStorage.setItem(`user_${field}`, response.data.data);
          setEditField(prev => ({ ...prev, [field]: false }));
          setErrors(prev => ({ ...prev, [field]: '' }));
        }

      }
    } catch (err) {
      console.error(`Error updating Profile:`, err);
      toast.error(`Failed to update Profile`);
    }
  };

  const handleClick = () => photoInputRef.current?.click();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setUser(prev => ({ ...prev, photo: reader.result }));
    reader.readAsDataURL(file);
    setEditField(prev => ({ ...prev, ['photo']: true }));
  };

  if (!isClient) return null;

  return (
    <div className={styles["tell-us-about-yourself-page"]}>
      <p>Email us at <strong><a href="mailto:invite@marathon-os.com">invite@marathon-os.com</a></strong>
        from the above email address with this code for any queries or support.</p>
      <div
        className={styles["unique-code"]}

        style={{ cursor: 'pointer', marginTop: '1.5rem' }}
      >
        Unique Code: {userUuid} <ContentCopyIcon onClick={() => {
          if (userUuid) {
            navigator.clipboard.writeText(userUuid);
            toast.success("Unique code copied to clipboard!");
          }
        }} />
      </div>
      <h2>Your Profile</h2>
      <input type="file" ref={photoInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: 'column', justifyContent: 'center' }}>
          <div className={styles["photo-upload"]} onClick={handleClick}>
            <div style={{
              width: '20px',
              height: '20px',
              position: 'absolute',
              bottom: '12px',
              right: '0px',
              backgroundColor: '#610bee',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/plus.svg' alt="plus" width={20} height={20} />
            </div>
            {user.photo ? (
              !user.photo.startsWith('data') ? (
                <NameProfile userName={user.name} memberPhoto={user.photo} width={100} />
              ) : (
                <Image src={user.photo} alt="User Photo" width={100} height={100} style={{ borderRadius: '50%' }} />
              )
            ) : (
              <Image src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/profile-empty.png' alt="User Photo" width={100} height={100} style={{ borderRadius: '50%' }} />
            )}


          </div>
          {/* Photo Upload Section */}
          {editField['photo'] && <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => updateField('photo')}>
              <Image title='save' src={`${ASSET_PREFIX_URL}save-details.png`} alt="save" width={20} height={20} />
            </button>
            <button
              onClick={() => {
                const original = localStorage.getItem(`user_${'photo'}`) || '';
                setUser((prev) => ({ ...prev, ['photo']: original }));
                setEditField((prev) => ({ ...prev, ['photo']: false }));
                setErrors((prev) => ({ ...prev, ['photo']: '' }));
              }}
            >
              <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} title='cancel' alt="cancel" width={20} height={20} />
            </button>
          </div>}


        </div>

        {/* Form Fields Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: 'column' }}>
          {['name', 'email'].map((field) => (
            <div
              key={field}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <input
                style={{ flexGrow: 1 }}
                value={user[field]}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                disabled={isProfileComplete && !editField[field]} // Editable always if profile is not yet complete
                placeholder={`Enter your ${field}`}
              />

              {isProfileComplete && (
                <div style={{ minWidth: '150px', display: 'flex', gap: '0.5rem' }}>
                  {editField[field] ? (
                    <>
                      <button onClick={() => updateField(field)}>
                        <Image src={`${ASSET_PREFIX_URL}save-details.png`} title='save' alt="save" width={20} height={20} />
                      </button>
                      <button
                        onClick={() => {
                          const original = localStorage.getItem(`user_${field}`) || '';
                          setUser((prev) => ({ ...prev, [field]: original }));
                          setEditField((prev) => ({ ...prev, [field]: false }));
                          setErrors((prev) => ({ ...prev, [field]: '' }));
                        }}
                      >
                        <Image title='cancel' src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={20} height={20} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditField((prev) => ({ ...prev, [field]: true }))}>
                      <Image src={`${ASSET_PREFIX_URL}edit-ticket.png`} alt="edit" width={20} height={20} />
                    </button>
                  )}
                </div>
              )}
              {errors[field] && <p style={{ color: 'red' }}>{errors[field]}</p>}
            </div>
          ))}

          {/* Save Profile Button only shown when no localStorage data exists */}

        </div>

      </div>
      {!isProfileComplete && (
        <button onClick={updateField} className={styles['save-profile']}>
          Save Profile
        </button>
      )}








      <hr className="my-8" />
    </div>
  );
}

export default TellUsAboutYourself;
