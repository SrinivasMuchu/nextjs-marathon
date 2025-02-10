"use client";
import React, { useEffect, useState, useRef } from "react";

function SecurityWrapper({ children,styles }) {
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
        <div className={styles["security-page"]} id="security"    >
            <div className={styles["security-container"]} ref={ref} style={{
                backgroundImage: isVisible &&
                    `url('https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/security-bg-comp.svg')`
            }}>
                {children}
            </div>

        </div>
    )

}

export default SecurityWrapper