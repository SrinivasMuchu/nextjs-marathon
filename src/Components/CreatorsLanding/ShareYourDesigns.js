import React from 'react'
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { AiFillTool } from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoIosLink } from "react-icons/io";
import { FaGlobe } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import styles from './CreatorsDashboard.module.css'
import ShareYourDesignItems from './ShareYourDesignItems';



function ShareYourDesigns() {
  return (
    <div className={styles.shareYourDesignsContainer}>
        <h1 style={{textAlign:'center'}}>Why Share Your Designs on Marathon-OS?</h1>
        <div className={styles.shareYourDesignsList}>
           <ShareYourDesignItems/>
        </div>
    </div>
  )
}

export default ShareYourDesigns