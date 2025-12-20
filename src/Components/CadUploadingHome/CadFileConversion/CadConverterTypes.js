import React from 'react';
import styles from '../CadHomeDesign/CadHome.module.css';
import { converterTypes } from '@/common.helper';
import Link from 'next/link';

function CadConverterTypes() {
  

  return (
    <div className={styles['cad-convert-types']}>
      <h2>CAD Converter Types</h2>
      <div className={styles['cad-convert-types-list']}>
        {converterTypes.map((type, index) => (
          <Link href={`/tools/convert${type.path}`} key={index}>
            <button >
              {type.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CadConverterTypes;
