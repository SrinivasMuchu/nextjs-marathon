import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IMAGEURLS } from '@/config'
import styles from './FreeTools.module.css'
import FreeToolsBgWrapper from './FreeToolsBgWrapper'

const fileFormats = [
  { name: 'STEP', extensions: '.step, .stp' },
  { name: 'IGES', extensions: '.igs, .iges' },
  { name: 'STL', extensions: '.stl' },
  { name: 'PLY', extensions: '.ply' },
  { name: 'OFF', extensions: '.off' },
  { name: 'BREP', extensions: '.brp, .brep' },
  { name: 'OBJ', extensions: '.obj' }
]

const toolsData = [
  {
    image: IMAGEURLS.freeTools1,
    title: 'CAD Viewer',
    description: 'Preview 3D CAD files online to inspect geometry and structure (powered by the Marathon-OS proprietary CAD viewer)',
    route: '/tools//3D-cad-viewer',
    linkText: 'Preview CAD files'
  },
  {
    image: IMAGEURLS.freeTools2,
    title: 'CAD Converter',
    description: 'Drag, drop, and convert directly in your browser (with no local CAD tools needed)',
    route: '/tools/3d-cad-file-converter',
    linkText: 'Convert CAD files'
  }
]

function FreeTools() {
  return (
    <FreeToolsBgWrapper>
      <div className={styles.freeToolsHeader}>
        <h1 className={styles.freeToolsTitle}>Marathon-OS free to use tools</h1>
        <p className={styles.freeToolsSubtitle}>
          Use powerful engineering tools without installing any software
        </p>
      </div>
      
      <div className={styles.freeToolsCards}>
        {toolsData.map((tool, index) => (
          <Link key={index} href={tool.route} className={styles.freeToolsCard}>
            <div className={styles.freeToolsCardImage}>
              <Image
                src={tool.image}
                alt={tool.title}
                fill
                className={styles.cardImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 550px"
              />
            </div>
            
            <div className={styles.freeToolsCardContent}>
              <h2 className={styles.cardTitle}>{tool.title}</h2>
              <p className={styles.cardDescription}>{tool.description}</p>
              
              <div className={styles.fileFormats}>
                Supported file formats:
                {fileFormats.map((format, formatIndex) => (
                  <span key={formatIndex} className={styles.fileFormatTag}>
                    {format.name} ({format.extensions})
                  </span>
                ))}
              </div>
              
              <span className={styles.cardLink}>
                {tool.linkText} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </FreeToolsBgWrapper>
  )
}

export default FreeTools
