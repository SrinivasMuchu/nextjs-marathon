import React from 'react'
import styles from './CadConverterSections.module.css'

const FORMATS = [
  { label: 'STEP', type: 'CAD / mechanical', title: 'Parametric solids and assemblies', extensions: '.step, .stp' },
  { label: 'IGES', type: 'CAD exchange', title: 'Legacy surfaces and wireframes', extensions: '.igs, .iges' },
  { label: 'STL', type: '3D printing', title: 'Triangular surface meshes', extensions: '.stl' },
  { label: 'OBJ', type: 'Rendering / mesh', title: 'Mesh geometry with material references', extensions: '.obj' },
  { label: 'PLY', type: 'Scanning / research', title: 'Polygon and scan data', extensions: '.ply' },
  { label: 'OFF', type: 'Research / geometry', title: 'Simple polygon geometry', extensions: '.off' },
  { label: 'BREP', type: 'Solid modeling', title: 'Boundary representation solids', extensions: '.brp, .brep' },
  { label: '3DM', type: 'Rhino modeling', title: 'Rhino / OpenNURBS models', extensions: '.3dm' },
  { label: 'DWG', type: '2D drawing', title: 'Native 2D CAD drawings', extensions: '.dwg' },
  { label: 'DXF', type: 'CAD exchange', title: 'Interchangeable 2D CAD drawings', extensions: '.dxf' },
]

function SupportedCadFormats() {
  return (
    <section className={styles.formatsSection} aria-labelledby="supported-cad-formats">
      <div className={styles.formatsInner}>
        <p className={styles.formatsEyebrow}>Supported formats</p>
        <h2 id="supported-cad-formats" className={styles.heading}>
          CAD, mesh and drawing formats in one tool
        </h2>
        <p className={styles.formatsIntro}>
          Choose a format based on whether you need editable engineering geometry, lightweight
          visualization, scan data, 3D printing or 2D drafting exchange.
        </p>
        <ul className={styles.formatList}>
          {FORMATS.map(({ label, type, title, extensions }) => (
            <li key={label} className={styles.formatCard}>
              <div className={styles.formatCardTop}>
                <span className={styles.formatBadge}>{label}</span>
                <span className={styles.formatType}>{type}</span>
              </div>
              <h3>{title}</h3>
              <p>{extensions}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SupportedCadFormats
