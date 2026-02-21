import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './Industry.module.css'

function SolutionCad({ industryData = {} }) {
    // Split the solution text by periods and filter out any empty strings
    const solutionPoints = industryData.solution_for_cad_viewer
        ? industryData.solution_for_cad_viewer.split('.').map(point => point.trim()).filter(point => point.length > 0)
        : [];

    // Default points if no data is provided




    return (
        <div className={styles['solution-cad']}>
            <div className={styles['solution-cad-content']}>
                <h3>The Solution: Marathon-OS CAD Viewer</h3>

                {solutionPoints.map((point, index) => (
                    <li key={index}>
                        {point.trim()}{point.trim().endsWith('.') ? '' : '.'}
                    </li>
                ))}

            </div>
            <div>
                <Image
                    src={IMAGEURLS.solutionCad}
                    alt='Marathon-OS CAD Viewer solution'
                    width={400}
                    height={400}
                    className={styles['solution-cad-image']}
                />
            </div>
        </div>
    )
}

export default SolutionCad