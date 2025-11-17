import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from './IndustryDesign.module.css'
import { GoPencil } from "react-icons/go";
import DesignDetailsStats from '../CommonJsx/DesignDetailsStats';
import NameProfile from '../CommonJsx/NameProfile';
import IndustryDetailsEditButton from './IndustryDetailsEditButton';
import DesignLike from './DesignLike';

function IndustryHeaderDetails({designData}) {
    // console.log(designData)
  return (
    <div className={styles.industryDesignHeaderDetails}>
        <div style={{display:'flex',alignItems:'center'}}>
            <h1>{designData.response.page_title}</h1>
            <DesignLike designId={designData.response._id}/>
        </div>
        {/* <div className={styles.industryDesignHeaderDetailsOwner}> */}
        {designData.response.fullname && 
        <Link href={`/creator/${designData.response.username}`}>
            <div className={styles.industryDesignHeaderDetailsOwner}>
                <NameProfile userName={designData.response.fullname} width={40} memberPhoto={designData.response.photo}/>
                {/* <Image src={IMAGEURLS.allInOne} width={40} height={40} alt='icon'/> */}
                <span>{designData.response.fullname}</span>
                <div className={styles.industryDesignHeaderDetailsOwnerDivider}></div>
                <p>{designData.total_files} projects</p>
            </div>
        </Link>}
            
        {/* </div> */}
        <p>{designData.response.page_description}</p>
        <div className={styles.industryDesignHeaderDesignStats} style={{ display: 'flex', gap: '10px', alignItems: 'center',flexWrap:'wrap' }}>
            {designData.response.category_labels && designData.response.category_labels.map((label, index) => (
                        <DesignDetailsStats key={index} text={label} />
                      ))}
                      {designData.response.tag_labels && designData.response.tag_labels.map((label, index) => (
                        <DesignDetailsStats key={index} text={label} />
                      ))}
            {/* <DesignDetailsStats designData={designData} /> */}
        </div>
        {designData.response.organization_id && <IndustryDetailsEditButton
        EditableFields={{page_title:designData.response.page_title,
        page_description:designData.response.page_description,
        is_downloadable:designData.response.is_downloadable,
        price:designData.response.price,
        cad_tags:designData.response.tag_labels,_id:designData.response._id,}}
        type={"design"}
        />}
        
        

    </div>
  )
}

export default IndustryHeaderDetails