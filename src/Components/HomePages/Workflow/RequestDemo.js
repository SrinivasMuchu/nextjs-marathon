"use client"
import React, { useState } from 'react'
import footerStyles from '../Footer/Footer.module.css'
import styles from './WorkFlow.module.css'
import Image from "next/image";
import { BASE_URL,  IMAGEURLS } from "@/config";
import axios from 'axios';


function RequestDemo({ onclose ,setOpenSuccess}) {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  
  const [loading, setLoading] = useState(false);
 
  const requestDemo = async () => {
    try {
     
      if (!name) {
        setError("Please enter your name.");
        
      } else if (!phoneNumber) {
        setError("Please enter your phone number.");
        
      } else if (!/^\d{10}$/.test(phoneNumber)) {
        setError("Please enter a valid 10-digit phone number.");
        
      } else if (!message) {
        setError("Please enter your message.");
        
      }else{
        setLoading(true)
        const response = await axios.post(
          BASE_URL + "/v1/member/demo",
          { phoneNumber, name, message },
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );
  
        if (!response.data.meta.success) {
          console.log(response.data.meta.message);
        } else {
  
          setOpenSuccess(true)
          onclose()
          // onclose();
        }
      } // Prevent submission if invalid
      
      
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles['demo-popup']}>
      
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
     



    </div>
  )
}

export default RequestDemo