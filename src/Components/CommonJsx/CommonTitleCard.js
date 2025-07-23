import React from 'react'
import styles from '../HomePages/ContactUs/ContactUs.module.css'

function CommonTitleCard({title,description}) {
  return (
    <div className={styles["contactus-header"]}>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
  )
}

export default CommonTitleCard