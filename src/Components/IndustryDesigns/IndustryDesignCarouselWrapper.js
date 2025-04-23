import React from 'react'

import styles from "./IndustryDesign.module.css";

function IndustryDesignCarouselWrapper({children}) {
  return (
      <div className={styles.carouselWrapper}>
        {children}
      </div>
  )
}

export default IndustryDesignCarouselWrapper