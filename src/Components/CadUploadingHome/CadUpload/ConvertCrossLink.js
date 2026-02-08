import React from 'react';
import Link from 'next/link';
import cadStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';

function ConvertCrossLink() {
  return (
    <div className={cadStyles['cad-industries']} style={{ backgroundColor: '#ffffff' }}>
      <div className={cadStyles['cad-industries-content']}>
        <h2>Need to convert a CAD file?</h2>
        <p>
          Sometimes you need a different format for manufacturing, printing, or sharing. Use our 3D File
          Converter to convert between STEP, IGES, STL, OBJ and more.
        </p>
        <Link href="/tools/3d-cad-file-converter" className={cadStyles['cad-conversion-button']} style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', color: 'white' }}>
          Convert 3D Files →
        </Link>
      </div>
    </div>
  );
}

export default ConvertCrossLink;
