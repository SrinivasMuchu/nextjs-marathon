import React from 'react'
import styles from './IndustryDesign.module.css'

function IndustryDesignHeader({design,designData,type}) {
  console.log(designData)
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
             <a href={type ? `/library/${design}/${designData._id}`:`/industry/${design.industry}/${design.part}/${design.design}/${designData._id}`} 
            rel="nofollow"><button >Open in 3D viewer</button></a>   
        </div>
    </div>
  )
}

export default IndustryDesignHeader