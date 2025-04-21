import React from 'react'
import styles from './IndustryDesign.module.css'

function IndustryDesignHeader({design,designData}) {
  console.log(designData)
  return (
    <div className={styles['industry-design-header']}>
        <div className={styles['industry-design-header-content']}>
            <h1 >{designData?.title}</h1>
            <p >
            {designData?.description}
            </p>
        </div>
        <div className={styles['industry-design-header-viewer']}>
            <span >Experience in 3-D</span>
            <a target='_blank' href={`/industry/${design.industry}/${design.part}/${design.design}/${designData._id}`}><button >Open in 3D viewer</button></a>
            
        </div>
    </div>
  )
}

export default IndustryDesignHeader