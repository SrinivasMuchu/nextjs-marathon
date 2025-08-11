import React from 'react'
import NameProfile from '../CommonJsx/NameProfile'
import styles from './Creators.module.css'
import { MdVerified } from "react-icons/md";
function CreatorsProfile() {
  return (
    <div className={styles.profileContainer}>
        <NameProfile width='100px' userName='srinivas muchu'/>
        <div className={styles.profileDetails}>
            <span className={styles.profileDetailsTitle}>Srinivas muchu <MdVerified/></span>
            <span className={styles.profileDetailsRole}>Senior CAD Engineer & 3D Designer</span>
        </div>
        <div className={styles.profileActions}>
            <button className={styles.followButton}>Follow</button>
            <button className={styles.actionButton}>Message</button>
            <button className={styles.actionButton}>Book a call</button>
        </div>
    </div>
  )
}

export default CreatorsProfile