"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./IndustryDesign.module.css";
import { IMAGEURLS } from "@/config";
import Image from "next/image";

// Sample slides with titles and thumbnails
const slides = [
    {
        title: "Design 1",
        thumbnail: IMAGEURLS.carLogo, // use actual URLs from your IMAGEURLS
    },
    {
        title: "Design 2",
        thumbnail: IMAGEURLS.carLogo,
    },
    {
        title: "Design 3",
        thumbnail: IMAGEURLS.craneLogo,
    },
    {
        title: "Design 4",
        thumbnail: IMAGEURLS.droneLogo,
    },
    {
        title: "Design 5",
        thumbnail: IMAGEURLS.droneLogo,
    },
];

function IndustryDesignsCarousel() {
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
        <div className={styles.carouselWrapper}>
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
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className={styles.slideCard}>{slide.title}</div>
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
                {slides.map((slide, index) => (
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
                            src={slide.thumbnail}
                            alt={slide.title}
                            width={64}
                            height={64}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default IndustryDesignsCarousel;
