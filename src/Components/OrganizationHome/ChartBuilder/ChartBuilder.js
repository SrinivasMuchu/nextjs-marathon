import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './ChartBuilder.module.css'

function ChartBuilder() {
    const featuresArray = [
        {
            title: 'Always Up-to-Date',
            description: 'Keep organizational data accurate and accessible in real time.'
        },
        {
            title: 'Customizable & Flexible',
            description: 'Adapt charts to match your company’s unique structure and hierarchy.'
        },
        {
            title: 'Seamless Sharing',
            description: 'Export and share org charts effortlessly across teams and leadership.'
        },
        {
            title: 'Optimized for Growth',
            description: "Scales with your company, whether you're a startup or an enterprise."
        },
        {
            title: 'Reliable & Secure',
            description: 'Keep sensitive organizational data protected with built-in security features.'
        },

    ]
    return (
        <div className={styles['chart-builder-page']}>
            <div className={styles['chart-builder-text']}>
                <span className={styles['chart-builder-text-heading']}>
                    Why Choose Marathon OS Chart Builder?
                </span>
                <span className={styles['chart-builder-text-description']}>
                    Effortlessly create, manage, and share org charts with Marathon OS Chart Builder. Designed for speed, accuracy, and scalability,
                    it keeps your team organized and helps you make smarter organizational decisions.
                </span>
            </div>
            <div className={styles['chart-builder-points']}>
                {featuresArray.map((feature, index) => (
                    <div key={index} className={styles['chart-builder-points-container']}>
                        <Image src={IMAGEURLS.check} alt="Organization Features" width={24} height={24} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className={styles['chart-builder-points-head']}>{feature.title}</span>
                            <span className={styles['chart-builder-points-description']}>{feature.description}</span>
                        </div>

                    </div>
                ))}
            </div>



        </div>
    )
}

export default ChartBuilder