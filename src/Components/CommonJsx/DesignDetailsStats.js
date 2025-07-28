import React from 'react'
import { FaRegFolderOpen } from "react-icons/fa6";


function DesignDetailsStats({fileType,text}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#001325',padding: '4px 8px', background: '#F5F5F5', borderRadius: '24px' }}>
      {fileType && <FaRegFolderOpen/>}  
        <span>{text}</span>
    </div>
  )
}

export default DesignDetailsStats