import React from 'react';
import Link from 'next/link';
import cadStyles from '@/Components/CadUploadingHome/CadHomeDesign/CadHome.module.css';
import { getUniqueViewerPage } from '@/data/viewerUniquePages';

function ConvertCrossLink({ cadType, uniquePage: uniquePageProp }) {
  const uniquePage = uniquePageProp || getUniqueViewerPage(cadType);
  const HeadingTag = uniquePage?.converterHeadingLevel === 2 ? 'h2' : 'h3';

  return (
    <div className={cadStyles['cad-industries']}>
      <div className={cadStyles['cad-industries-content']}>
        <HeadingTag>{uniquePage?.converterHeading || 'Need to convert a CAD file?'}</HeadingTag>
        <p>
          {uniquePage?.converterBody ||
            'If you need the file in another format, use Marathon OS CAD Converter to convert between STEP, STL, IGES, OBJ, PLY, BREP, 3DM, DWG and DXF.'}
        </p>
        <Link
          href={uniquePage?.converterHref || '/tools/3d-cad-file-converter'}
          className={cadStyles['cad-conversion-button']}
          style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', color: 'white' }}
        >
          {uniquePage?.converterCta || 'Convert 3D CAD Files →'}
        </Link>
      </div>
    </div>
  );
}

export default ConvertCrossLink;
