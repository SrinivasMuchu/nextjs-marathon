import React from 'react'

function CommonCancelButton({styles,handleClose}) {
  return (
    <button onClick={handleClose} className={styles["cancel-edit-button"]}>Cancel</button>
  )
}

export default CommonCancelButton