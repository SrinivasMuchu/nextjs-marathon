import React from 'react'
import styles from './IndustryDesign.module.css'
import { textLettersLimit } from '@/common.helper'
import Image from 'next/image'

function IndustrySuggestionFiles({ visibleItems, type, design }) {


  return (
    <div className={styles['industry-design-suggestion-designs']}>
      {visibleItems.map((item, index) => (
        <a key={index} href={type ?`/industry/${design.industry}/${design.part}/${item.route}`:`/industry/${item.industry_id}/${item.part_name}/${item.route}`} >
          <div  className={styles['industry-design-suggestion-designs-cont']}>
            <Image className={styles['industry-design-suggestion-designs-cont-img']} src={`https://d1d8a3050v4fu6.cloudfront.net/${item._id}/sprite_0_150.webp`} width={350} height={220} />{/* You can add an icon/image here */}
            <div style={{ width: '100%', height: '1px', background: 'grey' }}></div>
            <h6>{item.page_title}</h6>
            <p>{textLettersLimit(item.page_description, 150)}</p>
          </div>
        </a>

      ))}
    </div>
  )
}

export default IndustrySuggestionFiles