import React from 'react'
import cadStyles from '../CadHomeDesign/CadHome.module.css'
import CadHomeDropZone from '../CadHomeDesign/CadHomeDropZone'
import HomeTopNav from '@/Components/HomePages/HomepageTopNav/HomeTopNav'

function CadUpload({type}) {
  return (
    <>
    <HomeTopNav/>
     <div className={cadStyles['cad-uploading']}>
        <div className={cadStyles['cad-landing-left-cont']}>
            <div className={cadStyles['cad-landing-left-content']}> <span className={cadStyles['cad-landing-heading']}>Title in multiple line</span>
            <span className={cadStyles['cad-landing-description']}>Subtext in max 2-3 lines
            for the offering of the page</span></div>
           
            <CadHomeDropZone isStyled={true} type={type}/>
        </div>
        <div className={cadStyles['cad-uploading-circle-bg']}></div>
    </div>
    </>
   
  )
}

export default CadUpload