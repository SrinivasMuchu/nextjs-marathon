import React from 'react'
import styles from './CreatorsDashboard.module.css'
import { listOfShare } from './ShareYourDesignData';

function ShareYourDesignItems() {
  return (
    <>
      {listOfShare.map((item, index) => (
        <div key={index} className={styles.shareYourDesignsItem}>
          {item.icon}
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </>
  )
}

export default ShareYourDesignItems