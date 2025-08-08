import React from 'react'
import styles from './Creators.module.css'

const tools=['AutoCAD','Fusion 360','Blender','SketchUp','Tinkercad','SolidWorks','Onshape','CATIA','FreeCAD']
function CreatorTools() {
  return (
    <div className={styles.toolsContainer}>
        <span className={styles.toolsTitle}>Tools</span>
        <div className={styles.toolsList}>
            {tools.map(tool => (
                <div key={tool} className={styles.toolItem}>{tool}</div>
            ))}
        </div>
    </div>
  )
}

export default CreatorTools
