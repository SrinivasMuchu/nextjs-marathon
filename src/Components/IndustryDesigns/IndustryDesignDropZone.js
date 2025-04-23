import React from 'react'
import IndustryDesignHead from './IndustryDesignHead'
import styles from '../CadUploadingHome/CadHomeDesign/CadHome.module.css'
import IndustryDesignUpload from './IndustryDesignUpload'
import OrgFeatures from '../OrganizationHome/OrgFeatures/OrgFeatures'


function IndustryDesignDropZone() {
    return (
        <div className={styles['industry-design']}>
            <div className={styles['cad-landing-left-cont']}>
                <IndustryDesignHead />
                <IndustryDesignUpload/>
                <br/>
                <br/>
                <OrgFeatures type='cad' />
            </div>
        </div>
    )
}

export default IndustryDesignDropZone