import React from 'react'
import styles from './Creators.module.css'
import { TiStarFullOutline } from "react-icons/ti";
function CreatorsStats() {
  return (
    <div className={styles.statsContainer}>
        <span>120 projects</span>
                <div className={styles.statsLines}></div>
                <span>120 views</span>
        <div className={styles.statsLines}></div>
        <span>120 downloads</span>
      
    </div>
  )
}

export default CreatorsStats