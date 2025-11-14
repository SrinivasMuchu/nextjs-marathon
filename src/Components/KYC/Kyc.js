"use client"
import React, { useState, useEffect } from 'react';
import styles from './Kyc.module.css';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { toast } from 'react-toastify';
import PopupWrapper from '../CommonJsx/PopupWrapper';
import Select from 'react-select'; // Add this import
import SignPad from './SignPad';

function Kyc({ onClose,setUser }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ifsc: '',
    account_number: '',
    contact: '',
    signature: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
 

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!formData.ifsc.trim()) {
      newErrors.ifsc = 'IFSC code is required';
    } else if (!ifscPattern.test(formData.ifsc.trim())) {
      newErrors.ifsc = 'Invalid IFSC code format';
    }

    if (!formData.account_number.trim()) {
      newErrors.account_number = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(formData.account_number.trim())) {
      newErrors.account_number = 'Account number must be 9-18 digits';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.contact.trim())) {
      newErrors.contact = 'Invalid mobile number';
    }

   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSignatureCapture = (signatureData) => {
    setFormData(prev => ({
      ...prev,
      signature: signatureData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.signature) {
      toast.error('Please provide your signature before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${BASE_URL}/v1/payment/verify-seller`, {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        ifsc: formData.ifsc.trim().toUpperCase(),
        account_number: formData.account_number.trim(),
        signature: formData.signature, // Include signature data
      }, {
        headers: { 'user-uuid': localStorage.getItem('uuid') }
      });

      if (response.data.meta.success) {
        toast.success(response.data.meta.message || 'KYC submitted successfully!');
        
        // Update user's kyc_status to SUCCESS
        setUser(prevUser => ({
          ...prevUser,
          kycStatus: 'SUCCESS'
        }));
        
        onClose()
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

  return (
    <PopupWrapper>
      <div className={styles.popupContainer}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>
            {currentStep === 1 ? 'Verify your bank details' : 'Digital Signature'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose || (() => {})}>&times;</button>
        </div>
        
        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Bank Details</span>
          </div>
          <div className={styles.stepLine}></div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Signature</span>
          </div>
        </div>
        
        <p className={styles.subtitle}>
          {currentStep === 1 
            ? 'Selling CAD files on Marathon works when you have an Indian bank account. Currently we collect money from buyer and transfer to your bank account (India).'
            : 'Please provide your digital signature to complete the KYC process.'
          }
        </p>

        {currentStep === 1 ? (
          <form onSubmit={handleNext} className={styles.form}>
            <div className={styles.formRow}>
              {/* Name */}
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Account Holder</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Enter your name as per Bank Account"
                
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              {/* Bank - Placeholder for now */}
              
            </div>

            <div className={styles.formRow}>
              {/* Account Number */}
              <div className={styles.inputGroup}>
                <label htmlFor="account_number" className={styles.label}>Account number</label>
                <input
                  type="text"
                  id="account_number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.account_number ? styles.inputError : ''}`}
                  placeholder="Enter your bank account number"
                  maxLength={18}
                  
                />
                {errors.account_number && <span className={styles.errorText}>{errors.account_number}</span>}
              </div>

              {/* IFSC Code */}
              <div className={styles.inputGroup}>
                <label htmlFor="ifsc" className={styles.label}>IFSC Code</label>
                <input
                  type="text"
                  id="ifsc"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.ifsc ? styles.inputError : ''}`}
                  placeholder="Enter your bank IFSC code"
                  maxLength={11}
                  // style={{ textTransform: 'uppercase' }}
                  
                />
                {errors.ifsc && <span className={styles.errorText}>{errors.ifsc}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              {/* Contact */}
              <div className={styles.inputGroup}>
                <label htmlFor="contact" className={styles.label}>Mobile Number</label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
                  placeholder="Enter your bank account number"
                  maxLength={10}
                  
                />
                {errors.contact && <span className={styles.errorText}>{errors.contact}</span>}
              </div>

              {/* Aadhar */}
             
            </div>

            {/* PAN */}
            {/* <div className={styles.formRow}>
              <label htmlFor="pan" className={styles.label}>PAN Number</label>
              <input
                type="text"
                id="pan"
                name="pan"
                value={formData.pan}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.pan ? styles.inputError : ''}`}
                placeholder="Enter your bank account number"
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
                disabled={hasExistingData}
              />
              {errors.pan && <span className={styles.errorText}>{errors.pan}</span>}
            </div> */}

            {/* Next Button */}
            <button
              type="submit"
              className={`${styles.submitBtn}`}
            >
              Next: Add Signature
            </button>
          </form>
        ) : (
          <div className={styles.signatureSection}>
            <SignPad onSignatureCapture={handleSignatureCapture} />
            
            <div className={styles.signatureActions}>
              <button
                type="button"
                onClick={handleBack}
                className={`${styles.backBtn}`}
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Complete KYC'}
              </button>
            </div>
          </div>
        )}
         
       
      </div>
    </PopupWrapper>
  );
}

export default Kyc;