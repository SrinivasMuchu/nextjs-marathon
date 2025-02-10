"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { BASE_URL } from "@/config";
import ThanksPopUp from '../RequestDemo/ThanksPopUp';

function FooterForm({ styles }) {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const [openDemoForm, setOpenDemoForm] = useState(false);
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

      } else {
        setLoading(true)
        setError('')
        const response = await axios.post(
          BASE_URL + "/v1/member/demo",
          { phoneNumber, name, message },
          { headers: { "x-auth-token": localStorage.getItem('token') } }
        );
        if (response.data.meta.success) {


          setName('')
          setPhoneNumber('')
          setMessage('')
          // setError('')
          setOpenDemoForm(true)
        }else{
          setError(response.data.meta.message)
        }
        setLoading(false)
      }
      // const data = selectedOption.value === "Admin" ? true : false;

      // console.log(response)
    } catch (error) {
      console.log(error);
    }
    // console.log(name,phoneNumber,message)
  };
  return (
    <>
      <div className={styles['footer-form']}>
        <span>Ask a question</span>
        <div>
          <input placeholder='Name*' value={name} onChange={(e) => setName(e.target.value)} style={{ color: 'black' }} />
          <input placeholder='Phone number*' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ color: 'black' }} />
        </div>
        <textarea placeholder='Message*' value={message} onChange={(e) => setMessage(e.target.value)} style={{ color: 'black' }} />
        <div >
          <button onClick={requestDemo} disabled={loading}>
            {loading ? <span className={styles['btn-ring']}></span> : 'Submit'}
          </button>
          <span style={{ opacity: error ? '1' : '0', color: 'red', fontSize: '14px' }}>{error ? `* ${error}` : 'no text'}</span>
        </div>


      </div>
      {openDemoForm && <ThanksPopUp onclose={()=>setOpenDemoForm(false)}/>}
    </>

  )
}

export default FooterForm