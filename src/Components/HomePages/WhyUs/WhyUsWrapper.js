"use client"
import React,{useState,useEffect,useRef}  from "react";

function WhyUsWrapper({ children, styles }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const targetElement = ref.current; // Capture ref.current
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing after loading
                }
            },
            { rootMargin: "0px", threshold: 0.1 }
        );

        if (targetElement) {
            observer.observe(targetElement);
        }

        return () => {
            if (targetElement) observer.unobserve(targetElement);
        };
    }, []);

    return (
        <div
            id="why-us"
            className={styles["whyus-page"]}
            ref={ref}
            style={{
                backgroundImage: isVisible 
                    ? `url('https://d1d8a3050v4fu6.cloudfront.net/homepage-assets/why-marathon-bg.svg')` 
                    : "none"
            }}
            
        >
            {children}
        </div>
    );
}

export default WhyUsWrapper;