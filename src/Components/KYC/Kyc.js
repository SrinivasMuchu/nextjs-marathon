"use client"
import React, { useState, useEffect } from 'react';
import styles from './Kyc.module.css';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { toast } from 'react-toastify';
import PopupWrapper from '../CommonJsx/PopupWrapper';
import BankLoader from '../CommonJsx/Loaders/BankLoader';
import Select from 'react-select'; // Add this import
import SignPad from './SignPad';
import ReactPhoneNumber from '../CommonJsx/ReactPhoneNumber';

function Kyc({ onClose, setUser }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ifsc: '',
    account_number: '',
    phone: '',
    gst_number: '', // Added GST number field
    signature: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [pollError, setPollError] = useState('');
  const [pollMessage, setPollMessage] = useState('Validation is being processed...');

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

    if (!formData.phone.trim()) {
      newErrors.phone = 'phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Invalid mobile number';
    }

    // GST number validation (optional but must be valid if provided)
    if (formData.gst_number.trim()) {
      const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstPattern.test(formData.gst_number.trim())) {
        newErrors.gst_number = 'Invalid GST number format';
      }
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

  // Polling function
  const pollValidationStatus = async (validationId) => {
    setIsPolling(true);
    setPollError('');
    setPollMessage('Validation is being processed...');
    let intervalId = null;

    const poll = async () => {
      try {
        const pollResponse = await axios.get(
          `${BASE_URL}/v1/payment/poll-seller-validation/${validationId}`,
          {
            headers: { 'user-uuid': localStorage.getItem('uuid') }
          }
        );
        const status = pollResponse.data?.data?.status;
        if (status === 'COMPLETED') {
          setIsPolling(false);
          setPollMessage('');
          toast.success(pollResponse.data.meta.message || 'KYC verification completed!');
          setUser(prevUser => ({
            ...prevUser,
            kycStatus: 'SUCCESS'
          }));
          clearInterval(intervalId);
          onClose();
        } else if (status === 'FAILED') {
          setIsPolling(false);
          setPollError('KYC verification failed. Please try again.');
          clearInterval(intervalId);
        }
        // else keep polling
      } catch (error) {
        setIsPolling(false);
        setPollError('Error while polling validation status.');
        clearInterval(intervalId);
      }
    };

    // Start polling every 3 seconds
    intervalId = setInterval(poll, 3000);
    // Call immediately for the first time
    poll();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.signature) {
      toast.error('Please provide your signature before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        ifsc: formData.ifsc.trim().toUpperCase(),
        account_number: formData.account_number.trim(),
        signature: formData.signature,
      };

      if (formData.gst_number.trim()) {
        payload.gst = formData.gst_number.trim().toUpperCase();
      }

      const response = await axios.post(`${BASE_URL}/v1/payment/verify-seller`, payload, {
        headers: { 'user-uuid': localStorage.getItem('uuid') }
      });

      if (response.data.meta.success) {
        const validationId = response.data.data.validation.id;
        console.log('Validation ID:', validationId);
        pollValidationStatus(validationId); // Start polling
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
    <>
      {isPolling && <BankLoader />}
      <PopupWrapper>
        <div className={styles.popupContainer}>
          {pollError && (
            <div style={{
              width: '100%',
              padding: '10px',
              background: '#fee2e2',
              color: '#dc2626',
              textAlign: 'center',
              fontWeight: 'bold',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              {pollError}
            </div>
          )}
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
                  />
                  {errors.ifsc && <span className={styles.errorText}>{errors.ifsc}</span>}
                </div>
              </div>
              <div className={styles.formRow}>
                {/* phone */}
                <div className={styles.inputGroup}>
                  <label htmlFor="phone" className={styles.label}>Mobile Number</label>
                  <ReactPhoneNumber
                    phoneNumber={formData.phone}
                    setPhoneNumber={val => {
                      setFormData(prev => ({ ...prev, phone: val || '' }));
                      if (errors.phone) {
                        setErrors(prev => ({ ...prev, phone: '' }));
                      }
                    }}
                    height={true}
                    styles={styles}
                    classname="input"
                    label="Mobile Number"
                    id="phone"
                  />
                  {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>
                {/* GST Number */}
                <div className={styles.inputGroup}>
                  <label htmlFor="gst_number" className={styles.label}>
                    GST Number <span className={styles.optional}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="gst_number"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.gst_number ? styles.inputError : ''}`}
                    placeholder="Enter your GST number"
                    maxLength={15}
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.gst_number && <span className={styles.errorText}>{errors.gst_number}</span>}
                  <small className={styles.helpText}>
                    Format: 22AAAAA0000A1Z5 (15 characters)
                  </small>
                </div>
              </div>
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
    </>
  );
}

export default Kyc;