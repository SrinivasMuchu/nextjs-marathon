
import React from "react";
import styles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadFileConversionWrapper from './CadFileConversionWrapper'

function CadFileUploads({ convert, allowedFormats, initialAllowedFormats = [], designVariant }) {
    // Use initialAllowedFormats on first paint (from server params) to avoid CLS when context hydrates
    const formats = (allowedFormats?.length ? allowedFormats : initialAllowedFormats) || [];
    const formatsText = convert
      ? (formats.length ? `Supported formats: ${formats.join(', ')}` : 'Supported formats: …')
      : 'Supported formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj), 3DM (.3dm), DWG (.dwg), DXF (.dxf)';

    const isConverterHero = designVariant === 'converterHero';

    const dropInner = isConverterHero ? (
      <div className={heroStyles.heroUploadPanelContent}>
        <p className={heroStyles.heroUploadPanelHead}>Drag and drop your 3D file here</p>
        <p className={heroStyles.heroUploadPanelHint}>or choose a file from your computer</p>
        <span className={heroStyles.heroUploadPanelFile}>Browse files</span>
        <p className={heroStyles.heroUploadMaxSize}>Maximum file size: 300 MB</p>
      </div>
    ) : (
      <div className={styles["cad-dropzone-content"]}>
        <p className={styles['cad-dropzone-head']}>
          Drag &amp; drop your 3D{' '}
          <span className={styles['cad-dropzone-file']} style={{ cursor: 'pointer' }}>
            file
          </span>{' '}
          here to convert
        </p>
          <p className={styles['cad-dropzone-desc']}>
            {formatsText}
          </p>
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
