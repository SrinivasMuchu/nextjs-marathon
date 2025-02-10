"use client"
import React,{useState} from 'react'
import DemoPopUp from '../HomePages/RequestDemo/DemoPopUp';

function TopNavRequestBtn({styles,className}) {
     const [openDemoForm, setOpenDemoForm] = useState(false);
    
  return (
    <>
      <button className={styles[className]} onClick={() => setOpenDemoForm('demo')}>Request demo</button>
      {openDemoForm==='demo' && <DemoPopUp onclose={()=>setOpenDemoForm(null)} openPopUp={openDemoForm} setOpenDemoForm={setOpenDemoForm}/>}
     
    </>
  

  )
}

export default TopNavRequestBtn