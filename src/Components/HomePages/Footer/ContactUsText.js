"use client"
import React,{useState} from 'react'
import RequestDemo from '../RequestDemo/RequestDemo';

function ContactUsText() {
      const [openDemoForm, setOpenDemoForm] = useState(false);
          const [openSuccess, setOpenSuccess] = useState(false);
  return (
    <>
     <span style={{ cursor: 'pointer' }} onClick={() => setOpenDemoForm(true)}>Contact us</span>
     { openDemoForm && <RequestDemo onclose={() => setOpenDemoForm(!openDemoForm)} setOpenSuccess={setOpenSuccess} /> }
    </>
   
  )
}

export default ContactUsText