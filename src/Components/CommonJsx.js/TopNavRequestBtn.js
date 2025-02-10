"use client"
import React,{useState} from 'react'
import RequestDemo from '../HomePages/RequestDemo/RequestDemo';

function TopNavRequestBtn({styles,className}) {
     const [openDemoForm, setOpenDemoForm] = useState(false);
      const [openSuccess, setOpenSuccess] = useState(false);
  return (
    <>
      <button className={styles[className]} onClick={() => setOpenDemoForm(!openDemoForm)}>Request demo</button>
      { openDemoForm && <RequestDemo onclose={() => setOpenDemoForm(!openDemoForm)} setOpenSuccess={setOpenSuccess} /> }
    </>
  

  )
}

export default TopNavRequestBtn