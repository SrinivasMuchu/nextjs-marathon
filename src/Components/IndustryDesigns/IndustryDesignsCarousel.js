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
        x: 0,
        y:0 // use actual URLs from your IMAGEURLS
    },
    {
        title: "Design 2",
        x:0,
        y:90
    },
    {
        title: "Design 3",
        x:0,
        y:270,
    },
    {
        title: "Design 4",
        x:90,
        y:0
    },
    {
        title: "Design 5",
        x:270,
        y:0,
    },
    {
        title: "Design 6",
        x:60,
        y:30
    }
];

function IndustryDesignsCarousel({ designData }) {
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
                    {slides.map((design, index) => (
                        <SwiperSlide key={design._id}>
                            <div className={styles.slideCard}>
                                <Image
                                    src={`https://d1d8a3050v4fu6.cloudfront.net/${designData._id}/sprite_${design.x}_${design.y}.webp`}
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
                            src={`https://d1d8a3050v4fu6.cloudfront.net/${designData._id}/sprite_${design.x}_${design.y}.webp`}
                            alt={design.title}
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
