"use client"
import React from "react";
import ReactParallaxTilt from "react-parallax-tilt";

function IndustryDesignParallelaxWrapper({children,styles}) {
    return (
        <ReactParallaxTilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1}
            transitionSpeed={1500} style={{height:'300px'}} className={styles['capabilities-page-card']}
            style={{ height:'350px' }}
        >
            {children}
        </ReactParallaxTilt>
    )
}

export default IndustryDesignParallelaxWrapper