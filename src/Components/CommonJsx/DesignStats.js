import React from 'react'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

function DesignStats({ views, downloads,ratings }) {
  return (
    <div style={{ display: 'flex',gap:'16px',color:'#001325' }}>
      <div style={{ display: 'flex', alignItems: 'center',gap:'8px' }}>
        <MdOutlineRemoveRedEye style={{fontSize:'18px'}}/>
        <span style={{fontSize:'16px'}}> {views}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center',gap:'8px' }}>
        <FiDownload style={{fontSize:'18px'}}/>
        <span style={{fontSize:'16px'}}> {downloads}</span>
      </div>
      {ratings.average ?
      <div style={{ display: 'flex', alignItems: 'center',gap:'8px' }}>
        <FaStar style={{fontSize:'18px'}}/>
        <span style={{fontSize:'16px'}}> {ratings.average} ({ratings.total})</span>
      </div>:null}
    </div>
   
  
    
  )
}

export default DesignStats