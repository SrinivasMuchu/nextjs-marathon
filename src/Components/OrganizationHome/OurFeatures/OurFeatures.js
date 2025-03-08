import React from 'react'
import ChartStyles from '../ChartBuilder/ChartBuilder.module.css'
import styles from './OurFeatures.module.css'

function OurFeatures() {
    const OurFeatures = [
        {
            title: 'Seamless Data Import & Export',
            description: 'Import employee and department details effortlessly and export org charts in Excel for easy sharing and integration.'
        },
        {
            title: 'Department as an Entity',
            description: 'Clearly define and visualize both employees and departments for a better organizational overview.'
        },
        {
            title: 'Free for Small Teams',
            description: 'Get full access for up to 50 members and 20 departments—no cost, no hidden fees.'
        },
        {
            title: 'Secure & Privacy-Focused',
            description: "Your data is securely stored for 24 hours before automatic deletion, ensuring maximum privacy and security."
        },
        {
            title: 'Zero Learning Curve',
            description: 'No setup or training needed—simply enter your data, generate your org chart, and export it in minutes.'
        },
    ]
    return (
        <div className={styles['our-feature-page']}>
            <div className={ChartStyles['chart-builder-text']}>
                <span className={ChartStyles['chart-builder-text-heading']}>
                    Essential Features of Marathon OS Chart Builder
                </span>
                <span className={ChartStyles['chart-builder-text-description']}>
                    Effortlessly create, manage, and share org charts with a simple, secure, and scalable tool.
                    Visualize employees and departments with ease—no training required—whether you&apos;re structuring a
                    startup or managing a growing enterprise.

                </span>
            </div>
            <div className={styles['our-feature-page-boxes']}>
                {OurFeatures.map((feature, index) => (
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