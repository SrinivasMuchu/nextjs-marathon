"use client"
import React from "react";
import ReactParallaxTilt from "react-parallax-tilt"; // Ensure correct import

function CapabilityParallaxWrapper({ children, styles }) {
  return (
    <ReactParallaxTilt
    tiltMaxAngleX={10}
    tiltMaxAngleY={10} 
    perspective={1000} 
    scale={1} 
    transitionSpeed={1500} className={styles['capabilities-page-card']}
    >
      {children}
    </ReactParallaxTilt>
  );
}

export default CapabilityParallaxWrapper;
