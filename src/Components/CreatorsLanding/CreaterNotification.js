import React from 'react'
import { FaBell } from "react-icons/fa";
import styles from './CreatorsDashboard.module.css'

function CreaterNotification() {
  return (
    <div className={styles.notificationContainer}>
        <FaBell style={{color:'#16A34A',fontSize:'20px'}}/>
        <div className={styles.notificationText}>
            <h3>Stay Updated?</h3>
            <p>We will notify you via email once this feature goes live, and you&apos;ll recieve regular updates about how many people downloadedyour design.</p>
        </div>
    </div>
  )
}

export default CreaterNotification