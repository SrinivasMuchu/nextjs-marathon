"use client"
import React,{useState} from 'react'
import DemoPopUp from '../HomePages/RequestDemo/DemoPopUp';

function ContactUsText() {
      const [openDemoForm, setOpenDemoForm] = useState(false);
          
  return (
    <>
     <span style={{ cursor: 'pointer' }} onClick={() => setOpenDemoForm('demo')}>Contact us</span>
     {openDemoForm==='demo' && <DemoPopUp onclose={()=>setOpenDemoForm(null)} openPopUp={openDemoForm}/>}
    </>
   
  )
}

export default ContactUsText