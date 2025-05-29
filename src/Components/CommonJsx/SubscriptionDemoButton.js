"use client"
import React,{useState} from 'react'
import DemoPopUp from '../HomePages/RequestDemo/DemoPopUp';

function SubscriptionDemoButton() {
    const [openDemoForm, setOpenDemoForm] = useState(false);
  return (
     <>
      <button style={{background:'#610bee',color:'white',borderRadius:'8px',padding:'10px 20px'}} onClick={() => setOpenDemoForm('demo')}>Request demo</button>
     
      {openDemoForm==='demo' && <DemoPopUp onclose={()=>setOpenDemoForm(null)} openPopUp={openDemoForm} setOpenDemoForm={setOpenDemoForm}/>}
     
    </>
  
  )
}

export default SubscriptionDemoButton