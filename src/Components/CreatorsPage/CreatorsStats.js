"use client"
import React,{useContext} from 'react'
import styles from './Creators.module.css'
import { contextState } from '../CommonJsx/ContextProvider';

// Function to format numbers with k+ notation
const formatNumberWithK = (num) => {
  if (num >= 1000) {
    return Math.floor(num / 1000) + 'k+';
  }
  return num.toString();
};

function CreatorsStats() {
  const { user } = useContext(contextState);
  return (
    <div className={styles.statsContainer}>
        <span>{user.projects} projects</span>
                <div className={styles.statsLines}></div>
                <span>{formatNumberWithK(user.views)} views</span>
        <div className={styles.statsLines}></div>
        <span>{formatNumberWithK(user.downloads)} downloads</span>

    </div>
  )
}

export default CreatorsStats