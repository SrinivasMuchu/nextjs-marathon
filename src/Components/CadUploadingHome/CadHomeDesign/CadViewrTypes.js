import React from 'react'
import styles from "./CadHome.module.css";
import { cadViewTypes } from '@/common.helper';
import Link from 'next/link';

function CadViewrTypes() {
  return (
    <div className={styles['cad-convert-types']}>
      <h2>CAD Viewer Types</h2>
      <div className={styles['cad-convert-types-list']}>
        {cadViewTypes.map((type, index) => (
          <Link href={`/tools${type.path}/file-viewer`} key={index}>
            <button >
              {type.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CadViewrTypes