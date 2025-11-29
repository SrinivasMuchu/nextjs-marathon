"use client"
import React, { useState, useEffect } from 'react';
import styles from './KycDetails.module.css';
import axios from 'axios';
import { BASE_URL } from '@/config';
import { toast } from 'react-toastify';
import Loading from '../CommonJsx/Loaders/Loading';
import Kyc from './Kyc';
import Image from 'next/image';
import UserLoginPupUp from '../CommonJsx/UserLoginPupUp';

function KycTab() {
   const [formData, setFormData] = useState({
    name: '',
    ifsc: '',
    account_number: '',
    contact: '',
    aadhar: '',
    pan: '',
    gst_number: '',
    signature_url: '' // Add this line for signature image
  });
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [showKycForm, setShowKycForm] = useState(false);

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
          pan: data.user_data.pan || '',
          gst_number:  data.user_data.gst || '',
          signature_url: data.user_data.signature_s3_url || '' // Add this line
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

  const handleOpenKycForm = () => {
     if(!localStorage.getItem('is_verified')){
      setIsUserVerified(true)
    }else{
      setShowKycForm(true);
    }
    
  };

  const handleCloseKycForm = () => {
    setShowKycForm(false);
    // Refresh data after KYC submission
    fetchSellerDetails();
  };

  const setUser = (userUpdateFn) => {
    // Handle user update if needed
    console.log('User updated:', userUpdateFn);
  };

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  // Show button if no existing data
  if (!hasExistingData) {
    return (
      <>
      {isUserVerified && <UserLoginPupUp type='dashboard'
       onClose={() => setIsUserVerified(false)} />}
      <div className={styles.kycContainer}>
        <div className={styles.kycForm}>
          <h2 className={styles.title}>KYC Details</h2>
          <div className={styles.noDataContainer}>
            <p className={styles.noDataText}>
              Complete your KYC verification to start selling CAD files on Marathon.
            </p>
            <button 
              onClick={handleOpenKycForm}
              className={styles.createKycBtn}
            >
              Complete KYC Verification
            </button>
          </div>
        </div>
        
        {showKycForm && (
          <Kyc 
            onClose={handleCloseKycForm}
            setUser={setUser}
          />
        )}
      </div>
      </>
      
    );
  }

  // Show non-editable form when data exists
  return (
    <div className={styles.kycContainer}>
      <div className={styles.kycForm}>
        <h2 className={styles.title}>KYC Details</h2>
        {/* <div className={styles.infoMessage}>
          Your KYC details have been submitted and are verified.
        </div> */}
        
        <form>
          {/* Name */}
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Holder Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              className={`${styles.input} ${styles.readonlyInput}`}
              readOnly
            />
          </div>

          {/* IFSC Code */}
          <div className={styles.inputGroup}>
            <label htmlFor="ifsc" className={styles.label}>IFSC Code</label>
            <input
              type="text"
              id="ifsc"
              name="ifsc"
              value={formData.ifsc}
              className={`${styles.input} ${styles.readonlyInput}`}
              readOnly
            />
          </div>

          {/* Account Number */}
          <div className={styles.inputGroup}>
            <label htmlFor="account_number" className={styles.label}>Account Number</label>
            <input
              type="text"
              id="account_number"
              name="account_number"
              value={formData.account_number}
              className={`${styles.input} ${styles.readonlyInput}`}
              readOnly
            />
          </div>

          {/* Contact */}
          <div className={styles.inputGroup}>
            <label htmlFor="contact" className={styles.label}>Mobile Number</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              className={`${styles.input} ${styles.readonlyInput}`}
              readOnly
            />
          </div>

          {/* GST Number - Show if exists */}
          {formData.gst_number && (
            <div className={styles.inputGroup}>
              <label htmlFor="gst_number" className={styles.label}>GST Number</label>
              <input
                type="text"
                id="gst_number"
                name="gst_number"
                value={formData.gst_number}
                className={`${styles.input} ${styles.readonlyInput}`}
                readOnly
              />
            </div>
          )}

          {/* Show Aadhar and PAN if they exist */}
          {formData.aadhar && (
            <div className={styles.inputGroup}>
              <label htmlFor="aadhar" className={styles.label}>Aadhar Number</label>
              <input
                type="text"
                id="aadhar"
                name="aadhar"
                value={formData.aadhar}
                className={`${styles.input} ${styles.readonlyInput}`}
                readOnly
              />
            </div>
          )}

          {formData.pan && (
            <div className={styles.inputGroup}>
              <label htmlFor="pan" className={styles.label}>PAN Number</label>
              <input
                type="text"
                id="pan"
                name="pan"
                value={formData.pan}
                className={`${styles.input} ${styles.readonlyInput}`}
                readOnly
              />
            </div>
          )}

          {/* Show Signature Chip if exists */}
          {formData.signature_url && (
             <div className={styles.inputGroup}>
              <label htmlFor="signature" className={styles.label}>Signature</label>
              <div
              style={{
                height:'48px',
                padding: '0px',
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
                // borderRadius: '16px',
                // background: '#f0f0f0',
                // marginBottom: '12px',
                // marginRight: '8px',
                // border: '1px solid #ccc',
                // maxWidth: 'fit-content'
              }}
              className={`${styles.input} ${styles.readonlyInput}`}
            >
              <Image
                src={formData.signature_url}
                alt="Signature"
                width={100}
                height={48}
                style={{
                  height: '32px',
                  width: 'auto',
                  marginRight: '8px',
                  borderRadius: '4px',
                  background: '#fff'
                }}
              />
              {/* <span style={{ fontSize: '14px', color: '#333' }}>Signature</span> */}
            </div>
             </div>
            
          )}
        </form>
      </div>
    </div>
  );
}

export default KycTab