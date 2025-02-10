"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { BASE_URL } from "@/config";
import ThanksPopUp from './ThanksPopUp';

function DemoForm({styles,footerStyles,onclose}) {
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
   const [openSuccess, setOpenSuccess] = useState(false);
    
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
          
          );
    
          if (!response.data.meta.success) {
            console.log(response.data.meta.message);
          } else {
    
            setOpenSuccess(true)
            onclose()
            // onclose();
          }
        } // Prevent submission if invalid
        
        console.log('hi')
      } catch (error) {
        console.log(error);
      }
    };
    return (
        <>
          <div style={{ width: '100%' }} className={styles['demo-form']}>
            {/* <span>Ask a question</span> */}
            <div>
                <input placeholder='Name*' onChange={(e) => setName(e.target.value)} />
                <input placeholder='Phone number*' onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <textarea placeholder='Message*' onChange={(e) => setMessage(e.target.value)} />
            <span style={{ opacity: error ? '1' : '0', color: 'red', fontSize: '14px' }}>{error ? `* ${error}` : 'no text'}</span>
            <button onClick={requestDemo}>
                {loading ? <span className={footerStyles['btn-ring']}></span> : 'Submit'}
            </button>

        </div>
         {openSuccess && <ThanksPopUp onclose={()=>setOpenSuccess(false)}/>}
        </>
      
    )
}

export default DemoForm