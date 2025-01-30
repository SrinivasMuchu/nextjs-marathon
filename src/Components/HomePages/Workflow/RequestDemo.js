"use client"
import React, { useState, useEffect } from 'react'
import footerStyles from '../Footer/Footer.module.css'
import styles from './WorkFlow.module.css'
import Image from "next/image";
import { BASE_URL, HEADERS, IMAGEURLS } from "@/config";
import axios from 'axios';

function RequestDemo({ onclose }) {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!name) {
      setError("Please enter your name.");
      setIsValid(false);
    } else if (!phoneNumber) {
      setError("Please enter your phone number.");
      setIsValid(false);
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      setIsValid(false);
    } else if (!message) {
      setError("Please enter your message.");
      setIsValid(false);
    } else {
      setError(""); // No errors
      setIsValid(true);
    }
  }, [name, phoneNumber, message]);

  const requestDemo = async () => {
    try {
      setLoading(true)
      if (!isValid) return; // Prevent submission if invalid

      const response = await axios.post(
        BASE_URL + "/v1/member/demo",
        { phoneNumber, name, message },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );

      if (!response.data.meta.success) {
        console.log(response.data.meta.message);
      } else {
        setSuccess(true)
        // onclose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles['demo-popup']}>
      {!success ? <>
        <div className={styles['demo-popup-cont']}>

          <div className={styles['demo-head']}>
            <span>Request demo</span>
            {/* <span>x</span> */}
            <Image
              onClick={onclose}
              src={IMAGEURLS.closeIcon}
              alt="close"
              width={40}
              height={40}
            />
          </div>
          <div style={{ width: '100%' }} className={footerStyles['footer-form']}>
            {/* <span>Ask a question</span> */}
            <div>
              <input placeholder='Name*' onChange={(e) => setName(e.target.value)} />
              <input placeholder='Phone number*' onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <textarea placeholder='Message*' onChange={(e) => setMessage(e.target.value)} />
            <span style={{ opacity: error ? '1' : '0', color: 'red', fontSize: '14px' }}>{error ? `* ${error}` : 'no text'}</span>
            <button onClick={requestDemo}  disabled={loading}>
            {loading ? <span className={footerStyles['btn-ring']}></span>:'Submit'} 
              </button>

          </div>
        </div>
      </> : <>
        <div className={styles['thanks-popup-cont']}>
          <Image
          className={styles['thanks-popup-check']}
            src={IMAGEURLS.points}
            alt="Encryption in transit"
            width={100}
            height={100}
          />
          <div style={{marginTop:'50px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
            <span className={styles['thanks-title']}>Thank you!</span>
            <span className={styles['thanks-desc']}>We have received your query successfully.</span>
          </div>
          <button onClick={() => onclose()}>OK</button>

        </div>

      </>}




    </div>
  )
}

export default RequestDemo