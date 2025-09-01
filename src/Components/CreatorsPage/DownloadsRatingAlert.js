import React from 'react'
import styles from './Creators.module.css'
import { MdKeyboardArrowRight } from "react-icons/md";

function DownloadsRatingAlert() {
  return (
    <div className={styles.downloadAlertContainer}>
        <span>Please rate the 5 files you downloaded or converted</span>
        <button><MdKeyboardArrowRight style={{fontSize:'20px'}}/></button>
    </div>
  )
}

export default DownloadsRatingAlert