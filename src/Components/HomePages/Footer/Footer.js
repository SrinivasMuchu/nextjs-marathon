"use client"
import React, { useState } from 'react'
import styles from './Footer.module.css'
import Image from "next/image";
import { IMAGEURLS, BASE_URL } from "@/config";
import axios from 'axios';
import Link from 'next/link';

function Footer({ setOpenDemoForm, setOpenSuccess }) {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
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
        const response = await axios.post(
          BASE_URL + "/v1/member/demo",
          { phoneNumber, name, message },
          { headers: { "x-auth-token": localStorage.getItem('token') } }
        );
        if (response.data.meta.success) {


          setName('')
          setPhoneNumber('')
          setMessage('')
          setOpenSuccess(true)
        }
      }
      // const data = selectedOption.value === "Admin" ? true : false;

      // console.log(response)
    } catch (error) {
      console.log(error);
    }
    // console.log(name,phoneNumber,message)
  };
  return (
    <div className={styles['footer-page']}>
      <div className={styles['footer-page-cont']}>
        <div className={styles['footer-logo-navs']}>
          <div className={styles['footer-logo']}>
            <Image
              src={IMAGEURLS.footerLogo}
              alt="Encryption in transit"
              width={160}
              height={30}
            />
            <span>Simplifying Cloud PDM & PLM</span>
          </div>
          <div className={styles['footer-divider']}>

          </div>
          <div className={styles['footer-navs']}>
            {/* <span>Home</span>
            <span>Features</span>
            <span>Product</span>
            <span>Pricing</span>
            <span>Contact us</span>
            <span>Terms Of Service</span>
            <span>Privacy Policies</span> */}
            <Link href="#home">Home</Link>
            <Link href="#why-us" onClick={() => document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' })}>
              Why us?
            </Link>

            <Link href="#capabilities">Features</Link>
            <Link href="#product">Product</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#security">Security</Link>
            <span style={{ cursor: 'pointer' }} onClick={() => setOpenDemoForm(true)}>Contact us</span>
            <Link href="https://marathon-os.com/terms-and-conditions">Terms Of Service</Link>
            <Link href="https://marathon-os.com/privacy-policy">Privacy Policies</Link>

          </div>
        </div>

        <div className={styles['footer-form']}>
          <span>Ask a question</span>
          <div>
            <input placeholder='Name*' value={name} onChange={(e) => setName(e.target.value)} style={{ color: 'black' }} />
            <input placeholder='Phone number*' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ color: 'black' }} />
          </div>
          <textarea placeholder='Message*' value={message} onChange={(e) => setMessage(e.target.value)} style={{ color: 'black' }} />
          <div >
            <button onClick={requestDemo}>Submit</button>
            <span style={{ opacity: error ? '1' : '0', color: 'red', fontSize: '14px' }}>{error ? `* ${error}` : 'no text'}</span>
          </div>


        </div>
      </div>
      <div className={styles['footer-page-copyright']}>
        <span>Ⓒ Copyrights issued 2023-2024</span>
      </div>
    </div>
  )
}

export default Footer