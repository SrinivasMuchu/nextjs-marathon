"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./IndustryDesign.module.css";
import { DESIGN_GLB_PREFIX_URL, IMAGEURLS } from "@/config";
import Image from "next/image";
import IndustryDesignCarouselWrapper from "./IndustryDesignCarouselWrapper";

// Sample slides with titles and thumbnails


function IndustryDesignsCarousel({ designData, type, design }) {
    const slides = [
        {
            title: `${designData.page_title}_0_0_degree_snapshot`,
            x: 0,
            y: 0 // use actual URLs from your IMAGEURLS
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
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        if (swiperRef.current?.slidePrev) {
            swiperRef.current.slidePrev();
        }
    };

    const handleNext = () => {
        if (swiperRef.current?.slideNext) {
            swiperRef.current.slideNext();
        }
    };

    return (
        <>
            <IndustryDesignCarouselWrapper>
                {/* Custom Prev Arrow */}

                {/* Main Swiper */}

                <div className={styles["industry-design-carousel"]}>
                    <button
                        className={`${styles.navPrevButton} ${styles.prev}`}
                        onClick={handlePrev}
                        style={{ left: "0", zIndex: "10" }}
                    >
                        <div
                            className={styles["industry-design-suggestion-arrows"]}
                            style={{
                                backgroundColor: "white",
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                            }}
                        >
                            <Image
                                src={IMAGEURLS.leftArrow}
                                alt="left-arrow"
                                width={64}
                                height={64}
                            />
                        </div>
                    </button>

                    <Swiper
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onSlideChange={(swiper) => {
                            setActiveIndex(swiper.realIndex);
                        }}
                        effect="coverflow"
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={2}
                        loop={true}
                        pagination={{ clickable: true }}
                        spaceBetween={0}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 1.5,
                            slideShadows: false,
                        }}
                        modules={[EffectCoverflow, Navigation, Pagination]}
                        className={styles.industrySwiper}
                    >
                        {slides.map((design, index) => (
                            <SwiperSlide key={index}>
                                <div className={styles.slideCard}>
                                    <Image
                                        src={`${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_${design.x}_${design.y}.webp`}
                                        alt={design.title}
                                        width={600}
                                        height={300}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        className={`${styles.navButton} ${styles.next}`}
                        style={{ right: "0" }}
                        onClick={handleNext}
                    >
                        <div
                            className={styles["industry-design-suggestion-arrows"]}
                            style={{
                                backgroundColor: "white",
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                            }}
                        >
                            <Image
                                src={IMAGEURLS.rightArrow}
                                alt="right-arrow"
                                width={64}
                                height={64}
                            />
                        </div>
                    </button>
                </div>
                {/* Custom Next Arrow */}


                {/* Thumbnails */}
                <div className={styles.thumbnailGrid}>
                    {slides.map((design, index) => (
                        <div
                            key={index}
                            className={`${styles.thumbnail} ${activeIndex === index ? styles.activeThumbnail : ""
                                }`}
                            onClick={() => {
                                if (swiperRef.current?.slideToLoop) {
                                    swiperRef.current.slideToLoop(index);
                                    setActiveIndex(index);
                                }
                            }}
                        >
                            <Image
                                src={`${DESIGN_GLB_PREFIX_URL}${designData._id}/sprite_${design.x}_${design.y}.webp`}
                                alt={design.title}
                                width={64}
                                height={64}
                            />
                        </div>
                    ))}
                </div>
            </IndustryDesignCarouselWrapper>
           
                <div className={styles['industry-design-header-viewer-crousal']}>
                    <a href={type ? `/library/${design}/${designData._id}.${designData.file_type?designData.file_type:'step'}`:`/industry/${design.industry}/${design.part}/${design.design}/${designData._id}.${designData.file_type?designData.file_type:'step'}`}
                        rel="nofollow"><button >Open in 3D viewer</button></a>
                </div>

           
        </>

    );
}

export default IndustryDesignsCarousel;
