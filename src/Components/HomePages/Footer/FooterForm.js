"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "@/config";
import ThanksPopUp from '../RequestDemo/ThanksPopUp';
import { isValidPhoneNumber } from "react-phone-number-input";
import ReactPhoneNumber from '@/Components/CommonJsx.js/ReactPhoneNumber';


function FooterForm({ styles }) {
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
      <div className={styles['footer-form']}>
        <span>Ask a question</span>
        <div className={styles['footer-inputs']}>
          <input placeholder='Name*' value={name} onChange={(e) => setName(e.target.value)} style={{ color: 'black' }} />
         
          <ReactPhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} styles={styles} classname='footer-phone'/>
        </div>



        <textarea placeholder='Message*' value={message} onChange={(e) => setMessage(e.target.value)} style={{ color: 'black' }} />
        <div>
          <button onClick={requestDemo} disabled={loading}>
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
