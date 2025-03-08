import React from 'react'

function CommonSaveButton({styles,handleClick,className,type}) {
    
  return (
    <button onClick={handleClick} className={styles[className]} >Save</button>
  )
}

export default CommonSaveButton