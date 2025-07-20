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
      } else {
        setLoading(true);
        setError('');

        const response = await axios.post(
          `${BASE_URL}/v1/member/demo`,
          { phoneNumber, name, message },
          { headers: { "x-auth-token": localStorage.getItem('token') } }
        );

        if (response.data.meta.success) {
          setName('');
          setPhoneNumber('');
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
