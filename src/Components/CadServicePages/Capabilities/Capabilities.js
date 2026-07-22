import React from 'react'
import styles from './Capabilities.module.css'

const CAPABILITIES = [
  {
    title: 'Mechanical parts and assemblies',
    description: '3D part modelling, assemblies, mechanisms, engineering changes, revisions and model clean-up.',
    icon: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Technical and manufacturing drawings',
    description: 'Drawing packs, dimensions, tolerances, GD&T, BOMs, detailing and existing drawing updates.',
    icon: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Product enclosures',
    description: 'Plastic and sheet-metal housings, prototype changes, internal layouts and production-ready revisions.',
    icon: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="2" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Manufacturing-ready CAD',
    description: 'DFM revisions, reverse engineering, file conversion, production documentation and model preparation.',
    icon: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20V8l8-4 8 4v12H4Z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 20v-6h8v6M8 10h.01M12 10h.01M16 10h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const TOOLS = [
  'SOLIDWORKS',
  'AutoCAD',
  'Fusion 360',
  'CATIA',
  'Creo',
  'Inventor',
  'Siemens NX',
  'Onshape',
  'And more',
]

function Capabilities() {
  return (
    <section className={styles.section} id="capabilities">
      <div className={styles.narrow}>
        <div className={styles.eyebrow}>CAD capabilities</div>
        <h2 className={styles.title}>Find support for a single task, a complete project or an ongoing backlog.</h2>
        <p className={styles.sub}>
          The network covers a broad range of CAD work across product development, engineering, manufacturing and
          documentation.
        </p>

        <div className={styles.grid}>
          {CAPABILITIES.map((cap) => (
            <article key={cap.title} className={styles.card}>
              <div className={styles.icon}>{cap.icon}</div>
              <h3>{cap.title}</h3>
              <p>{cap.description}</p>
            </article>
          ))}
        </div>

        <div className={styles.toolBand} aria-label="Supported CAD tools">
          {TOOLS.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Capabilities
