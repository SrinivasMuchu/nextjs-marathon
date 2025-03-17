import React from 'react'
import ChartStyles from '../ChartBuilder/ChartBuilder.module.css'
import styles from './OurFeatures.module.css'

function OurFeatures({features,essentialDeatails}) {
    
    return (
        <div className={styles['our-feature-page']}>
            <div className={ChartStyles['chart-builder-text']}>
                <h1 className={ChartStyles['chart-builder-text-heading']}>
                    {essentialDeatails.title}
                </h1>
                <p className={ChartStyles['chart-builder-text-description']}>
                    {essentialDeatails.description}
                </p>
            </div>
            <div className={styles['our-feature-page-boxes']}>
                {features.map((feature, index) => (
                    <div key={index} className={styles['our-feature-page-container']}>
                        
                            <h6 className={styles['our-feature-page-container-head']}>{feature.title}</h6>
                            <p className={styles['our-feature-page-container-description']}>{feature.description}</p>
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OurFeatures