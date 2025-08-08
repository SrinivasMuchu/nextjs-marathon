import React from 'react'
import styles from './Creators.module.css'
import { FaArrowRightLong } from "react-icons/fa6";

function AboutCreator() {
  return (
    <div className={styles.aboutContainer}>
        <span className={styles.aboutTitle}>About srinivas</span>
        <p className={styles.aboutDescription}>Transforming ideas into precise 3D models and 
            technical drawings with 8+ years of experience in mechanical 
            design and product development.</p>
        <button className={styles.readMoreButton}>Read more <FaArrowRightLong/></button>
    </div>
  )
}

export default AboutCreator