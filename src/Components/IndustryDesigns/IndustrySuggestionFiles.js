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
            <h6>{ textLettersLimit(item.grabcad_title,15)}</h6>
            <p>{textLettersLimit(item.grabcad_description,150)}</p>
        </div>
    ))}
</div>
  )
}

export default IndustrySuggestionFiles