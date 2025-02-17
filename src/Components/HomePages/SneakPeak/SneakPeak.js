"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './SneakPeak.module.css';
import ReactPlayer from "react-player";
import { IMAGEURLS } from "@/config";


function SneakPeak() {
    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing once loaded
                }
            },
            {
                threshold: 0.5, // Video loads when at least 50% is visible
            }
        );


        if (videoRef.current) {
            observer.observe(videoRef.current);
        }


        return () => observer.disconnect();
    }, []);


    return (
        <div id='product' className={styles['sneak-page']} ref={videoRef}>
            <div className={styles['sneak-page-cont']}>
                <div className={styles['sneak-page-text']}>
                    <span className={styles['sneak-page-head']}>
                        Product sneak peak
                    </span>
                    {/* <ul className={styles['sneak-page-list']}> */}
                        <li>Create your design workspace</li>
                        <li>View all your drive uploaded files here</li>
                        <li>View all designs here</li>
                        <li>Create parts using custom part nomenclature</li>
                        <li>Create EC’s for approval and EBOM</li>
                        <li>View Part details with EBOM in Tree and Excel view</li>
                    {/* </ul> */}
                </div>
                <div className={styles['sneak-page-video']}>
                    {isVisible && (
                        <ReactPlayer
                            url={IMAGEURLS.demoVideo}
                            controls
                            playing={false}
                            loop={false}
                            muted={false}
                            width="100%"
                            height="100%"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}


export default SneakPeak;





