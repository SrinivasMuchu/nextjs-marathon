"use client"
import React from 'react'
import Image from "next/image";
import { IMAGEURLS } from "@/config";
import ReactParallaxTilt from 'react-parallax-tilt';

function WhyUsCards({styles}) {
  return (
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
  )
}

export default WhyUsCards