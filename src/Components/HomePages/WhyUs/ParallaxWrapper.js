"use client"
import React from 'react'
import ReactParallaxTilt from 'react-parallax-tilt';

function ParallaxWrapper({children,styles}) {
  return (
    <ReactParallaxTilt
        tiltMaxAngleX={15}  // Tilt on the X-axis
        tiltMaxAngleY={15}  // Tilt on the Y-axis
        perspective={1000}   // Depth of the effect
        scale={1.05}         // Slightly zoom in on tilt
        transitionSpeed={1500} // Speed of transition
        className={styles["whyus-cont"]} // Apply to the full div
    >{children}</ReactParallaxTilt>
  )
}

export default ParallaxWrapper