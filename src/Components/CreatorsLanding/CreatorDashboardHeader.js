import React from 'react'
import Image from 'next/image'
import CreatorDashboardButton from './CreatorDashboardButton'
import styles from './CreatorsDashboard.module.css'
import { IMAGEURLS } from '@/config'

function CreatorDashboardHeader() {
  return (
    <div className={styles.creatorDasboardHeader}>
      <div className={styles.backgroundImage}>
        <Image 
          src={IMAGEURLS.creatorBg}
          alt="abstract 3D CAD wireframe designs and models with purple gradient background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className={styles.headerContent}>
        <h1>Publish. Earn. Inspire.</h1>
        <p>Monetize your CAD files or share them with the open-source<br/> hardware community.</p>
        <CreatorDashboardButton/>
      </div>
    </div>
  )
}

export default CreatorDashboardHeader