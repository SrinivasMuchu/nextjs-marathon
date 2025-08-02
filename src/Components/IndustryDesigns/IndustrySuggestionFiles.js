import React from 'react'
import styles from './IndustryDesign.module.css'
import { textLettersLimit } from '@/common.helper'
import Image from 'next/image'
import { DESIGN_GLB_PREFIX_URL } from '@/config'
import Link from 'next/link'
function IndustrySuggestionFiles({ visibleItems, type, design,design_type }) {


  return (
    <div className={styles['industry-design-suggestion-designs']}>
      {visibleItems.map((item, index) => (
        <Link key={index} className={styles['industry-design-suggestion-designs-cont']}
         href={design_type?`/library/${item.route}`:type ?`/industry/${design.industry}/${design.part}/${item.route}`:`/industry/${item.industry_id}/${item.part_name}/${item.route}`} >
          <div  style={{display:'flex',flexDirection:'column',gap:'16px'
          }}>
            <Image className={styles['industry-design-suggestion-designs-cont-img']} alt={item.page_title} src={`${DESIGN_GLB_PREFIX_URL}${item._id}/sprite_0_150.webp`} width={350} height={220} 
            style={{borderBottom:'1px solid grey'}}/>{/* You can add an icon/image here */}
          
          {/* <div style={{ width: '100%', height: '1px', background: 'black' }}></div> */}
          {!type && <span className={styles['industry-design-industry-tag']}>{item.industry_name}</span>}  
            <h3 title={item.page_title}>{textLettersLimit(item.page_title, 40)}</h3>
            <p title={item.page_description}>{textLettersLimit(item.page_description, 120)}</p>
          </div>
        </Link>

      ))}
    </div>
  )
}

export default IndustrySuggestionFiles