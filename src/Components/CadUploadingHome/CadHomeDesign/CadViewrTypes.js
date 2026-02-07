import React from 'react'
import styles from "./CadHome.module.css";
import { cadViewTypes } from '@/common.helper';
import Link from 'next/link';

function CadViewrTypes() {
  return (
    <div className={styles['cad-convert-types']}>
      <h2>View popular CAD formats</h2>
      <div className={styles['cad-convert-types-list']}>
        {cadViewTypes.map((type, index) => (
          <Link href={`/tools${type.path}-file-viewer`} key={index} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: 250, minHeight: 80, padding: 16, background: 'white', borderRadius: 8, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', cursor: 'pointer' }}>
              <span style={{ fontWeight: 600, fontSize: 'clamp(14px, 2vw, 18px)', marginBottom: 6 }}>{type.label}</span>
              {type.oneLiner && <span style={{ fontSize: 13, lineHeight: 1.4, color: '#555' }}>{type.oneLiner}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CadViewrTypes