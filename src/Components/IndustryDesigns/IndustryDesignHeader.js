import React from 'react'
import styles from './IndustryDesign.module.css'
import DesignStats from '../CommonJsx/DesignStats'

function IndustryDesignHeader({design,designData,type}) {
 
  return (
    <div className={styles['industry-design-header']}>
        <div className={styles['industry-design-header-content']}>
            <h1 >{designData?.page_title}</h1>
            <p >
            {designData?.page_description}
            </p>
        </div>
        <div className={styles['industry-design-header-viewer']}>
            <span >Experience in 3-D</span>
            {/* http://localhost:3000/tools/cad-renderer?fileId=6864dccdf76d3baee61d6785 */}
            <a href={`/tools/cad-renderer?fileId=${designData._id}&format=${designData.file_type?designData.file_type:'step'}`} rel="nofollow"><button >Open in 3D viewer</button></a>   
                {/* <a href={ `/library/${design}/${designData._id}.${designData.file_type?designData.file_type:'step'}`:`/industry/${design.industry}/${design.part}/${design.design}/${designData._id}.${designData.file_type?designData.file_type:'step'}`} 
                rel="nofollow"><button >Open in 3D viewer</button></a>    */}
               <DesignStats views={designData.total_design_views} downloads={designData.total_design_downloads}/>
        </div>
       
    </div>
  )
}

export default IndustryDesignHeader