import React from 'react'
import Image from 'next/image'
import CreatorDashboardButton from './CreatorDashboardButton'
import styles from './CreatorsDashboard.module.css'
import { IMAGEURLS } from '@/config'
import PublishItems from './PublishItems'

function CreatorDashboardHeader() {
  return (
    <div className={styles.creatorDasboardHeader}>
     
      <div className={styles.headerContent}>
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">Publish. Earn. Inspire.</h1>
        <p className="mt-4 text-violet-100 text-lg sm:text-xl leading-relaxed">Turn your CAD designs into income or share them freely with the open-source 
          <br/>hardware community.</p>
        <PublishItems/>
        <div style={{display:'flex',alignItems:'center',gap:'24px'}}>
          <CreatorDashboardButton buttonName='Create My Profile'/>
        <CreatorDashboardButton buttonName='Explore Designs'/>
        </div>
        
         {/* <p style={{fontSize:'14px',marginTop:'16px'}}>Creators are solely responsible for ensuring originality and ownership of uploaded files. Marathon-OS does not verify or <br/>assume liability for intellectual property claims.</p> */}
      </div>
    </div>
  )
}

export default CreatorDashboardHeader