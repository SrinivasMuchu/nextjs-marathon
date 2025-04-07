import React from 'react'
import styles from './Industry.module.css'

function RoleOfCAD({industryData,part_name}) {
 
  return (
    <div className={styles['role-of-cad']}>
        <div className={styles['role-of-cad-content']}>
          {part_name ? <>
            <h2>Role of CAD file in {industryData.part_name} Essentials</h2>
            <p>{industryData.description}</p>
            <span>Used for</span>
            <p>{industryData.use_cases}</p>
            <span>Common CAD File Formats</span>
            <p>{industryData.cad_file_formats}</p>
          </>:<>
          <h2>Role of CAD file in {industryData.industry}</h2>
            <p>{industryData.usage}</p>
            <span>Common CAD File Formats</span>
            <p>{industryData.cad_file_formats}</p>
          </>}
          
        </div>
        <div className={styles['role-of-cad-desgin']}>

        </div>
    </div>
  )
}

export default RoleOfCAD