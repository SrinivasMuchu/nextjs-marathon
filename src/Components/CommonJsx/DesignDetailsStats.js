import React from 'react'
import { FaRegFolderOpen } from "react-icons/fa6";


function DesignDetailsStats({fileType,text}) {
  


  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border:'1px solid #E6EDF4',
    color: '#001325',padding: '10px 12px', background: '#fff', borderRadius: '24px' }}>
      {fileType && <FaRegFolderOpen/>}  
        <span>{text}</span>
    </div>
  )
}

export default DesignDetailsStats