import React from 'react'
import { FaRegFolderOpen } from "react-icons/fa6";
import { FaTag  } from "react-icons/fa";
import { MdCategory } from "react-icons/md";


function DesignDetailsStats({fileType,text,type}) {
  


  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border:'1px solid #E6EDF4',
    color: '#001325',padding: '10px 12px', background: '#fff', borderRadius: '24px' }}>
      {type === 'category' && <MdCategory/>}  
      {type === 'tag' && <FaTag/>}
      {fileType && <FaRegFolderOpen/>}  
        <span>{text}</span>
    </div>
  )
}

export default DesignDetailsStats