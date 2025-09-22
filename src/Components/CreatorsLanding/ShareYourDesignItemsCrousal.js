"use client"
import React, { useEffect, useState } from 'react'
import { listOfShare } from './ShareYourDesignData'
import styles from './CreatorsDashboard.module.css'

function ShareYourDesignItemsCrousal() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % listOfShare.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const item = listOfShare[index];

  return (
    <div className={styles.shareYourDesignsItem} style={{height:'100px',width:'375px'}}>
       <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
             <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
      <h2 style={{ margin: '8px 0' }}>{item.title}</h2>
            </div>
      
      <p style={{ margin: 0 }}>{item.description}</p>
    </div>
  )
}

export default ShareYourDesignItemsCrousal