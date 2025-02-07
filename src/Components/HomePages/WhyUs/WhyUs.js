"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from './WhyUs.module.css'
import Image from "next/image";
import { IMAGEURLS } from "@/config";
import ReactParallaxTilt from 'react-parallax-tilt';

function WhyUs() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing after loading
                }
            },
            { rootMargin: "0px", threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);
    return (
        <div id='why-us' className={styles["whyus-page"]}   ref={ref}
        style={{
            backgroundImage: isVisible && 
                `url('https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/why-marathon-bg.svg')`
               
        }}>
            <div className={styles["whyus-page-head"]} style={{ margin: '0px' }}>
                <span className={styles["whyus-head"]}>Why Marathon-OS?</span>
                <span className={styles["whyus-desc"]}>Build Product Faster with Accurate Data. Manage CAD, Parts, Documents,
                    Bill of Materials, Vendors, Inventories & Purchases</span>
            </div>
            <div className={styles["whyus-conts"]}>
                <ReactParallaxTilt
                    tiltMaxAngleX={15}  // Tilt on the X-axis
                    tiltMaxAngleY={15}  // Tilt on the Y-axis
                    perspective={1000}   // Depth of the effect
                    scale={1.05}         // Slightly zoom in on tilt
                    transitionSpeed={1500} // Speed of transition
                    className={styles["whyus-cont"]} // Apply to the full div
                >
                    <div>
                        <Image
                            src={IMAGEURLS.allInOne}
                            alt="All-in-One platform"
                            width={68}
                            height={68}
                        />
                    </div>

                    <div className={styles["whyus-cont-text"]}>
                        <span className={styles["whyus-cont-head"]}>
                            All-in-One platform
                        </span>
                        <span className={styles["whyus-cont-desc"]}>
                            Marathon-OS seamlessly integrates every stage of the hardware product lifecycle.
                            From part design and engineering to manufacturing, supply chain management, and maintenance.
                        </span>
                    </div>
                </ReactParallaxTilt>

                <ReactParallaxTilt
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    perspective={1000}
                    scale={1.05}
                    transitionSpeed={1500}
                    className={styles["whyus-cont"]} // Apply to the full div
                >
                    <div>
                        <Image
                            src={IMAGEURLS.carManufac}
                            alt="Encryption in transit"
                            width={68}
                            height={68}
                        />
                    </div>

                    <div className={styles["whyus-cont-text"]}>
                        <span className={styles["whyus-cont-head"]}>
                            Tailored for hardware companies
                        </span>
                        <span className={styles["whyus-cont-desc"]}>
                            Marathon-OS provides industry-specific tools, such as BOM management,
                            production scheduling, and CAD data integration, ensuring your operations are optimized for hardware workflows.
                        </span>
                    </div>
                </ReactParallaxTilt>

                <ReactParallaxTilt
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    perspective={1000}
                    scale={1.05}
                    transitionSpeed={1500}
                    className={styles["whyus-cont"]} // Apply to the full div
                >
                    <div>
                        <Image
                            src={IMAGEURLS.cloud}
                            alt="Encryption in transit"
                            width={68}
                            height={68}
                        />
                    </div>

                    <div className={styles["whyus-cont-text"]}>
                        <span className={styles["whyus-cont-head"]}>
                            Cloud-based realtime collaboration
                        </span>
                        <span className={styles["whyus-cont-desc"]}>
                            With real-time updates, check-in/check-out features,
                            and unlimited cloud storage, Marathon-OS ensures everyone is on the same page, reducing errors and miscommunication.
                        </span>
                    </div>
                </ReactParallaxTilt>

                <ReactParallaxTilt
                    tiltMaxAngleX={15}
                    tiltMaxAngleY={15}
                    perspective={1000}
                    scale={1.05}
                    transitionSpeed={1500}
                    className={styles["whyus-cont"]} // Apply to the full div
                >
                    <div>
                        <Image
                            src={IMAGEURLS.customised}
                            alt="Customizable & scalable"
                            width={68}
                            height={68}
                        />
                    </div>

                    <div className={styles["whyus-cont-text"]}>
                        <span className={styles["whyus-cont-head"]}>
                            Customizable & scalable to your needs
                        </span>
                        <span className={styles["whyus-cont-desc"]}>
                            Customize workflows, templates, and processes to fit your specific requirements.
                            As your business grows, Marathon-OS scales with you, offering a seamless, flexible solution.
                        </span>
                    </div>
                </ReactParallaxTilt>
            </div>
        </div>
    )
}

export default WhyUs