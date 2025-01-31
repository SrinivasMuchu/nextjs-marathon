"use client";
import React, { useEffect, useState, useRef } from "react";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import styles from "./Security.module.css";


function Security({openDemoForm, setOpenDemoForm}) {
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
        <div className={styles["security-container"]} ref={ref}  style={{
        backgroundImage: isVisible && 
            `url('https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/security-bg-comp.svg')`
           
    }}>
          <div className={styles["security-container-div"]}></div>
          <div className={styles["security-content"]}>
            <span className={styles["security-head"]}>Designed for Security</span>
            <span className={styles["security-desc"]}>
              Capturing everything you see, say, and hear means trust and privacy
              is more important than anything else.
            </span>
            <div className={styles["security-btn"]}>
              <button onClick={()=>setOpenDemoForm(!openDemoForm)}>Request a demo</button>
            </div>
          </div>
          <div className={styles["security-points"]}>
            <div className={styles["security-points-1"]}>
              <div className={styles["security-internal-points"]}>
                {/* Use Next.js Image component for optimized image loading */}
                <Image
                  src={IMAGEURLS.points} // Ensure the correct path is set
                  alt="Encryption at rest"
                  width={40} // Adjust the width and height as necessary
                  height={40} unoptimized
                />
                <span className={styles["security-desc-points"]}>Encryption at rest</span>
              </div>
              <div className={styles["security-internal-points"]}>
                <Image
                  src={IMAGEURLS.points}
                  alt="Encryption in transit"
                  width={40} unoptimized
                  height={40}
                />
                <span className={styles["security-desc-points"]}>Encryption in transit</span>
              </div>
              <div className={styles["security-internal-points"]}>
                <Image
                  src={IMAGEURLS.points}
                  alt="Single-sign on"
                  width={40}
                  height={40} unoptimized
                />
                <span className={styles["security-desc-points"]}>Single-sign on</span>
              </div>
              {/* <div className={styles["security-internal-points"]}>
                <Image
                  src={IMAGEURLS.points}
                  alt="Multi-factor Authentication"
                  width={40}
                  height={40}
                />
                <span className={styles["security-desc-points"]}>Multi-factor Authentication</span>
              </div> */}
            </div>
            <div className={styles["security-points-1"]}>
              <div className={styles["security-internal-points"]}>
                <Image
                  src={IMAGEURLS.points}
                  alt="Role-based access controls"
                  width={40}
                  height={40} unoptimized
                />
                <span className={styles["security-desc-points"]}>Role-based access controls</span>
              </div>
              <div className={styles["security-internal-points"]}>
                <Image
                  src={IMAGEURLS.points}
                  alt="Logging, auditing and monitoring features"
                  width={40}
                  height={40} unoptimized
                />
                <span className={styles["security-desc-points"]}>Logging, auditing and monitoring features</span>
              </div>
              <div className={styles["security-internal-points"]}>
                <Image
                  src={IMAGEURLS.points}
                  alt="Features to enhance privacy of personal data"
                  width={40}
                  height={40} unoptimized
                />
                <span className={styles["security-desc-points"]}>Features to enhance privacy of personal data</span>
              </div>
            </div>
          </div>


        </div>
      </div>
     
  

  );
}

export default Security;
