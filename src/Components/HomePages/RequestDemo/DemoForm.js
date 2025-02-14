"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { BASE_URL } from "@/config";
import DemoPopUp from './DemoPopUp';
import  { isValidPhoneNumber } from "react-phone-number-input";
import ReactPhoneNumber from '@/Components/CommonJsx.js/ReactPhoneNumber';

function DemoForm({ styles, footerStyles, onclose, setOpenDemoForm, openPopUp }) {
  const [openDemoForm, setopenThanks] = useState(openPopUp);
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

      } else if (!isValidPhoneNumber(phoneNumber)) {
        setError("Please enter a valid phone number for your selected country.");
      }  else if (!message) {
        setError("Please enter your message.");

      } else {
        setLoading(true)
        const response = await axios.post(
          BASE_URL + "/v1/member/demo",
          { phoneNumber, name, message },

        );

        if (!response.data.meta.success) {
          setError(response.data.meta.message);
        } else {

          setopenThanks('thanks');

        }
        setLoading(false)
      }


    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div style={{ width: '100%' }} className={styles['demo-form']}>
        {/* <span>Ask a question</span> */}
        <div className={styles['demo-inputs']}>
          <input placeholder='Name*' onChange={(e) => setName(e.target.value)} />
          
           <ReactPhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} styles={styles} classname='demo-phonenumber'/>
        </div>
        <textarea placeholder='Message*' onChange={(e) => setMessage(e.target.value)} />
        <span style={{ opacity: error ? '1' : '0', color: 'red', fontSize: '14px' }}>{error ? `* ${error}` : 'no text'}</span>
        <button onClick={requestDemo} className={styles['demo-form-btn']}>
          {loading ? <span className={footerStyles['btn-ring']}></span> : 'Submit'}
        </button>

      </div>
      {openDemoForm === 'thanks' && <DemoPopUp onclose={onclose} openPopUp={openDemoForm} setOpenDemoForm={setOpenDemoForm} />}
    </>

  )
}

export default DemoForm