"use client"
import React, { useState, useEffect } from 'react';
import styles from './Kyc.module.css';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { toast } from 'react-toastify';

function Kyc() {
  const [formData, setFormData] = useState({
    name: '',
    ifsc: '',
    account_number: '',
    contact: '',
    aadhar: '',
    pan: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    fetchSellerDetails();
  }, []);

  const fetchSellerDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/v1/payment/get-seller-details`, {
        headers: { 'user-uuid': localStorage.getItem('uuid') }
      });

      if (response.data.meta.success && response.data.data) {
        const data = response.data.data;
        setFormData({
          name: data.account_details.name || '',
          ifsc: data.account_details.ifsc || '',
          account_number: data.account_details.account_number || '',
          contact: data.user_data.phone_number || '',
          aadhar: data.user_data.aadhaar || '',
          pan: data.user_data.pan || ''
        });
        setHasExistingData(true);
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
      // If no data or error, allow user to create new
      setHasExistingData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // IFSC validation
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!formData.ifsc.trim()) {
      newErrors.ifsc = 'IFSC code is required';
    } else if (!ifscPattern.test(formData.ifsc.trim())) {
      newErrors.ifsc = 'Invalid IFSC code format';
    }

    // Account number validation
    if (!formData.account_number.trim()) {
      newErrors.account_number = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(formData.account_number.trim())) {
      newErrors.account_number = 'Account number must be 9-18 digits';
    }

    // Contact validation
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.contact.trim())) {
      newErrors.contact = 'Invalid mobile number';
    }

    // Aadhar validation
    if (!formData.aadhar.trim()) {
      newErrors.aadhar = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadhar.trim())) {
      newErrors.aadhar = 'Aadhar must be 12 digits';
    }

    // PAN validation
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.pan.trim()) {
      newErrors.pan = 'PAN number is required';
    } else if (!panPattern.test(formData.pan.trim().toUpperCase())) {
      newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${BASE_URL}/v1/payment/verify-seller`, {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        ifsc: formData.ifsc.trim().toUpperCase(),
        account_number: formData.account_number.trim(),
        aadhaar: formData.aadhar.trim(),
        pan: formData.pan.trim().toUpperCase()
      }, {
        headers: { 'user-uuid': localStorage.getItem('uuid') }
      });

      if (response.data.meta.success) {
        toast.success(response.data.meta.message || 'KYC submitted successfully!');
        setHasExistingData(true);
      } else {
        toast.error(response.data.meta.message || 'Failed to submit KYC. Please try again.');
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      toast.error(error.response?.data?.meta?.message || 'Failed to submit KYC. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.kycContainer}>
        <div className={styles.kycForm}>
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.kycContainer}>
      <div className={styles.kycForm}>
        <h2 className={styles.title}>
         KYC Details
        </h2>
        {/* {hasExistingData && (
          <div className={styles.infoMessage}>
            Your KYC details have been submitted and are under verification.
          </div>
        )} */}
        <form onSubmit={handleSubmit}>
          
          {/* Name */}
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Holder Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Enter your full name"
              disabled={hasExistingData}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* IFSC Code */}
          <div className={styles.inputGroup}>
            <label htmlFor="ifsc" className={styles.label}>IFSC Code *</label>
            <input
              type="text"
              id="ifsc"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.ifsc ? styles.inputError : ''}`}
              placeholder="e.g., KKBK0007529"
              maxLength={11}
              style={{ textTransform: 'uppercase' }}
              disabled={hasExistingData}
            />
            {errors.ifsc && <span className={styles.errorText}>{errors.ifsc}</span>}
          </div>

          {/* Account Number */}
          <div className={styles.inputGroup}>
            <label htmlFor="account_number" className={styles.label}>Account Number *</label>
            <input
              type="text"
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.account_number ? styles.inputError : ''}`}
              placeholder="Enter account number"
              maxLength={18}
              disabled={hasExistingData}
            />
            {errors.account_number && <span className={styles.errorText}>{errors.account_number}</span>}
          </div>

          {/* Contact */}
          <div className={styles.inputGroup}>
            <label htmlFor="contact" className={styles.label}>Mobile Number *</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
              placeholder="e.g., 9390333636"
              maxLength={10}
              disabled={hasExistingData}
            />
            {errors.contact && <span className={styles.errorText}>{errors.contact}</span>}
          </div>

          {/* Aadhar */}
          <div className={styles.inputGroup}>
            <label htmlFor="aadhar" className={styles.label}>Aadhar Number *</label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.aadhar ? styles.inputError : ''}`}
              placeholder="Enter 12-digit Aadhar number"
              maxLength={12}
              disabled={hasExistingData}
            />
            {errors.aadhar && <span className={styles.errorText}>{errors.aadhar}</span>}
          </div>

          {/* PAN */}
          <div className={styles.inputGroup}>
            <label htmlFor="pan" className={styles.label}>PAN Number *</label>
            <input
              type="text"
              id="pan"
              name="pan"
              value={formData.pan}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.pan ? styles.inputError : ''}`}
              placeholder="e.g., ABCDE1234F"
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
              disabled={hasExistingData}
            />
            {errors.pan && <span className={styles.errorText}>{errors.pan}</span>}
          </div>

          {/* Submit Button */}
          {!hasExistingData && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit KYC'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Kyc;