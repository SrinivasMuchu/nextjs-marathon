"use client";
import React, { useState } from "react";

import { DESIGN_GLB_PREFIX_URL, IMAGEURLS } from "@/config";
import Image from "next/image";
import IndustryDesignCarouselWrapper from "./IndustryDesignCarouselWrapper";
import IndustryCarouselImages from "./IndustryCarouselImages";
import DownloadClientButton from "../CommonJsx/DownloadClientButton";

function IndustryDesignsCarousel({ designData, type, design }) {
    const slides = [
        {
            title: `${designData.page_title}_0_0_degree_snapshot`,
            x: 0,
            y: 0
        },
        {
            title: `${designData.page_title}_0_90_degree_snapshot`,
            x: 0,
            y: 90
        },
        {
            title: `${designData.page_title}_0_270_degree_snapshot`,
            x: 0,
            y: 270,
        },
        {
            title: `${designData.page_title}_90_0_degree_snapshot`,
            x: 90,
            y: 0
        },
        {
            title: `${designData.page_title}_270_0_degree_snapshot`,
            x: 270,
            y: 0,
        },
        {
            title: `${designData.page_title}_60_30_degree_snapshot`,
            x: 60,
            y: 30
        }
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    const total = slides.length;

    const goTo = (idx) => setActiveIndex((idx + total) % total);
    const handlePrev = () => goTo(activeIndex - 1);
    const handleNext = () => goTo(activeIndex + 1);

    return (
        <>
            <IndustryDesignCarouselWrapper>
                {/* Carousel Container */}
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center bg-white/90 overflow-hidden" style={{background: 'linear-gradient(0deg,rgba(255,255,255,0.90) 0%,rgba(255,255,255,0.90) 100%), #16A0A0'}}>
                    {/* Left Arrow */}
                    <button
                        className="absolute left-2 sm:left-4 z-30 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg hover:scale-110 transition-all"
                        onClick={handlePrev}
                        aria-label="Previous"
                    >
                        <Image src={IMAGEURLS.leftArrow} alt="left-arrow" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10" />
                    </button>

                    {/* Slides */}
                    <div className="relative w-full flex items-center justify-center h-full px-4 sm:px-8">
                        {slides.map((slide, idx) => {
                            // Calculate position for 3D effect
                            let style = "absolute left-1/2 top-1/2 transition-all duration-500 ease-in-out";
                            let extra = "";
                            const pos = (idx - activeIndex + total) % total;
                            if (pos === 0) {
                                // Center
                                extra = "-translate-x-1/2 -translate-y-1/2 scale-100 opacity-100 z-20";
                            } else if (pos === 1) {
                                // Right
                                extra = "translate-x-[15%] sm:translate-x-[40%] md:translate-x-[60%] -translate-y-1/2 scale-75 sm:scale-85 md:scale-90 opacity-60 z-10";
                            } else if (pos === total - 1) {
                                // Left
                                extra = "-translate-x-[115%] sm:translate-x-[140%] md:-translate-x-[160%] -translate-y-1/2 scale-75 sm:scale-85 md:scale-90 opacity-60 z-10";
                            } else {
                                // Hide others on mobile, show on larger screens
                                extra = "hidden lg:block opacity-0 z-0";
                            }
                            return ( 
                                <div
                                    key={idx}
                                    className={`${style} ${extra} w-[280px] h-[140px] sm:w-[400px] sm:h-[200px] md:w-[500px] md:h-[250px] lg:w-[600px] lg:h-[300px] bg-white overflow-hidden rounded-[20px]`}
                                >
                                    <Image
                                        src={`${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_${slide.x}_${slide.y}.webp`}
                                        alt={slide.title}
                                        fill
                                        className="w-full shadow-xl object-contain"
                                        loading="eager"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Arrow */}
                    <button
                        className="absolute right-2 sm:right-4 z-30 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg hover:scale-110 transition-all"
                        onClick={handleNext}
                        aria-label="Next"
                    >
                        <Image src={IMAGEURLS.rightArrow} alt="right-arrow" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10" />
                    </button>
                </div>

                {/* Dots */}
                <IndustryCarouselImages designData={designData} activeIndex={activeIndex} slides={slides} setActiveIndex={setActiveIndex}/>
            </IndustryDesignCarouselWrapper>

            {/* 3D Viewer Button */}
            <div className="w-full flex flex-wrap items-center justify-around gap-4 mt-4 sm:mt-6 px-4">

                <a
                    href={`/tools/cad-renderer?fileId=${designData._id}&format=${designData.file_type?designData.file_type:'step'}`} 
                    rel="nofollow"
                    className="w-full sm:w-auto"
                >
                    <button className="rounded bg-[#610BEE] text-white text-base sm:text-lg font-medium w-full sm:w-[243px] h-12 px-4">Open in 3D viewer</button>
                    
                </a>
                <DownloadClientButton custumDownload={true} folderId={designData._id} isDownladable={designData.is_downloadable} step={true} filetype={designData.file_type?designData.file_type:'step'}/>
            </div>
        </>
    );
}
export default IndustryDesignsCarousel;

