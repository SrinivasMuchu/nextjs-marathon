import React from 'react'
import ChartStyles from '../ChartBuilder/ChartBuilder.module.css'
import styles from './OurFeatures.module.css'

function OurFeatures({ features, essentialDeatails, headingLevel = 2, variant }) {
    const HeadingTag = headingLevel === 3 ? 'h3' : 'h2'
    const pageClass =
        variant === 'dark'
            ? `${styles['our-feature-page']} ${styles['our-feature-pageDark']}`
            : styles['our-feature-page']
    const textBlockClass =
        variant === 'dark'
            ? `${ChartStyles['chart-builder-text']} ${ChartStyles['chart-builder-textDark']}`
            : ChartStyles['chart-builder-text']

    return (
        <div className={pageClass}>
            <div className={textBlockClass}>
                <HeadingTag className={ChartStyles['chart-builder-text-heading']}>
                    {essentialDeatails.title}
                </HeadingTag>
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