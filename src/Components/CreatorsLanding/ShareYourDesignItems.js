import React from 'react'
import styles from './CreatorsDashboard.module.css'
import { listOfShare } from './ShareYourDesignData';

function ShareYourDesignItems() {
  return (
    <>
      {listOfShare.map((item, index) => (
        <div key={index} className={styles.shareYourDesignsItem}>
          {item.icon}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </>
  )
}

export default ShareYourDesignItems