'use client';

import React, { useRef } from 'react';
import styles from '../Tools/Tools.module.css';
import Image from 'next/image';
import { IMAGEURLS } from '@/config';

function LibraryScroll({categories}) {
    const carouselRef = useRef(null);
    const itemWidth = 320; // width including margin/padding

    const scroll = (direction) => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -itemWidth : itemWidth,
                behavior: 'smooth',
            });
        }
    };
    return (
        <>
            <button onClick={() => scroll('left')} style={{
                position: 'absolute', left: '0', top: '55%',
                zIndex: 1, padding: '6px 12px'
            }}><Image src={IMAGEURLS.leftArrow} alt="left-arrow" width={40} height={40} /></button>

            <button onClick={() => scroll('right')} style={{
                position: 'absolute', right: '0', top: '55%',
                zIndex: 1, padding: '6px 12px'
            }}><Image src={IMAGEURLS.rightArrow} alt="right-arrow" width={40} height={40} /></button>

            <div className={styles['industry-category-page-items']}  ref={carouselRef}>
                {categories.map((category, index) => (
                    <a href={`/library?category=${category.route}`} key={index}>
                        <div className={styles['tools-page-items-cont']}>
                            <Image
                                src={category.thumbnail}
                                alt={category.title}
                                width={250}
                                height={0}
                                loading="lazy"
                            />
                            <div className={styles['tools-page-items-content']}>
                                <h6>{category.title}</h6>
                                <p>Explore cutting-edge solutions in the {category.title} industry.</p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </>

    )
}

export default LibraryScroll