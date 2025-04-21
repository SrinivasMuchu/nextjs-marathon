import React from 'react'
import styles from './IndustryDesign.module.css'
import { textLettersLimit } from '@/common.helper'
import Image from 'next/image'

function IndustrySuggestionFiles({visibleItems}) {
  return (
    <div className={styles['industry-design-suggestion-designs']}>
    {visibleItems.map((item, index) => (
      
        <div key={index} className={styles['industry-design-suggestion-designs-cont']}>
            <Image className={styles['industry-design-suggestion-designs-cont-img']} src={ `https://d1d8a3050v4fu6.cloudfront.net/${item._id}/sprite_0_150.webp`} width={350} height={220}/>{/* You can add an icon/image here */}
            <div style={{width:'100%',height:'1px',background:'grey'}}></div>
            <h6>{ item.page_title}</h6>
            <p>{textLettersLimit(item.page_description,150)}</p>
        </div>
    ))}
</div>
  )
}

export default IndustrySuggestionFiles