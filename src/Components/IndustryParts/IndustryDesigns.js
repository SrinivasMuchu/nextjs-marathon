import React from 'react'
import IndustryDesignCards from './IndustryDesignCards'
import styles from '../HomePages/Capabilities/Capabilities.module.css'

function IndustryDesigns({industryData}) {
  // console.log(Object.values(industryData[0] || {}))
  return (
    <div id='capabilities' className={styles['capabilities-page']}>
    <div className={styles['capabilities-page-head']}>
        <h1 className={styles['capabilities-page-head-title']}>{industryData.part_name} CAD Previews in 3D</h1>
        <p className={styles['capabilities-page-head-desc']}>Interact with high-fidelity 3D models of the {industryData.part_name}. No downloads required—just explore, inspect, and collaborate online.</p>
    </div>
    <div className={styles['capabilities-page-img']}>
        
            <IndustryDesignCards styles={styles}/>
           
       
    </div>
</div>
  )
}

export default IndustryDesigns