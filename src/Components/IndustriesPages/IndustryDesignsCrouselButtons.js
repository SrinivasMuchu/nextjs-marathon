'use client';

import React, { useRef } from 'react';
import styles from './Industry.module.css';
import Image from 'next/image';
import { textLettersLimit } from '@/common.helper';
import { IMAGEURLS } from '@/config';

export default function IndustryCarouselClient({ designs, category, industryName }) {
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
    <div className={styles["industry-designs"]} style={{ position: 'relative' }}>
      <div className={styles["industry-designs-header"]}>
        <h2>{industryName} Design Library</h2>
        <p>
          Explore high-quality design inspirations curated for the {industryName}.
          <a style={{
            color: 'white', opacity: '1', padding: '5px 10px',
            background: '#610bee', borderRadius: '8px', marginLeft: '10px'
          }}
            href={`/library?category=${category.map(item => item.industry_category_name).join(',')}`}>
            View all →
          </a>
        </p>
      </div>

      {/* Navigation Buttons */}
      <button onClick={() => scroll('left')} style={{
        position: 'absolute', left: '0', top: '45%',
        zIndex: 1,  padding: '6px 12px'
      }}><Image src={IMAGEURLS.leftArrow} alt="left-arrow" width={40} height={40} /></button>

      <button onClick={() => scroll('right')} style={{
        position: 'absolute', right: '0', top: '45%',
        zIndex: 1,  padding: '6px 12px'
      }}><Image src={IMAGEURLS.rightArrow} alt="right-arrow" width={40} height={40} /></button>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className={styles["industry-designs-crousel"]}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          padding: '10px 40px', // to make space for buttons
        }}
      >
        {[...designs, {
          _id: 'explore-more',
          route: '',
          page_title: 'Explore More',
          page_description: '',
          isExploreMore: true,
        }].map((design, index) => (
          <a
            key={design._id || index}
            href={design.isExploreMore ? `/library?category=${category.map(item => item.industry_category_name).join(',')}` : `/library/${design.route}`}
            className={styles["industry-designs-item"]}
           
          >
            {!design.isExploreMore ? (
              <div>
                <Image
                  src={`https://d1d8a3050v4fu6.cloudfront.net/${design._id}/sprite_0_150.webp`}
                  alt={design.page_title}
                  className={styles["industry-designs-item-img"]}
                  width={300}
                  height={250}
                />
                <div style={{ width: '100%', height: '2px', background: 'grey' }}></div>
                <h6 title={design.page_title}>{textLettersLimit(design.page_title, 40)}</h6>
                <p title={design.page_description}>{textLettersLimit(design.page_description, 120)}</p>
              </div>
            ) : (
              <div  style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
               
               
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                color: 'black',
                height:'100%'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Explore More
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Designs ➡️
                </div>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
