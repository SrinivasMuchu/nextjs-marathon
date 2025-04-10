import React from 'react'
import styles from './IndustryDesign.module.css'

function IndustrySuggestionFiles({visibleItems}) {
  return (
    <div className={styles['industry-design-suggestion-designs']}>
    {visibleItems.map((item, index) => (
        <div key={index} className={styles['industry-design-suggestion-designs-cont']}>
            <div>{/* You can add an icon/image here */}</div>
            <h6>{item.title}</h6>
            <p>{item.description}</p>
        </div>
    ))}
</div>
  )
}

export default IndustrySuggestionFiles