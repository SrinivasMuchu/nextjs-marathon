"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "@/config";
import ThanksPopUp from '../RequestDemo/ThanksPopUp';
import { isValidPhoneNumber } from "react-phone-number-input";
import ReactPhoneNumber from '@/Components/CommonJsx/ReactPhoneNumber';
import styles from "./Footer.module.css";

function FooterForm({getIntouch}) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDemoForm, setOpenDemoForm] = useState(false);


  const requestDemo = async () => {
    try {
      if (!name) {
        setError("Please enter your name.");
      } else if (!phoneNumber) {
        setError("Please enter your phone number.");
      } else if (!isValidPhoneNumber(phoneNumber)) {
        setError("Please enter a valid phone number for your selected country.");
      } else if (!message) {
        setError("Please enter your message.");
      } else if (!email) {
        setError("Please enter your email.");
      } else if (!email.includes('@') || !email.includes('.')) {
        setError("Please enter a valid email.");
      } else {
        setLoading(true);
        setError('');

        const response = await axios.post(
          `${BASE_URL}/v1/member/demo`,
          { phoneNumber, name, message, email },
          { headers: { "x-auth-token": localStorage.getItem('token') } }
        );

        if (response.data.meta.success) {
          setName('');
          setPhoneNumber('');
          setEmail('');
          setMessage('');
          setOpenDemoForm(true);
        } else {
          setError(response.data.meta.message);
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles['footer-form']} style={getIntouch ? { width: '100%' } : {}}>
        <span>Ask a question</span>
        <div className={styles[!getIntouch?'footer-inputs':'footer-getin-touch']} style={getIntouch ? { flexDirection: 'column' } : {}}>
          {/* First row: Name and Phone side by side */}
          <div className={styles['footer-first-row']}>
            <input placeholder='Name*'  
              value={name} onChange={(e) => setName(e.target.value)} style={{
                width: getIntouch ? '100%' : '',
                color: 'black',
              }} />
            <label htmlFor="footer-phone-input" style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              border: 0,
            }}>
              Phone number*
            </label>
            <ReactPhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} styles={styles} classname='footer-phone' id="footer-phone-input"/>
          </div>
          {/* Email: full width, textarea-sized, between first row and message */}
          <label htmlFor="footer-email-input" style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            border: 0,
          }}>
            Email*
          </label>
          <div className={styles['footer-email-wrapper']}>
            <input
              id="footer-email-input"
              placeholder='Email*'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles['footer-email-input']}
              style={{ color: 'black' }}
            />
          </div>
        </div>

        <textarea placeholder='Message*' value={message} onChange={(e) => setMessage(e.target.value)} style={{ color: 'black',marginTop:getIntouch?'16px':'' }} />
        <div>
          <button onClick={requestDemo} disabled={loading} style={getIntouch?{width:'100%'}:{}}>
            {loading ? <span className={styles['btn-ring']}></span> : 'Submit'}
          </button>
          <span style={{ opacity: error ? '1' : '0', color: 'red', fontSize: '14px' }}>{error ? `* ${error}` : ''}</span>
        </div>
      </div>
      
      {openDemoForm && <ThanksPopUp onclose={() => setOpenDemoForm(false)} />}
    </>
  );
}

export default FooterForm;
