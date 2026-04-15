'use client';

import React from 'react';
import HoverImageSequenceHome from '../CommonJsx/RotatedHomePageDesigns';
import libraryStyles from '../Library/Library.module.css';
import designHubStyles from '../HomePages/DesignHub/DesignHub.module.css';
import industryStyles from './Industry.module.css';
import Link from 'next/link';

export default function IndustryCarouselClient({ designs }) {
  return (
    <div className={designHubStyles.designHubDesignsContainer}>
      <div className={industryStyles.industryDesignLibraryGrid}>
        {designs.map((design) => (
          <div key={design._id} className={designHubStyles.designHubDesignCard}>
            <Link
              href={`/library/${design.route}`}
              className={libraryStyles['library-designs-items-container-home']}
            >
              <HoverImageSequenceHome design={design} loading="lazy" />
            </Link>
            <div className={designHubStyles.designHubDesignTitle} title={design.page_title}>
              {design.page_title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
