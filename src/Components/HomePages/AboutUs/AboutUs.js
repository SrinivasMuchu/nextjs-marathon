import CommonTitleCard from '@/Components/CommonJsx/CommonTitleCard'
import React from 'react'
import styles from './AboutUs.module.css'
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { FaHandshake } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";

import { SiConvertio } from "react-icons/si";
import { FaEye } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";

import { MdEmojiEvents } from "react-icons/md";
import { FaStar } from "react-icons/fa6";

import { FaGlobe } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import Image from 'next/image';
import { IMAGEURLS, MARATHON_ASSET_PREFIX_URL } from '@/config';
import TopNavRequestBtn from '@/Components/CommonJsx/TopNavRequestBtn';
import Footer from '../Footer/Footer';
import HomeTopNav from '../HomepageTopNav/HomeTopNav';



const ourMissonsArray = [
    {
        icon:<HiMiniRocketLaunch/>,
        title:'Innovation',
        description:'We’re redefining how hardware teams work by building tools that make CAD files more accessible, collaborative, and reusable. From online viewers to format converters and a creator-driven marketplace, we push boundaries to simplify innovation.'

    },
    {
        icon:<FaAward/>,
        title:'Excellence',
        description:'We obsess over details to ensure our tools meet the highest standards of reliability, usability, and performance — so engineers and creators can focus on what they do best: building.'

    },
    {
        icon:<FaHandshake/>,
        title:'Collaboration',
        description:'Whether it’s internal teams or external collaborators, we believe great hardware is built together. Our platform fosters real-time collaboration, feedback, and sharing — across teams, companies, and creators.'

    }
]

const teamMembersArray = [
    {
        image:IMAGEURLS.uday,
        name:'Uday Khatry',
        // designation:'15+ years in tech leadership',
        role:'Co-Founder'
    },
    {
        image:IMAGEURLS.suyog,
        name:'Suyog Patel',
        // designation:'15+ years in tech leadership',
        role:'Co-Founder'
    },
    {
        image:IMAGEURLS.apoorv,
        name:'Apoorv Garg',
        // designation:'15+ years in tech leadership',
        role:'Strategic Advisor'
    },
    {
        image:IMAGEURLS.yugal,
        name:'Yugal Raj Jain',
        // designation:'15+ years in tech leadership',
        role:'Strategic Advisor'
    },
    {
        image:IMAGEURLS.karishma,
        name:'Karishma Mohammed',
        // designation:'15+ years in tech leadership',
        role:'Full stack developer'
    },
    {
        image:IMAGEURLS.srinivas,
        name:'Srinivas Muchu',
        // designation:'15+ years in tech leadership',
        role:'Full stack developer'
    },
    
]

const achievementsArray = [
    {
        logo:<SiConvertio/>,
        title:'500K+',
        description:'CAD converted'
    },
    {
        logo:<FaEye/>,
        title:'1M+',
        description:'CAD viewed'
    },
    {
        logo:<MdFileDownload/>,
        title:'100K+',
        description:'CAD downloaded'
    },
    
]
function AboutUs() {
    return (
        <>
        {/* <HomeTopNav/> */}
        <div className={styles["aboutus-page"]}>
            <CommonTitleCard title="About Marathon-OS" description="Empowering businesses through innovative technology solutions and exceptional service delivery" />
            <div className={styles["aboutus-our-story"]}>
                <div className={styles["aboutus-our-story-content"]}>
                    <h1>Our Story</h1>
                    <p>Founded in 2023, Marathon-OS began with a vision to empower hardware teams with the same level of 
                        digital infrastructure that software teams have long enjoyed. We saw a gap — hardware engineers 
                        lacked a seamless way to manage, share, and collaborate on designs. So, we built a platform that bridges that gap.</p>
                    <p>Today, Marathon-OS offers engineers a powerful suite of tools — from an online CAD viewer and CAD 
                        format converter to a collaborative workspace for managing design files. We’re also building a 
                        growing marketplace where creators can share and monetize their CAD files, and teams can find 
                        ready-to-use designs to accelerate development. Our mission 
                        is to make hardware collaboration as frictionless, open, and scalable as software development.</p>
                    {/* <div className={styles["aboutus-our-story-array"]}>
                        {ourStoryArray.map((item, index) => (
                            <div key={index} className={styles["aboutus-our-story-item"]}>
                                <span>{item.count}</span>
                                <p>{item.title}</p>
                            </div>
                        ))}

                    </div> */}
                </div>
                <div className={styles["aboutus-our-story-img"]}>
                        <Image width={400} height={400} src={IMAGEURLS.ourStory} alt='about us'/>
                </div>
            </div>

            <div className={styles["aboutus-our-missons"]}>
                <h1 className={styles["aboutus-our-missons-title"]}>Our Mission & Values</h1>
                <p className={styles["aboutus-our-missons-desc"]}>We&apos;re driven by core principles that guide every decision and shape our culture</p>
                <div className={styles["aboutus-our-missons-items"]}>
                    {ourMissonsArray.map((item,index)=>(
                        <div key={index} className={styles["aboutus-our-missons-cont"]}>
                            <div className={styles["aboutus-our-missons-cont-logo"]}>
                                {item.icon}
                            </div>
                            <h6>{item.title}</h6>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>

            </div>

            <div className={styles["aboutus-our-missons"]} style={{background:'linear-gradient(0deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.90) 100%), #5B89FF'}}>
            <h1 className={styles["aboutus-our-missons-title"]} >Meet Our Team</h1>
                <p className={styles["aboutus-our-missons-desc"]}>The talented individuals who make Marathon&apos;s success possible</p>
            <div className={styles["aboutus-our-team-items"]}>
                {teamMembersArray.map((item,index)=>(
                    <div className={styles["aboutus-our-team-cont"]} key={index}>
                        <Image width={100} height={100} src={item.image} alt={item.name}/>
                        <span className={styles["aboutus-our-team-name"]}>{item.name}</span>
                        <span className={styles["aboutus-our-team-role"]}>{item.role}</span>
                        {/* <span className={styles["aboutus-our-team-designation"]}>{item.designation}</span> */}
                    </div>
                ))}
            </div>
            </div>

            <div className={styles["aboutus-our-missons"]} style={{background:'#610bee'}}>
            <h1 className={styles["aboutus-our-missons-title"]} style={{color:'white'}}>Our Achievements</h1>
                <p className={styles["aboutus-our-missons-desc"]} style={{color:'white'}}>Recognition and milestones that reflect our commitment to excellence</p>
            <div className={styles["aboutus-our-team-items"]} style={{color:'white'}}>
                {achievementsArray.map((item,index)=>(
                    <div key={index} className={styles["aboutus-our-team-cont"]}>
                        <div className={styles["aboutus-our-missons-cont-logo"]} 
                        style={{fontSize:'42px',borderRadius:'50%',background:'#7124F0',color:'white'}}>
                            {item.logo}
                        </div>
                        <span className={styles["aboutus-our-team-name"]} >{item.title}</span>
                        <span>{item.description}</span>
                    </div>
                ))}
            </div>
            </div>

            <div className={styles["aboutus-our-missons"]}>
            <h1 className={styles["aboutus-our-missons-title"]} >Ready to Start Your Journey?</h1>
                <p className={styles["aboutus-our-missons-desc"]} >Let&apos;s discuss how we can help transform your business with innovative technology solutions</p>
            <div className={styles["about-pg-btns"]}>
            <TopNavRequestBtn  />
            </div>
           
            </div>
        </div>
        <Footer/>
        </>
        
    )
}

export default AboutUs