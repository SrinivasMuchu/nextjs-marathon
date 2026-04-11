

import React from "react";
import styles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadFileConversionWrapper from './CadFileConversionWrapper'

function CadFileUploads({ convert, allowedFormats, initialAllowedFormats = [], designVariant }) {
    // Use initialAllowedFormats on first paint (from server params) to avoid CLS when context hydrates
    const formats = (allowedFormats?.length ? allowedFormats : initialAllowedFormats) || [];
    const formatsText = convert
      ? (formats.length ? `Supported formats: ${formats.join(', ')}` : 'Supported formats: …')
      : 'Supported formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj), DWG (.dwg), DXF (.dxf)';

    const isConverterHero = designVariant === 'converterHero';

    const dropInner = (
      <div className={isConverterHero ? heroStyles.heroUploadPanelContent : styles["cad-dropzone-content"]}>
        <p className={isConverterHero ? heroStyles.heroUploadPanelHead : styles['cad-dropzone-head']}>
          Drag &amp; drop your 3D{' '}
          <span className={isConverterHero ? heroStyles.heroUploadPanelFile : styles['cad-dropzone-file']} style={{ cursor: 'pointer' }}>
            files
          </span>{' '}
          here to convert
        </p>
        {isConverterHero ? (
          <p className={heroStyles.heroUploadPanelHint}>or click to browse files</p>
        ) : (
          <p className={styles['cad-dropzone-desc']}>
            {formatsText}
          </p>
        )}
      </div>
    );

    return (
        <>
            {isConverterHero ? (
              <div className={heroStyles.uploadSection}>
                <CadFileConversionWrapper
                  convert={convert}
                  designVariant={designVariant}
                  heroFormatsLine={formatsText}
                >
                  {dropInner}
                </CadFileConversionWrapper>
              </div>
            ) : (
              <CadFileConversionWrapper convert={convert} designVariant={designVariant}>
                {dropInner}
              </CadFileConversionWrapper>
            )}
        </>
    );
}

export default CadFileUploads;

