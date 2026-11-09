
import React from "react";
import styles from '../CadHomeDesign/CadHome.module.css'
import heroStyles from '../CadHomeDesign/CadViewerHero.module.css'
import homeStyles from '@/Components/HomePages/HomeLandingNew/HomeHero.module.css'
import CadFileConversionWrapper from './CadFileConversionWrapper'
import { getUniquePairPage } from '@/data/converterPairUniquePages'
import { CONVERTER_HUB_PAGE } from '@/data/converterHubPage'

function CadFileUploads({ convert, conversionParams, allowedFormats, initialAllowedFormats = [], designVariant, preferredOutput }) {
    // Use initialAllowedFormats on first paint (from server params) to avoid CLS when context hydrates
    const uniquePage = getUniquePairPage(conversionParams)
    const formats = (allowedFormats?.length ? allowedFormats : initialAllowedFormats) || [];
    const formatsText = convert
      ? (formats.length ? `Supported formats: ${formats.join(', ')}` : 'Supported formats: …')
      : 'Supported formats: STEP (.step, .stp), IGES (.igs, .iges), STL (.stl), PLY (.ply), OFF (.off), BREP (.brp, .brep), OBJ (.obj), 3DM (.3dm), 3MF (.3mf), DWG (.dwg), DXF (.dxf)';

    const isStep3dm = designVariant === 'step3dmHero';
    const isConverterHero = designVariant === 'converterHero' || designVariant === 'stepToStlHero' || isStep3dm;
    const pairSource = String(conversionParams || '').split('-to-')[0].toLowerCase();
    const dropCopy = pairSource === 'stl'
      ? { title: 'Drop your STL file here', hint: '.stl · up to 300 MB' }
      : { title: 'Drop your STEP file here', hint: '.step or .stp · up to 300 MB' };

    const dropInner = isStep3dm ? (
      <>
        <div className={homeStyles.dropIcon} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>
        </div>
        <strong>{dropCopy.title}</strong>
        <div className={homeStyles.or}>or <span className={homeStyles.browse}>browse files</span></div>
        <small className={homeStyles.hint}>{dropCopy.hint}</small>
      </>
    ) : isConverterHero ? (
      <div className={`${heroStyles.heroUploadPanelContent} ${designVariant === 'stepToStlHero' ? heroStyles.stepDropzone : ''}`}>
        <p className={heroStyles.heroUploadPanelHead}>
          {uniquePage?.dropzoneHead || CONVERTER_HUB_PAGE.dropzoneHead}
        </p>
        {designVariant === 'stepToStlHero' ? null : (
          <p className={heroStyles.heroUploadPanelHint}>or choose a file from your computer</p>
        )}
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

    if (isStep3dm) {
      return (
        <CadFileConversionWrapper
          convert={convert}
          conversionParams={conversionParams}
          designVariant={designVariant}
          heroFormatsLine={formatsText}
          preferredOutput={preferredOutput}
        >
          {dropInner}
        </CadFileConversionWrapper>
      );
    }

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
