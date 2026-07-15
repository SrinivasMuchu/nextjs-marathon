import React from 'react'
import { Box, CircleDot, FileText, Grid3x3, Triangle } from 'lucide-react'
import styles from './CadConverterSections.module.css'

const FORMATS = [
  { label: 'STEP', Icon: Box },
  { label: 'STL', Icon: Triangle },
  { label: 'IGES', Icon: CircleDot },
  { label: 'OBJ', Icon: Box },
  { label: 'PLY', Icon: Grid3x3 },
  { label: 'BREP', Icon: Box },
  { label: '3DM', Icon: Box },
  { label: 'DWG', Icon: FileText },
  { label: 'DXF', Icon: FileText },
]

function SupportedCadFormats() {
  return (
    <section className={styles.formatsSection} aria-labelledby="supported-cad-formats">
      <div className={styles.formatsInner}>
        <h2 id="supported-cad-formats" className={styles.heading}>
          Supported CAD and 3D Formats
        </h2>
        <ul className={styles.formatList}>
          {FORMATS.map(({ label, Icon }) => (
            <li key={label} className={styles.formatPill}>
              <span className={styles.formatIcon} aria-hidden>
                <Icon size={16} strokeWidth={2.2} />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SupportedCadFormats
