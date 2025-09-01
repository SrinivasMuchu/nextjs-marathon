"use client"
import React,{useContext} from 'react'
import styles from './Creators.module.css'
import { contextState } from '../CommonJsx/ContextProvider';

// Function to format numbers with k+ notation
const formatNumberWithK = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  if (num >= 1000) {
    return Math.floor(num / 1000) + 'k+';
  }
  return num.toString();
};

function CreatorsStats({ creatorId }) {
  const { user, viewer } = useContext(contextState);
   const profileData = !creatorId ? user : viewer;
  return (
    <>
    <div className={styles.statsContainer}>
        <span>{profileData.projects} projects</span>
                <div className={styles.statsLines}></div>
                <span>{profileData.views} views</span>
        <div className={styles.statsLines}></div>
        <span>{profileData.downloads} downloads</span>

    </div>
    <div style={{width:'320px',height:'1px',background:'#edf2f7'}}/>
    </>
    
  )
}

export default CreatorsStats