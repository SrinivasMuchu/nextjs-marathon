import React from 'react';
import Link from 'next/link';
import cadStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';

function CadViewerCrossLink() {
  return (
    <div className={cadStyles['cad-industries']}>
      <div className={cadStyles['cad-industries-content']}>
        <h3>Need to preview before converting?</h3>
        <p>
          Open your CAD file in the Marathon OS 3D viewer first to inspect geometry, check scale and
          confirm the model before converting it to another format.
        </p>
        <Link
          href="/tools/3d-cad-viewer"
          className={cadStyles['cad-conversion-button']}
          style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', color: 'white' }}
        >
          Open CAD Viewer →
        </Link>
      </div>
    </div>
  );
}

export default CadViewerCrossLink;
