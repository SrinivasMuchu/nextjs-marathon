import React from 'react'
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { AiFillTool } from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoIosLink } from "react-icons/io";
import { FaGlobe } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import styles from './CreatorsDashboard.module.css'


const listOfShare = [
    {
        icon: <AiOutlineQuestionCircle style={{ color: '#610bee', fontSize: '24px' }} />,
        title: 'Inspire Others',
        description:'Share your work to spark new ideas and drive innovation in the engineering community.'
    },
    {
        icon: <AiFillTool style={{ color: '#610bee', fontSize: '24px' }} />,
        title: 'Help the Community',
        description:'Support fellow engineers and makers with valuable designs they can build upon.'
    },
    {
        icon: <BsGraphUpArrow style={{ color: '#610bee', fontSize: '24px' }} />,
        title: 'Showcase your Skills',
        description:'Build your portfolio and gain visibility in the industry with your best work.'
    },
    {
        icon: <IoIosLink style={{ color: '#610bee', fontSize: '24px' }} />,
        title: 'Connect and Collaborate',
        description:'Find like-minded professionals and potential partners for future projects.'
    },
    {
        icon: <FaGlobe style={{ color: '#610bee', fontSize: '24px' }} />,
        title: 'Join a Connected Ecosystem',
        description:'Be part of a growing library of open hardware designs that impact the world.'
    },
    {
        icon: <FaCoins style={{ color: '#610bee', fontSize: '24px' }} />,
        title: 'Soon, You\'ll Be Getting Paid!',
        description:'Monetize your designs and earn from your contributions. Stay tuned for exciting updates!'
    }
]

function ShareYourDesigns() {
  return (
    <div className={styles.shareYourDesignsContainer}>
        <h1 style={{textAlign:'center'}}>Why Share Your Designs on Marathon-OS?</h1>
        <div className={styles.shareYourDesignsList}>
            {listOfShare.map((item, index) => (
                <div key={index} className={styles.shareYourDesignsItem}>
                    {item.icon}
                    <h2 >{item.title}</h2>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ShareYourDesigns