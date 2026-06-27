import React from 'react';
import Link from 'next/link';
import cadStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';

function ConvertCrossLink() {
  return (
    <div className={cadStyles['cad-industries']}>
      <div className={cadStyles['cad-industries-content']}>
        <h3>Need to convert a CAD file?</h3>
        <p>
          If you need the file in another format, use Marathon OS CAD Converter to convert between
          STEP, STL, IGES, OBJ, PLY, BREP, DWG and DXF.
        </p>
        <Link href="/tools/3d-cad-file-converter" className={cadStyles['cad-conversion-button']} style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', color: 'white' }}>
          Convert 3D CAD Files →
        </Link>
      </div>
    </div>
  );
}

export default ConvertCrossLink;
