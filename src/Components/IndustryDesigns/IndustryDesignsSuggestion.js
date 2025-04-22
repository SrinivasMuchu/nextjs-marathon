"use client";
import React, { useState, useEffect } from 'react';
import styles from './IndustryDesign.module.css';
import Image from 'next/image';
import { IMAGEURLS } from '@/config';
import IndustrySuggestionFiles from './IndustrySuggestionFiles';
import IndustrySuggestionsHead from './IndustrySuggestionsHead';

function IndustryDesignsSuggestion({ type, designData = [],design }) {
  
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  // Responsive logic
  useEffect(() => {
    const updateItemsToShow = () => {
      const width = window.innerWidth;
      if (width < 910) {
        setItemsToShow(1);
      } else if (width < 1300) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (startIndex + itemsToShow < designData.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const visibleItems = designData.slice(startIndex, startIndex + itemsToShow);
  console.log(type && visibleItems, 'designData45');
  const style = type
    ? {
        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.90) 100%), #5B89FF',
      }
    : {};

  return (
    <div className={styles['industry-design-suggestion']} style={style}>
      <div className={styles['industry-design-suggestion-header']}>
        <IndustrySuggestionsHead />
      </div>
      <div className={styles['industry-design-suggestion-bottom']}>
        <div
          className={styles['industry-design-suggestion-arrows']}
          onClick={handlePrev}
          style={{ 
            cursor: startIndex > 0 ? 'pointer' : 'not-allowed', 
            opacity: startIndex > 0 ? 1 : 0.5 
          }}
        >
          <Image src={IMAGEURLS.leftArrow} alt="left-arrow" width={40} height={40} />
        </div>

        <IndustrySuggestionFiles visibleItems={visibleItems} type={type} design={design}/>

        <div
          className={styles['industry-design-suggestion-arrows']}
          onClick={handleNext}
          style={{
            cursor: startIndex + itemsToShow < designData.length ? 'pointer' : 'not-allowed',
            opacity: startIndex + itemsToShow < designData.length ? 1 : 0.5,
          }}
        >
          <Image src={IMAGEURLS.rightArrow} alt="right-arrow" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}

export default IndustryDesignsSuggestion;