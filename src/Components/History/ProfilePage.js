'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './ProfilePage.module.css';
import Image from 'next/image';
import { toast } from 'react-toastify';
import NameProfile from "@/Components/CommonJsx/NameProfile";
import axios from 'axios';
import { contextState } from '../CommonJsx/ContextProvider';
import { BASE_URL, ASSET_PREFIX_URL, CAD_PUBLISH_EVENT } from '@/config';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailOTP from '../CommonJsx/EmailOTP';
import { sendGAtagEvent } from '@/common.helper';
import { FaCamera } from "react-icons/fa";
function ProfilePage() {
  const photoInputRef = useRef(null);
  const [isEmailVerify, setIsEmailVerify] = useState(false);
  const { setUser, user, isProfileComplete, setIsProfileComplete } = useContext(contextState);
  const [isClient, setIsClient] = useState(false);
  const [userUuid, setUserUuid] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [editField, setEditField] = useState({ name: false, email: false, photo: false });

  const [signingUp, setSigningUp] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalUser, setOriginalUser] = useState({ name: '', email: '', photo: '' });

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (isClient && originalUser.name === '' && originalUser.email === '' && originalUser.photo === '') {
      const uuid = localStorage.getItem('uuid') || '';
      setUserUuid(uuid);
      // Store original user data for cancel functionality - only set once
      setOriginalUser({ ...user });
    }
  }, [isClient, user]);

  const validate = (field, value) => {
    if (field === 'name') return value.trim() ? '' : 'Full name is required';
    if (field === 'email') {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? '' : 'Enter a valid email';
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value })
    setHasChanges(true);
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEditClick = (field) => {
    setEditField(prev => ({ ...prev, [field]: true }));
  };

  const handleSaveField = async (field) => {
    console.log(originalUser[field], user[field]);
    const error = validate(field, user[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return;
    }

    // Check if the field value hasn't changed
    if (user[field] === originalUser[field]) {
      setEditField(prev => ({ ...prev, [field]: false }));
      return;
    }
    console.log(field)

    try {
      if (!localStorage.getItem('is_verified') || field === 'email') {
        setIsEmailVerify(true);
        return;
      }
      if (field === 'email') {
        return;
      }


      setSigningUp(true);
      const uuid = localStorage.getItem('uuid');
      const response = await axios.post(`${BASE_URL}/v1/cad/create-user-details`, {
        user_email: user.email,
        full_name: user.name,
        photo: user.photo
      }, {
        headers: { 'user-uuid': uuid }
      });

      if (response.data.meta.success) {
        sendGAtagEvent({ event_name: 'publish_cad_profile_complete', event_category: CAD_PUBLISH_EVENT });
        toast.success(`${field} updated successfully`);
        setEditField(prev => ({ ...prev, [field]: false }));
        setErrors(prev => ({ ...prev, [field]: '' }));
        setOriginalUser({ ...user });
        setHasChanges(false);
        setIsEmailVerify(false);
      }
      setSigningUp(false);
    } catch (err) {
      setSigningUp(false);
      console.error(`Error updating ${field}:`, err);
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleCancelEdit = (field) => {
    setUser(prev => ({ ...prev, [field]: originalUser[field] }));
    setEditField(prev => ({ ...prev, [field]: false }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setHasChanges(false);
  };

  const saveProfileAfterVerification = async () => {
    try {

      if (!isProfileComplete) {
        setSigningUp(true);

        const uuid = localStorage.getItem('uuid');
        const response = await axios.post(`${BASE_URL}/v1/cad/create-user-details`, {
          user_email: user.email,
          full_name: user.name,
          photo: user.photo
        }, {
          headers: { 'user-uuid': uuid }
        });

        if (response.data.meta.success) {
          sendGAtagEvent({ event_name: 'publish_cad_profile_complete', event_category: CAD_PUBLISH_EVENT });
          toast.success('Profile updated successfully');
          setIsProfileComplete(true);
          // Reset all edit fields
          setEditField({ name: false, email: false });
          setErrors({ name: '', email: '' });
          setOriginalUser({ ...user });
          setHasChanges(false);
          setIsEmailVerify(false);
        }
        setSigningUp(false);
      } else {
        setSigningUp(true);




        sendGAtagEvent({ event_name: 'publish_cad_profile_complete', event_category: CAD_PUBLISH_EVENT });
        toast.success('Profile updated successfully');
        setIsProfileComplete(true);
        // Reset all edit fields
        setEditField({ name: false, email: false });
        setErrors({ name: '', email: '' });
        setOriginalUser({ ...user });
        setHasChanges(false);
        setIsEmailVerify(false);
        window.location.reload();
      }

    } catch (err) {
      setSigningUp(false);
      console.error('Error updating Profile:', err);
      toast.error('Failed to update Profile');
    }
  };

  const saveChanges = async () => {
    const nameError = validate('name', user.name);
    const emailError = validate('email', user.email);

    setErrors({ name: nameError, email: emailError });

    if (nameError || emailError) {
      toast.error("Please fix validation errors.");
      return;
    }

    try {
      if (!localStorage.getItem('is_verified')) {
        setIsEmailVerify(true);
      } else {
        setSigningUp(true);
        const uuid = localStorage.getItem('uuid');
        const response = await axios.post(`${BASE_URL}/v1/cad/create-user-details`, {
          user_email: user.email,
          full_name: user.name,
          photo: user.photo
        }, {
          headers: { 'user-uuid': uuid }
        });

        if (response.data.meta.success) {
          sendGAtagEvent({ event_name: 'publish_cad_profile_complete', event_category: CAD_PUBLISH_EVENT });
          toast.success(`Profile updated successfully`);
          setIsProfileComplete(true);
          setHasChanges(false);
          setOriginalUser({ ...user });
          setIsEmailVerify(false);
        }
        setSigningUp(false);
      }
    } catch (err) {
      setSigningUp(false);
      console.error(`Error updating Profile:`, err);
      toast.error(`Failed to update Profile`);
    }
  };

  const cancelChanges = () => {
    setUser({ ...originalUser });
    setHasChanges(false);
    setErrors({ name: '', email: '' });
  };

  const handleClick = () => photoInputRef.current?.click();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser(prev => ({ ...prev, photo: reader.result }));
      setHasChanges(true);
      setEditField(prev => ({ ...prev, photo: localStorage.getItem('is_verified') ? true : false }));
    };
    reader.readAsDataURL(file);
  };

  const copyUserID = () => {
    if (userUuid) {
      navigator.clipboard.writeText(userUuid);
      toast.success("User ID copied to clipboard!");
    }
  };

  if (!isClient) return null;

  return (
    <>
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          {/* Profile Photo Section */}
          <div className={styles.photoSection}>
            <input
              type="file"
              ref={photoInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileUpload}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: 'column', justifyContent: 'center' }}>
              <div className={styles["photo-upload"]} onClick={handleClick}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  position: 'absolute',
                  color: 'white',
                  bottom: '12px',
                  right: '0px',
                  background: '#610bee',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'

                }}>
                  <FaCamera />
                </div>
                {user.photo ? (
                  !user.photo.startsWith('data') ? (
                    <NameProfile userName={user.name} memberPhoto={user.photo} width={150} />
                  ) : (
                    <Image src={user.photo} alt="User Photo" width={150} height={150} style={{
                      borderRadius: '50%',
                      width: '150px',
                      height: '150px',
                      // objectFit: 'cover',
                    }} />
                  )
                ) : (
                  <Image src='https://marathon-web-assets.s3.ap-south-1.amazonaws.com/profile-empty.png' alt="User Photo" width={150} height={150} style={{ borderRadius: '50%' }} />
                )}


              </div>
              {/* Photo Upload Section */}
              {(editField['photo']) && <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleSaveField('photo')}>
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

            {/* Photo Save/Cancel Buttons */}
            {/* {editField.photo && (
              <div className={styles.photoActionButtons}>
                <button 
                  className={styles.saveIconButton}
                  onClick={() => handleSaveField('photo')}
                  disabled={signingUp}
                  title={signingUp ? 'Saving...' : 'Save'}
                >
                  <Image 
                    src={`${ASSET_PREFIX_URL}save-details.png`} 
                    alt="save" 
                    width={20} 
                    height={20} 
                  />
                </button>
                <button 
                  className={styles.cancelIconButton}
                  onClick={() => handleCancelEdit('photo')}
                  disabled={signingUp}
                >
                  <Image 
                    src={`${ASSET_PREFIX_URL}cancel-detail.png`} 
                    alt="cancel" 
                    width={20} 
                    height={20} 
                  />
                </button>
              </div>
            )} */}
          </div>

          {/* Form Fields */}
          <div className={styles.formSection}>
            {/* Full Name */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Enter your full name"
                  disabled={isProfileComplete && !editField.name}

                  style={{ backgroundColor: !editField.name ? '#f8f9fa' : 'white' }}
                />
                {isProfileComplete &&
                  <>
                    {!editField.name ? (
                      <button className={styles.editIcon} onClick={() => handleEditClick('name')}>
                        <Image
                          src={`${ASSET_PREFIX_URL}edit-ticket.png`}
                          alt="edit"
                          width={16}
                          height={16}
                        />
                      </button>
                    ) : (
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.saveIconButton}
                          onClick={() => handleSaveField('name')}
                          disabled={signingUp}
                          title={signingUp ? 'Saving...' : 'Save'}
                        >
                          <Image
                            src={`${ASSET_PREFIX_URL}save-details.png`}
                            alt="save"
                            width={16}
                            height={16}
                          />
                        </button>
                        <button
                          className={styles.cancelIconButton}
                          onClick={() => handleCancelEdit('name')}
                          disabled={signingUp}
                        >
                          <Image
                            src={`${ASSET_PREFIX_URL}cancel-detail.png`}
                            alt="cancel"
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>
                    )}
                  </>
                }

              </div>
              {errors.name && <p className={styles.errorText}>{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="Enter your email"
                  disabled={isProfileComplete && !editField.email}
                  style={{ backgroundColor: !editField.email ? '#f8f9fa' : 'white' }}
                />
                {isProfileComplete &&
                  <>
                    {!editField.email ? (
                      <button className={styles.editIcon} onClick={() => handleEditClick('email')}>
                        <Image
                          src={`${ASSET_PREFIX_URL}edit-ticket.png`}
                          alt="edit"
                          width={16}
                          height={16}
                        />
                      </button>
                    ) : (
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.saveIconButton}
                          onClick={() => handleSaveField('email')}
                          disabled={signingUp}
                          title={signingUp ? 'Saving...' : 'Save'}
                        >
                          <Image
                            src={`${ASSET_PREFIX_URL}save-details.png`}
                            alt="save"
                            width={16}
                            height={16}
                          />
                        </button>
                        <button
                          className={styles.cancelIconButton}
                          onClick={() => handleCancelEdit('email')}
                          disabled={signingUp}
                        >
                          <Image
                            src={`${ASSET_PREFIX_URL}cancel-detail.png`}
                            alt="cancel"
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>
                    )}
                  </>}
              </div>
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
              {localStorage.getItem('user_email') && !localStorage.getItem('is_verified') && (
                <button
                  className={styles.verifyButton}
                  onClick={() => setIsEmailVerify(true)}
                >
                  verify
                </button>
              )}
              {!localStorage.getItem('user_email') && !localStorage.getItem('is_verified') && (
                <button
                  className={styles.verifyButton}
                  onClick={() => setIsEmailVerify(true)}
                >
                  verify
                </button>
              )}

            </div>

            {/* User ID */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>User ID</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={localStorage.getItem('uuid')}
                  className={styles.input}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
                <button className={styles.copyButton} onClick={copyUserID}>
                  <ContentCopyIcon style={{ fontSize: 16 }} />
                  Copy
                </button>
              </div>
            </div>
            {!isProfileComplete && (
              <button
                className={styles.saveProfileButton}
                onClick={saveChanges}
                disabled={signingUp}
              >
                {signingUp ? 'Saving Profile...' : 'Save Profile Details'}
              </button>
            )}
          </div>
        </div>
      </div>

      {isEmailVerify && (
        <EmailOTP
          email={user.email}
          saveDetails={saveProfileAfterVerification}
          setIsEmailVerify={setIsEmailVerify}
          setError={setErrors}
          type='publish'
        />
      )}
    </>
  );
}

export default ProfilePage;
