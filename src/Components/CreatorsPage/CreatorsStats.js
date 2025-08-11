import React from 'react'
import styles from './Creators.module.css'
import { TiStarFullOutline } from "react-icons/ti";
function CreatorsStats() {
  return (
    <div className={styles.statsContainer}>
        <div className={styles.statItem}>
            <span>Projects Completed</span>
            <span>150</span>
        </div>
        <div className={styles.statItem}>
            <span>Total Views</span>
            <span>8k+</span>
        </div>
        <div className={styles.statItem}>
            <span>Total Downloads</span>
            <span>2.5k+</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
            <span style={{display:'flex',alignItems:'center',gap:'6px'}}><TiStarFullOutline /> 4.2/5</span>
            <span>(322 ratings)</span>
        </div>
    </div>
  )
}

export default CreatorsStats