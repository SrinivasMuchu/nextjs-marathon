import React from 'react'
import ChartStyles from '../ChartBuilder/ChartBuilder.module.css'
import styles from './OurFeatures.module.css'

function OurFeatures({features,essentialDeatails}) {
    
    return (
        <div className={styles['our-feature-page']}>
            <div className={ChartStyles['chart-builder-text']}>
                <span className={ChartStyles['chart-builder-text-heading']}>
                    {essentialDeatails.title}
                </span>
                <span className={ChartStyles['chart-builder-text-description']}>
                    {essentialDeatails.description}
                </span>
            </div>
            <div className={styles['our-feature-page-boxes']}>
                {features.map((feature, index) => (
                    <div key={index} className={styles['our-feature-page-container']}>
                        
                            <span className={styles['our-feature-page-container-head']}>{feature.title}</span>
                            <span className={styles['our-feature-page-container-description']}>{feature.description}</span>
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OurFeatures