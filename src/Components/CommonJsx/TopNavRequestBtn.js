"use client"
import React,{useState} from 'react'
import DemoPopUp from '../HomePages/RequestDemo/DemoPopUp';
import styles from '../HomePages/HomepageTopNav/HomeTopNav.module.css'

function TopNavRequestBtn() {
     const [openDemoForm, setOpenDemoForm] = useState(false);
    
  return (
    <>
      <button className={styles['try-demo']} onClick={() => setOpenDemoForm('demo')}>Request demo</button>
      {openDemoForm==='demo' && <DemoPopUp onclose={()=>setOpenDemoForm(null)} openPopUp={openDemoForm} setOpenDemoForm={setOpenDemoForm}/>}
     
    </>
  

  )
}

export default TopNavRequestBtn