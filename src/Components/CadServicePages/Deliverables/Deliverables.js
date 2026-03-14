import React from 'react'
import { FileText, Archive, Pencil, RefreshCw, Shield } from 'lucide-react'
import styles from './Deliverables.module.css'

const ITEMS = [
  {
    icon: FileText,
    title: 'Native CAD File',
    description: 'SolidWorks, AutoCAD, Fusion 360, Creo, CATIA, NX, Revit & more',
  },
  {
    icon: Archive,
    title: 'Export Formats',
    description: 'STEP / IGES / STL / DWG / PDF — as needed',
  },
  {
    icon: Pencil,
    title: 'Drawing Pack',
    description: 'Title blocks, GD&T annotations, BOM if required',
  },
  {
    icon: RefreshCw,
    title: 'Revision Rounds Included',
    description: 'Defined in scope — no surprise extra charges',
  },
]

function Deliverables() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Deliverables</span>
        <h2 className={styles.title}>Everything you&apos;ll receive</h2>
        <p className={styles.sub}>
          Production-ready files, not just raw exports. Every delivery is documented, verified, and yours to keep.
        </p>
      </div>
      <div className={styles.grid}>
        {ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className={styles.item}>
              <div className={styles.icon}>
                <Icon size={20} strokeWidth={2} color="#C4A8FF" />
              </div>
              <div className={styles.text}>
                <strong>{item.title}</strong>
                {item.description}
              </div>
            </div>
          )
        })}
        <div className={`${styles.item} ${styles.itemBanner}`}>
          <div className={styles.icon}>
            <Shield size={20} strokeWidth={2} color="#C4A8FF" />
          </div>
          <div className={styles.text}>
            <strong>IP is 100% yours. NDA available on request.</strong>
            Your designs, your data, your intellectual property — always.
          </div>
        </div>
      </div>
    </section>
  )
}

export default Deliverables
