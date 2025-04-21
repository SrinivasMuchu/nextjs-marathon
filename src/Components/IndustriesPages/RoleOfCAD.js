import React from 'react'
import styles from './Industry.module.css'
import RoleOfCadImage from './RoleOfCadImage'

function RoleOfCAD({industryData,part_name,industry}) {
 
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
        <RoleOfCadImage industry={industryData.route} part_name={part_name} styles={styles}/>
       
    </div>
  )
}

export default RoleOfCAD