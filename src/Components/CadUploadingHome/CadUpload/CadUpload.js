import React from 'react'
import cadStyles from '../CadHomeDesign/CadHome.module.css'
import CadDropZoneContent from '../CadHomeDesign/CadDropZoneContent'
import HomeTopNav from '@/Components/HomePages/HomepageTopNav/HomeTopNav'
import CadUploadHeadings from './CadUploadHeadings'
import LeftRightBanner from '@/Components/CommonJsx/Adsense/AdsBanner'

function CadUpload({type}) {
  return (
    <>
   
     <div className={cadStyles['cad-landing-page']} style={{position:'relative'}}>
     <div style={{width:'100%',maxWidth:'100%',margin:'0 auto',boxSizing:'border-box',position:'relative',height:'100px'}}>
                <LeftRightBanner adSlot="3755241003"/>
            </div>
        <div className={cadStyles['cad-landing-left-cont']}>
           <CadUploadHeadings/>
           <CadDropZoneContent isStyled={true} type={type}/>
            
        </div>
        {/* <div className={cadStyles['cad-uploading-circle-bg']}></div> */}
    </div>
    </>
   
  )
}

export default CadUpload