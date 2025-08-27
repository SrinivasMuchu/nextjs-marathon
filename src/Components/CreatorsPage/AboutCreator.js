"use client"
import React, { useState, useContext } from 'react'
import styles from './Creators.module.css'
import Image from 'next/image';
import { ASSET_PREFIX_URL, BASE_URL } from '@/config';
import { contextState } from '../CommonJsx/ContextProvider';
import axios from 'axios';

function AboutCreator({ creatorId,setIsVerified }) {
  const { user, setUser, setUpdatedDetails,viewer } = useContext(contextState);
  const [editField, setEditField] = useState({
    description: false,
    skills: false,
    website: false,
    linkedin: false
  });
  const profileData = !creatorId ? user : viewer;

  const [inputValue, setInputValue] = useState("");
  const [originalValues, setOriginalValues] = useState({
    description: user?.desc,
    skills: user?.skills,
    website: user?.website,
    linkedin: user?.linkedin,
  });
  const [validationErrors, setValidationErrors] = useState({ website: '', linkedin: '' });

  const handleEditClick = (field) => {
    if(!localStorage.getItem('is_verified')){
      setIsVerified(true)
      return
    }
    // Save original value before editing
    setOriginalValues(prev => ({
      ...prev,
      [field]: field === "description" ? user.desc : user[field]
    }));
    setEditField(prev => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field, value) => {
    // Map the field names correctly
    if (field === "description") {
      setUser(prev => ({ ...prev, desc: value }));
    } else {
      setUser(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveField = async (field) => {
    // Validation for website
    if (field === 'website' && user.website) {
      if (!isValidUrl(user.website)) {
        setValidationErrors(prev => ({ ...prev, website: 'Please enter a valid website URL.' }));
        return;
      } else {
        setValidationErrors(prev => ({ ...prev, website: '' }));
      }
    }
    // Validation for linkedin
    if (field === 'linkedin' && user.linkedin) {
      if (!isValidUrl(user.linkedin)) {
        setValidationErrors(prev => ({ ...prev, linkedin: 'Please enter a valid LinkedIn URL.' }));
        return;
      }
      if (!user.linkedin.startsWith('https://www.linkedin.com/')) {
        setValidationErrors(prev => ({ ...prev, linkedin: 'LinkedIn URL must start with https://www.linkedin.com/' }));
        return;
      }
      setValidationErrors(prev => ({ ...prev, linkedin: '' }));
    }

    try {
      const uuid = localStorage.getItem('uuid');
      const response = await axios.post(`${BASE_URL}/v1/cad-creator/create-creator-profile`, {
        creator_des: user.desc,
        creator_specific_cad_category: user.skills,
        website_url: user.website,
        linkedin_url: user.linkedin
      }, {
        headers: { 'user-uuid': uuid }
      });

      if (response.data.meta.success) {
        setUpdatedDetails(user);
        setEditField(prev => ({ ...prev, [field]: false }));
        setInputValue("");
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
    }
  };

  const handleCancelEdit = (field) => {
    // Restore original value
    if (field === "description") {
      setUser(prev => ({ ...prev, desc: originalValues.description }));
    } else if (field === "skills") {
      setUser(prev => ({ ...prev, skills: originalValues.skills }));
    } else {
      setUser(prev => ({ ...prev, [field]: originalValues[field] }));
    }
    setEditField(prev => ({ ...prev, [field]: false }));
    setInputValue("");
  };

  // Skills handling
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim() && !user.skills?.includes(inputValue.trim())) {
        setUser(prev => ({ 
          ...prev, 
          skills: [...(prev.skills || []), inputValue.trim()] 
        }));
      }
      setInputValue("");
    }
  };

  const removeSkill = (skill) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill) || []
    }));
  };

  // Helper function to check if a string is a valid URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Check if user has typed something to show save/cancel buttons
  const shouldShowActions = (field) => {
    if (field === 'skills') {
      const hasSkills = user.skills && user.skills.length > 0;
      const hasInput = inputValue.trim() !== "";
      return hasSkills || hasInput;
    }
    
    // Fix the field mapping for shouldShowActions
    if (field === 'description') {
      const value = user.desc || '';
      return value.trim() !== '';
    }
    
    const value = user[field] || '';
    return value.trim() !== '';
  };

  // Render URL field - either as text/link or input
  const renderUrlField = (url, isEditing, fieldName, placeholder) => {
    if (isEditing) {
      return (
        <>
          <input
            type="url"
            value={url || ''}
            onChange={(e) => {
              handleInputChange(fieldName, e.target.value);
              setValidationErrors(prev => ({ ...prev, [fieldName]: '' })); // Clear error on change
            }}
            placeholder={placeholder}
            className={styles.editInput}
            style={{ color: '#610bee' }}
            autoFocus
          />
          {validationErrors[fieldName] && (
            <div className={styles.validationError}>{validationErrors[fieldName]}</div>
          )}
        </>
      );
    }

    // Display mode - show as text/link
    if (!url || url.trim() === "") {
      return (
        <span style={{ color: '#999', fontStyle: 'italic' }}>
          {placeholder}
        </span>
      );
    }

    if (isValidUrl(url)) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#610bee',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {url}
        </a>
      );
    }

    return (
      <span style={{ color: '#610bee' }}>
        {url}
      </span>
    );
  };

  return (
    <div className={styles.aboutContainer}>

      {/* Description */}
      <div
        className={`${styles.editableField} ${editField.description ? styles.editingBorder : styles.editableBorder}`}
        onClick={() => !creatorId && !editField.description && handleEditClick("description")}
        style={{ cursor: !creatorId ? 'pointer' : 'default' }}
      >
        {!creatorId ? (
          <div className={styles.fieldEdit}>
            <div className={styles.inputWrapper}>
              {!editField.description ? (
                <span style={{ color: profileData.desc ? '#000' : '#999', fontStyle: 'normal' }}>
                  {profileData.desc || 'Write about you'}
                </span>
              ) : (
                <textarea
                  value={profileData.desc || ''}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter description about yourself"
                  className={styles.editTextarea}
                  rows={4}
                  autoFocus
                  onClick={e => e.stopPropagation()}
                />
              )}
            </div>
            {editField.description && shouldShowActions('description') && (
              <div className={styles.editActions}>
                <button onClick={() => handleSaveField("description")}>
                  <Image src={`${ASSET_PREFIX_URL}save-details.png`} alt="save" width={16} height={16}/>
                </button>
                <button onClick={() => handleCancelEdit("description")}>
                  <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={16} height={16}/>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.fieldEdit}>
            <div className={styles.inputWrapper}>
              <span style={{ color: profileData.desc ? '#000' : '#999', fontStyle: 'normal' }}>
                {profileData.desc}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div
        className={`${styles.editableField} ${editField.skills ? styles.editingBorder : styles.editableBorder}`}
        onClick={() => !creatorId && !editField.skills && handleEditClick("skills")}
        style={{ cursor: !creatorId ? 'pointer' : 'default' }}
      >
        {!creatorId ? (
          <div className={styles.fieldEdit}>
            <div className={styles.inputWrapper}>
              {!editField.skills ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <div key={index} className={styles.tag}>{skill}</div>
                    ))
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>
                      Add tools & skills (comma separated)
                    </span>
                  )}
                </div>
              ) : (
                <div className={styles.tagsWrapper} onClick={e => e.stopPropagation()}>
                  {profileData.skills && profileData.skills.length > 0 && profileData.skills.map((skill, index) => (
                    <div key={index} className={styles.tag}>
                      {skill}
                      <button className={styles.removeBtn} onClick={() => removeSkill(skill)}>✕</button>
                    </div>
                  ))}
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Add tools & skills (comma separated)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>
              )}
            </div>
            {editField.skills && shouldShowActions('skills') && (
              <div className={styles.editActions}>
                <button onClick={() => handleSaveField("skills")}>
                  <Image src={`${ASSET_PREFIX_URL}save-details.png`} alt="save" width={16} height={16}/>
                </button>
                <button onClick={() => handleCancelEdit("skills")}>
                  <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={16} height={16}/>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.fieldEdit}>
            <div className={styles.inputWrapper}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {profileData.skills && profileData.skills.length > 0 && (
                  profileData.skills.map((skill, index) => (
                    <div key={index} className={styles.tag}>{skill}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Website */}
      {!creatorId && (
        <div
          className={`${styles.editableField} ${editField.website ? styles.editingBorder : styles.editableBorder}`}
          onClick={() => !editField.website && handleEditClick("website")}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.fieldEdit}>
            <div className={styles.inputWrapper}>
              {renderUrlField(profileData.website, editField.website, "website", "Enter your website URL")}
            </div>
            {editField.website && shouldShowActions('website') && (
              <div className={styles.editActions}>
                <button onClick={() => handleSaveField("website")}>
                  <Image src={`${ASSET_PREFIX_URL}save-details.png`} alt="save" width={16} height={16}/>
                </button>
                <button onClick={() => handleCancelEdit("website")}>
                  <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={16} height={16}/>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LinkedIn */}
      {!creatorId && (
        <div
          className={`${styles.editableField} ${editField.linkedin ? styles.editingBorder : styles.editableBorder}`}
          onClick={() => !editField.linkedin && handleEditClick("linkedin")}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.fieldEdit}>
            <div className={styles.inputWrapper}>
              {renderUrlField(profileData.linkedin, editField.linkedin, "linkedin", "Enter your LinkedIn profile URL")}
            </div>
            {editField.linkedin && shouldShowActions('linkedin') && (
              <div className={styles.editActions}>
                <button onClick={() => handleSaveField("linkedin")}>
                  <Image src={`${ASSET_PREFIX_URL}save-details.png`} alt="save" width={16} height={16}/>
                </button>
                <button onClick={() => handleCancelEdit("linkedin")}>
                  <Image src={`${ASSET_PREFIX_URL}cancel-detail.png`} alt="cancel" width={16} height={16}/>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* For viewer mode */}
      {creatorId && (
        <>
          <div className={styles.editableField}>
            <div className={styles.fieldEdit}>
              <div className={styles.inputWrapper}>
                {renderUrlField(profileData.website, false, "website")}
              </div>
            </div>
          </div>
          <div className={styles.editableField}>
            <div className={styles.fieldEdit}>
              <div className={styles.inputWrapper}>
                {renderUrlField(profileData.linkedin, false, "linkedin")}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AboutCreator;
