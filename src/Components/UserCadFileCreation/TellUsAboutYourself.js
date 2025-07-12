'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './UserCadFileUpload.module.css';
import Image from 'next/image';
import { toast } from 'react-toastify';
import NameProfile from "@/Components/CommonJsx/NameProfile";
import axios from 'axios';
import { contextState } from '../CommonJsx/ContextProvider';
import { BASE_URL, ASSET_PREFIX_URL, CAD_PUBLISH_EVENT } from '@/config';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CadFileNotifyPopUp from '../CommonJsx/CadFileNotifyPopUp';
function TellUsAboutYourself() {
  const photoInputRef = useRef(null);
  const [isApiSlow, setIsApiSlow] = useState(false);
  const { setHasUserEmail } = useContext(contextState);
  const [isUserPhoto, setIsUserPhoto] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userUuid, setUserUuid] = useState('');
  const [userAccessKey, setUserAccessKey] = useState(false);
  const [user, setUser] = useState({ name: '', email: '', photo: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [editField, setEditField] = useState({ name: false, email: false });
  const [signingUp, setSigningUp] = useState(false);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (isClient) {
      const uuid = localStorage.getItem('uuid') || '';
      setUserUuid(uuid);

      getUserDetails(uuid);
      if (localStorage.getItem('user_access_key')) {
        setUserAccessKey(true);
      }
      if (localStorage.getItem('user_photo')) {
        setIsUserPhoto(true);
      }

    }
  }, [isClient, isApiSlow]);

  const getUserDetails = async (uuid) => {
    try {

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

        if (data?.user_email && data?.full_name) {
          localStorage.setItem('user_email', data.user_email);
          localStorage.setItem('user_name', data.full_name);
          data.photo ? localStorage.setItem('user_photo', data.photo) : null;
          // if (localStorage.getItem('user_email')) {
          // console.log('User email found in localStorage');
          setHasUserEmail(true);
          // }
          setIsProfileComplete(true);
        }
      }
    }
    catch (err) {
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
    const nameError = validate('name', user.name);
    const emailError = validate('email', user.email);

    setErrors({ name: nameError, email: emailError });

    if (nameError || emailError) {
      toast.error("Please fix validation errors.");
      return;
    }
    const error = validate(field, user[field]);
    if (error) {
      console.log('error')
      setErrors(prev => ({ ...prev, [field]: error }));
    }
setSigningUp(true)

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
        sendGAtagEvent('publish_cad_profile_complete',CAD_PUBLISH_EVENT)
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

        getUserDetails(userUuid);
      }else{
        setErrors(prev => ({ ...prev, ['email']: response.data.meta.message  }));
      }
      setSigningUp(false)
    } catch (err) {
      setSigningUp(false)
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
    setEditField(prev => ({ ...prev, ['photo']: localStorage.getItem('user_name') ? true : false }));
  };

  if (!isClient) return null;


  const handleChangeBrowserNotification = (e) => {
    const isChecked = e.target.checked;
    setIsApiSlow(!isApiSlow);
    if (isChecked) {
      // Logic to enable browser notifications
      setIsApiSlow(true);
    }
  }
  return (
    <>
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
        <input
          type="file"
          ref={photoInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileUpload}
        />


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
                justifyContent: 'center',

              }}>
                <Image src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/plus.svg' alt="plus" width={20} height={20} />
              </div>
              {user.photo ? (
                !user.photo.startsWith('data') ? (
                  <NameProfile userName={user.name} memberPhoto={user.photo} width={100} />
                ) : (
                  <Image src={user.photo} alt="User Photo" width={100} height={100} style={{
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }} />
                )
              ) : (
                <Image src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/profile-empty.png' alt="User Photo" width={100} height={100} style={{ borderRadius: '50%' }} />
              )}


            </div>
            {/* Photo Upload Section */}
            {(editField['photo']) && <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
            {['name', 'email'].map((field) => (
              <>
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
               
              </div>
               {errors[field] && <p style={{ color: 'red' }}>{errors[field]}</p>}
              </>
              
            ))}
            {/* {(isProfileComplete && userAccessKey) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                width: '100%',
                justifyContent: 'space-between',
              }}>
               
                <label className="flex items-center gap-2 cursor-pointer">
                  Browser notification setup
                  <input
                    type="checkbox"
                    className="sr-only"


                  />
                  <div className="w-10 h-5 rounded-full bg-blue-600 relative transition-colors">
                    <div
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform translate-x-5 transition-transform"
                    />
                  </div>


                </label>




              </div>

            )} */}
            {/* Save Profile Button only shown when no localStorage data exists */}

          </div>

        </div>
        {!isProfileComplete && (
          <>




            <button onClick={updateField} className={styles['save-profile']} disabled={signingUp}>
              {signingUp ?'Saving Profile':'Save Profile'}
            </button>


          </>

        )}

      </div>
      {isApiSlow && <CadFileNotifyPopUp setIsApiSlow={setIsApiSlow} action='profile' />}
    </>

  );
}

export default TellUsAboutYourself;
