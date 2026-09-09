
import React from "react";
import styles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import CadFileConversionWrapper from './CadFileConversionWrapper'
import { getUniquePairPage } from '@/data/converterPairUniquePages'

function CadFileUploads({ convert, conversionParams, allowedFormats, initialAllowedFormats = [], designVariant, preferredOutput }) {
    // Use initialAllowedFormats on first paint (from server params) to avoid CLS when context hydrates
    const uniquePage = getUniquePairPage(conversionParams)
    const formats = (allowedFormats?.length ? allowedFormats : initialAllowedFormats) || [];
    const formatsText = convert
      ? (formats.length ? `Supported formats: ${formats.join(', ')}` : 'Supported formats: …')
      : 'Supported formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj), 3DM (.3dm), DWG (.dwg), DXF (.dxf)';

    const isConverterHero = designVariant === 'converterHero';

    const dropInner = isConverterHero ? (
      <div className={heroStyles.heroUploadPanelContent}>
        <p className={heroStyles.heroUploadPanelHead}>
          {uniquePage?.dropzoneHead || 'Drag and drop your 3D file here'}
        </p>
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
                  conversionParams={conversionParams}
                  designVariant={designVariant}
                  heroFormatsLine={formatsText}
                  preferredOutput={preferredOutput}
                >
                  {dropInner}
                </CadFileConversionWrapper>
              </div>
            ) : (
              <CadFileConversionWrapper
                convert={convert}
                conversionParams={conversionParams}
                designVariant={designVariant}
                preferredOutput={preferredOutput}
              >
                {dropInner}
              </CadFileConversionWrapper>
            )}
        </>
    );
}

export default CadFileUploads;
