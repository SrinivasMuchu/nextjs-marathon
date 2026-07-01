import React from 'react'
import IndustryDesignHeader from './IndustryDesignHeader'
import IndustryDesignFilesList from './IndustryDesignFilesList'
import IndustryDesignsSuggestion from './IndustryDesignsSuggestion'
import { IoMdInformationCircleOutline } from "react-icons/io";
import AdminApprovalButtons from '../CommonJsx/AdminApprovalButtons'
import AboutCad from './AboutCad'
import IndustryDesignsCarousel from './IndustryDesignsCarousel'
import IndustryDesignDropZone from './IndustryDesignDropZone'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav'
import Footer from '../HomePages/Footer/Footer'
import ActiveLastBreadcrumb from '../CommonJsx/BreadCrumbs'
import ProductStructuredData from '../JsonLdSchemas/DesignPageJsonLd'
import styles from './IndustryDesign.module.css'
import AnchorAdBanner from '../CommonJsx/Adsense/AnchorAdBanner'
import IndustryHeaderDetails from './IndustryHeaderDetails'
import DownloadsRatingAlert from '../CreatorsPage/DownloadsRatingAlert'
import CadDesignDownload from './CadDesignDownlaod'
import DesignViewer from './DesignViewer';
import DesignComments from './DesignComments';
import IndustryDesignSupportFileList from './IndustryDesignSupportFileList';
import LeftRightBanner from '../CommonJsx/Adsense/AdsBanner';
import DesignHub from '../HomePages/DesignHub/DesignHub';
import RecentlyAddedDesigns from '../HomePages/RecentlyAddedDesigns/RecentlyAddedDesigns';
import StickyCadStrip from '../CadServicesBanners/StickyCadStrip';
import TwoDDrawingCtaBanner from './TwoDDrawingCtaBanner';
import ProductDetailToolLinks from '../CommonJsx/CrossTemplateLinks/ProductDetailToolLinks';
import ProductDetailGuidance from './ProductDetailGuidance';
import { cleanLibraryProductName } from '@/lib/seo/libraryProductDetail';

// Page heading structure: 1 h1 (IndustryHeaderDetails), 2 h2s (AboutCad, first IndustryDesignsSuggestion), rest h3 (second IndustryDesignsSuggestion if present).
function IndustryDesign({ design, designData, type }) {
  const isLibraryDetail = type === 'library';
  const response = designData?.response;
  const libraryRoute = String(response?.route || design || '').trim();
  const hasTwoDDrawings = Boolean(response?.is_two_dims && libraryRoute);
  const twoDPageHref = hasTwoDDrawings
    ? `/library/2d-technical-drawings/${encodeURIComponent(libraryRoute)}`
    : '';
  const cleanTitle = response
    ? cleanLibraryProductName(response.page_title || response.part_name)
    : '';
  const pipelineHref = response?._id
    ? `/tools/cad-drawing-pipeline?source=${encodeURIComponent(response._id)}`
    : '/tools/cad-drawing-pipeline';

  return (
    <>
      {designData && designData.response && (
        <ProductStructuredData
          designData={designData.response}
          design={design}
          type={type}
          cadReport={designData.report}
        />
      )}

      <div className={styles['industry-design-page-root']}>
        {designData && <>
          {/* <HomeTopNav /> */}
          {!type ?
            <ActiveLastBreadcrumb
              alignWithHeader
              links={[
                { label: 'CAD viewer', href: '/tools/3d-cad-viewer' },
                { label: `${design.industry}`, href: `/industry/${design.industry}` },
                { label: `${designData.response.part_name}`, href: `/industry/${design.industry}/${design.part}` },
                { label: `${designData.response.page_title}`, href: `/industry/${design.industry}/${design.part}/${design.design_id}` },

              ]}
            /> : <ActiveLastBreadcrumb
              alignWithHeader
              links={[
                { label: 'Library', href: '/library' },
                { label: cleanTitle || response.page_title, href: `/library/${design}` },

              ]}
            />}
            
            <div style={{width:'100%',display:'flex',justifyContent:'center',boxSizing:'border-box',position:'relative',minHeight:'100px'}}>
                <div style={{width:'100%',maxWidth:'970px',margin:'0 auto'}}>
                    <LeftRightBanner adSlot="4923244212"/>
                </div>
            </div>
            <IndustryHeaderDetails designData={designData} isLibraryDetail={isLibraryDetail}/>
          <div className={styles['industry-design-header-container']} >
          
          {/* <div className={styles['mobile-only']}>
            <IndustryHeaderDetails designData={designData}/>
          </div> */}
            <div  className={styles['industry-design-header-container-left']}  >
              <DesignViewer designId={designData.response._id} designData={designData.response}/>
              <h3 style={{fontSize:'20px',fontWeight:'600',lineHeight:'28px',color:'#001325',marginTop:'24px'}}>About this design</h3>
              <p>{designData.response.page_description}</p>
            </div>
            <div  className={styles['industry-design-header-container-right']} >
              {/* <div className={styles['desktop-only']}>
                <IndustryHeaderDetails designData={designData}/>
              </div> */}
              {/* <AdminApprovalButtons design_id={designData.response._id}/> */}
              <IndustryDesignHeader design={design} type={type} designData={designData.response} />
              <CadDesignDownload designId={designData.response._id} designTitle={designData.response.page_title}/>
              {isLibraryDetail && (
                <ProductDetailToolLinks
                  fileType={response.file_type}
                  hasTwoDDrawings={hasTwoDDrawings}
                  twoDDrawingHref={twoDPageHref}
                />
              )}

              <div className={styles['industry-design-files-container']}>
                <div className={styles['industry-design-files-head']}>
                  <IoMdInformationCircleOutline />
                  <p>The files are shared to help you get inspired and speed up your workflow. They may not be fully accurate or production-ready, so review carefully before use.</p>
                </div>
              
              </div>
              {response && <IndustryDesignFilesList designData={response} isLibraryDetail={isLibraryDetail} />}
              {designData.response && (
                <div className={`${styles['industry-design-files-container']} ${styles['industry-design-files-supporting-wrapper']}`}>
                  <IndustryDesignSupportFileList designData={designData.response} />
                </div>
              )}
              
              {/* {designData?.report && (
                <AboutCad cadReport={designData.report} filetype={designData.response.file_type} />
              )} */}
            </div>

          </div>

          {designData?.report && (
                <AboutCad
                  cadReport={designData.report}
                  filetype={response.file_type}
                  isLibraryDetail={isLibraryDetail}
                />
              )}

          {isLibraryDetail && response && (
            <ProductDetailGuidance design={response} />
          )}

          {isLibraryDetail ? (
            <TwoDDrawingCtaBanner
              title="Need 2D engineering drawings for this CAD model?"
              description="Generate multi-view 2D technical drawings from this 3D CAD file, including orthographic views, section cuts and downloadable PDF, SVG and DXF files."
              buttonLabel="Generate 2D drawing"
              generateHref={pipelineHref}
              secondaryHref={hasTwoDDrawings ? twoDPageHref : ''}
              secondaryButtonLabel="View existing 2D drawings"
            />
          ) : (
            <TwoDDrawingCtaBanner
              title="Want 2D engineering drawings for this CAD?"
              description="Upload any STEP, IGES, or FreeCAD file (including this design's source file). Our AI analyses the 3D geometry, picks the best views, places dimensions, and returns a complete 2D drawing set — editable FCStd plus PDF, SVG, and DXF — in under 4 minutes."
            />
          )}

          {designData?.response?._id && (
                <DesignComments designId={designData.response._id} />
              )}
          
          {/* {(designData.designs.length && designData.industryName) && <IndustryDesignsSuggestion type='design' design_type={type} designData={designData.designs} design={design}
            industryName={designData.industryName.industry} headingLevel={2} />}
          {designData.filteredResults && <IndustryDesignsSuggestion designData={designData.filteredResults} design={design} design_type={type} headingLevel={3} />}
          <div style={{ width: '100%', height: '15px', background: '#F4F4F4' }}></div> */}
         
         
          {/* <AnchorAdBanner adSlot='4237862906' /> */}
        </>}

      </div>
      <DesignHub headingLevel={3} />
          <RecentlyAddedDesigns />
          <IndustryDesignDropZone />
      <StickyCadStrip />
      <Footer />
    </>

  )
}

export default IndustryDesign