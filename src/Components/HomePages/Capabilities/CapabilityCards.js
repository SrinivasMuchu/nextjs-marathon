"use client";
import React from 'react';
import styles from './Capabilities.module.css';
import Image from "next/image"; // Import Image from Next.js
import { IMAGEURLS } from "@/config";
import ReactParallaxTilt from 'react-parallax-tilt'; // Import react-parallax-tilt

const CAPABILITIESLIST = [
    {
        // image: IMAGEURLS.cadCapability,
        title: 'CAD Data Management',
        description: 'Efficiently handle files and designs with version control.'
    },
    {
        // image: IMAGEURLS.cadCapability,
        title: 'BOM and Part Management',
        description: 'BOM and Part Management.'
    },
    {
        // image: IMAGEURLS.cadCapability,
        title: 'Production Scheduling',
        description: 'Plan and monitor production in real time.'
    },
    {
        // image: IMAGEURLS.cadCapability,
        title: 'Inventory Management',
        description: 'Track and manage stock levels with ease.'
    },
    {
        // image: IMAGEURLS.cadCapability,
        title: 'Purchase Management',
        description: 'Streamline procurement and supplier orders.'
    },
    {
        // image: IMAGEURLS.cadCapability,
        title: 'Change Management',
        description: 'Implement ECOs with ease and traceability.'
    },
];

function CapabilityCards() {
    return (
        <>
            {CAPABILITIESLIST.map((capability, index) => (
                <ReactParallaxTilt key={index} tiltMaxAngleX={10}
                    tiltMaxAngleY={10} 
                    perspective={1000} 
                    scale={1} 
                    transitionSpeed={1500} className={styles['capabilities-page-card']}>

                    <div className={styles['capabilities-img-cont']}>
                        {/* <Image
                            src={capability.image}
                            alt={capability.title}
                            className={styles['capabilities-img']}
                            width={350}
                            height={150}
                        /> */}
                    </div>
                    <div className={styles['capabilities-page-card-text']}>
                        <span className={styles['capabilities-page-card-head']}>
                            {capability.title}
                        </span>
                        <span className={styles['capabilities-page-card-desc']}>
                            {capability.description}
                        </span>
                    </div>
                </ReactParallaxTilt>

            ))}
        </>
    );
}

export default CapabilityCards;
