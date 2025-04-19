import { IMAGEURLS } from '@/config'
import Image from 'next/image'
import React from 'react'
import styles from './Tools.module.css'

const toolsData = [
    {
        image: IMAGEURLS.orgChart,
        heading: 'Orgnaization hierarchy',
        description: 'Org Chart Maker – Fast & Easy Team Management',
        route: '/tools/org-hierarchy'
    },
    {
        image: IMAGEURLS.bmwLogo,
        heading: 'CAD viewer',
        description: 'A lightweight, online CAD viewer to quickly preview 3D models—anytime, anywhere.',
        route: '/tools/cad-viewer'
    },
    {
        image: IMAGEURLS.bmwLogo,
        heading: '3D file converter',
        description: 'A lightweight, online tool to convert 3D file formats—anytime, anywhere, without installing any software.',
        route: '/tools/3d-file-converter'
    },
]

function Tools() {
    return (
        <div className={styles['tools-page']}>
            <div className={styles['tools-page-header']}>
                <h2>Tools</h2>
                <p>description</p>
            </div>
            <div className={styles['tools-page-items']}>
                {toolsData.map((tool, index) => (
                    <a href={`${tool.route}`}>
                        <div key={index} className={styles['tools-page-items-cont']}>
                            <Image src={tool.image} alt={tool.heading} width={250} height={150} />
                            <div className={styles['tools-page-items-content']}>
                                <h6>{tool.heading}</h6>
                                <p>{tool.description}</p>
                            </div>
                        </div>
                    </a>

                ))}
            </div>
        </div>
    )
}

export default Tools
