import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './ChartBuilder.module.css'

function ChartBuilder({ whyChoose, featuresArray, headingLevel = 2 }) {
    const HeadingTag = headingLevel === 3 ? 'h3' : 'h2'
    return (
        <div className={styles['chart-builder-page']}>
            <div className={styles['chart-builder-text']}>
                <HeadingTag className={styles['chart-builder-text-heading']}>
                  {whyChoose.title}
                </HeadingTag>
                <p className={styles['chart-builder-text-description']}>
                    {whyChoose.description}
                </p>
            </div>
            <div className={styles['chart-builder-points']}>
                {featuresArray.map((feature, index) => (
                    <div key={index} className={styles['chart-builder-points-container']}>
                        <Image src={IMAGEURLS.check} alt="Organization Features" width={24} height={24} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h6 className={styles['chart-builder-points-head']}>{feature.title}</h6>
                            <p className={styles['chart-builder-points-description']}>{feature.description}</p>
                        </div>

                    </div>
                ))}
            </div>



        </div>
    )
}

export default ChartBuilder