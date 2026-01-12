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
import ProductStructuredData from '../CommonJsx/DesignPageJsonLd'
import styles from './IndustryDesign.module.css'
import AnchorAdBanner from '../CommonJsx/Adsense/AnchorAdBanner'
import IndustryHeaderDetails from './IndustryHeaderDetails'
import DownloadsRatingAlert from '../CreatorsPage/DownloadsRatingAlert'
import CadDesignDownload from './CadDesignDownlaod'
import DesignViewer from './DesignViewer';
import IndustryDesignSupportFileList from './IndustryDesignSupportFileList';

function IndustryDesign({ design, designData, type }) {


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

      <div>
        {designData && <>
          {/* <HomeTopNav /> */}
          {!type ?
            <ActiveLastBreadcrumb
              links={[
                { label: 'CAD viewer', href: '/tools/cad-viewer' },
                { label: `${design.industry}`, href: `/industry/${design.industry}` },
                { label: `${designData.response.part_name}`, href: `/industry/${design.industry}/${design.part}` },
                { label: `${designData.response.page_title}`, href: `/industry/${design.industry}/${design.part}/${design.design_id}` },

              ]}
            /> : <ActiveLastBreadcrumb
              links={[
                { label: 'Library', href: '/library' },
                { label: `${designData.response.page_title}`, href: `/library/${design.industry_design}` },

              ]}
            />}
          <div className={styles['industry-design-header-container']} >
          <div className={styles['mobile-only']}>
            <IndustryHeaderDetails designData={designData}/>
          </div>
            <div  className={styles['industry-design-header-container-left']}  >
              <DesignViewer designId={designData.response._id} designData={designData.response}/>
            </div>
            <div  className={styles['industry-design-header-container-right']} >
              <div className={styles['desktop-only']}>
                <IndustryHeaderDetails designData={designData}/>
              </div>
              {/* <AdminApprovalButtons design_id={designData.response._id}/> */}
              <IndustryDesignHeader design={design} type={type} designData={designData.response} />
              <CadDesignDownload designId={designData.response._id} designTitle={designData.response.page_title}/>

              {/* <div className={styles['industry-design-files']}> */}

              <div className={styles['industry-design-files-head']}>
                <IoMdInformationCircleOutline style={{width:'65px',height:'65px'}}/>
                <p> The files are shared to help you get inspired and speed up your workflow. They may not be fully accurate or production-ready, so review carefully before use.</p>

                {/* </div> */}
              </div>
              {designData.response && <IndustryDesignFilesList designData={designData.response} />}
              {designData.response.supporting_files && <IndustryDesignSupportFileList designData={designData.response} />}
              
              {designData?.report && (
                <AboutCad cadReport={designData.report} filetype={designData.response.file_type} />
              )}
            </div>

          </div>


          {(designData.designs.length && designData.industryName) && <IndustryDesignsSuggestion type='design' design_type={type} designData={designData.designs} design={design}
            industryName={designData.industryName.industry} />}
          {designData.filteredResults && <IndustryDesignsSuggestion designData={designData.filteredResults} design={design} design_type={type} />}
          <div style={{ width: '100%', height: '15px', background: '#F4F4F4' }}></div>

          <IndustryDesignDropZone />
          <Footer />
          <AnchorAdBanner adSlot='4237862906' />
        </>}

      </div>

    </>

  )
}

export default IndustryDesign