import React from 'react'
import IndustryDesignHeader from './IndustryDesignHeader'
import IndustryDesignFilesList from './IndustryDesignFilesList'
import IndustryDesignsSuggestion from './IndustryDesignsSuggestion'
import AboutCad from './AboutCad'
import IndustryDesignsCarousel from './IndustryDesignsCarousel'
import IndustryDesignDropZone from './IndustryDesignDropZone'
import HomeTopNav from '../HomePages/HomepageTopNav/HomeTopNav'
import Footer from '../HomePages/Footer/Footer'
import ActiveLastBreadcrumb from '../CommonJsx/BreadCrumbs'
import ProductStructuredData from '../CommonJsx/DesignPageJsonLd'
import styles from './IndustryDesign.module.css'

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

          <IndustryDesignHeader design={design} type={type} designData={designData.response} />
          {/* <AboutCadPara cadReport={designData.report}/> */}
          {designData.response && <IndustryDesignsCarousel designData={designData.response} design={design} type={type} />}
          <div className={styles['industry-design-files']}>
            <div className={styles['industry-design-files-head']}>
              The files are shared to help you get inspired and speed up your workflow. They may not be fully accurate or production-ready, so review carefully before use.
            </div>
          </div>

          {designData?.report && (
            <AboutCad cadReport={designData.report} filetype={designData.response.file_type} />
          )}
          {designData.response && <IndustryDesignFilesList designData={designData.response} />}
          {(designData.designs.length && designData.industryName) && <IndustryDesignsSuggestion type='design' design_type={type} designData={designData.designs} design={design}
            industryName={designData.industryName.industry} />}
          {designData.filteredResults && <IndustryDesignsSuggestion designData={designData.filteredResults} design={design} design_type={type} />}
          <div style={{ width: '100%', height: '15px', background: '#F4F4F4' }}></div>

          <IndustryDesignDropZone />
          <Footer />
        </>}

      </div>

    </>

  )
}

export default IndustryDesign