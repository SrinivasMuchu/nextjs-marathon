import React from 'react';
import Link from 'next/link';
import cadStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';

function CadServicesCrossLink() {
  return (
    <div className={`${cadStyles['cad-industries']} ${cadStyles['cad-industries--purple']}`}>
      <div className={cadStyles['cad-industries-content']}>
        <h3>Need production-ready CAD help?</h3>
        <p>
          If viewing or converting the file is not enough, Marathon OS can match you with vetted CAD
          designers for production-ready files, edits, redesigns and manufacturing documentation.
        </p>
        <Link
          href="/cad-services"
          className={cadStyles['cad-conversion-button']}
          style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', color: 'white' }}
        >
          Get CAD design support →
        </Link>
      </div>
    </div>
  );
}

export default CadServicesCrossLink;
