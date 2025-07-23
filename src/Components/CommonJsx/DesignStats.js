import React from 'react'
import { FaEye } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

function DesignStats() {
  return (
    <div style={{ display: 'flex', padding: '10px', alignItems: 'center',gap:'16px' }}>
      <div style={{ display: 'flex', padding: '10px', alignItems: 'center',gap:'8px' }}>
        <FaEye />
        <span> 100 Views</span>
      </div>
      <div style={{ display: 'flex', padding: '10px', alignItems: 'center',gap:'8px' }}>
        <IoMdDownload />
        <span> 50 Downloads</span>
      </div>
    </div>
   
  
    
  )
}

export default DesignStats