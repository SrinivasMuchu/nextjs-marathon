import React from 'react'
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'
import IndustryHeading from './IndustryHeading'
import IndustryUpload from './IndustryUpload'
import IndustryDesignUpload from '../IndustryDesigns/IndustryDesignUpload'

function IndustryDetails({industryData,part_name}) {
    return (
        <div className={styles['cad-landing-page']}>
            <div className={styles['cad-landing-left-cont']}>
                <IndustryHeading industryData={industryData} part_name={part_name}/>
                <IndustryDesignUpload/>

            </div>
        </div>
    )
}

export default IndustryDetails