import React from 'react'
import { FaEye } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

function DesignStats({ views, downloads }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center',gap:'16px',color:'#001325' }}>
      <div style={{ display: 'flex', alignItems: 'center',gap:'8px' }}>
        <FaEye style={{fontSize:'18px'}}/>
        <span> {views}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center',gap:'8px' }}>
        <IoMdDownload style={{fontSize:'18px'}}/>
        <span> {downloads}</span>
      </div>
    </div>
   
  
    
  )
}

export default DesignStats