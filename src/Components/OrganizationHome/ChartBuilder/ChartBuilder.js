import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './ChartBuilder.module.css'

function ChartBuilder({whyChoose,featuresArray}) {
   
    return (
        <div className={styles['chart-builder-page']}>
            <div className={styles['chart-builder-text']}>
                <span className={styles['chart-builder-text-heading']}>
                  {whyChoose.title}  
                </span>
                <span className={styles['chart-builder-text-description']}>
                    {whyChoose.description}
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