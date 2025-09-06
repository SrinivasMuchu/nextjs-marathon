import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './IndustryDesign.module.css'
import { GoPencil } from "react-icons/go";
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';

function IndustryHeaderDetails({designData}) {
    // console.log(designData)
  return (
    <div className={styles.industryDesignHeaderDetails}>
        <div>
            <h1>{designData.response.page_title}</h1>
        </div>
        {/* <div className={styles.industryDesignHeaderDetailsOwner}> */}
            <div className={styles.industryDesignHeaderDetailsOwner}>
                <Image src={IMAGEURLS.allInOne} width={40} height={40} alt='icon'/>
                <span>name</span>
                <div></div>
                <span>112 projects</span>
            </div>
        {/* </div> */}
        <p>{designData.response.page_description}</p>
        <div>
            {designData.category_labels && designData.category_labels.map((label, index) => (
                        <DesignDetailsStats key={index} text={label} />
                      ))}
                      {designData.tag_labels && designData.tag_labels.map((label, index) => (
                        <DesignDetailsStats key={index} text={label} />
                      ))}
            {/* <DesignDetailsStats designData={designData} /> */}
        </div>
        {designData.response.organization_id && <div className={styles.industryDesignHeaderEdit}>
            <GoPencil /> Edit details
        </div>}
        
        

    </div>
  )
}

export default IndustryHeaderDetails