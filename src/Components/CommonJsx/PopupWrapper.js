import React from 'react'
import styles from './CommonStyles.module.css';

function PopupWrapper({children}) {
  return (
    <div className={styles.popUpMain}>
        {children}
    </div>
  )
}

export default PopupWrapper