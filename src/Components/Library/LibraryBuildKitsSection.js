import React from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {
  LIBRARY_BUILD_KITS,
  LIBRARY_BUILD_KITS_META,
} from '@/data/libraryHubSections';
import styles from './LibraryDiscoverySections.module.css';

export default function LibraryBuildKitsSection() {
  const meta = LIBRARY_BUILD_KITS_META;

  return (
    <section className={styles.section} aria-labelledby="library-build-kits-title">
      <div className={styles.sectionHead}>
        <div className={styles.sectionHeadText}>
          <h2 id="library-build-kits-title" className={styles.sectionTitle}>
            {meta.title}
          </h2>
          <p className={styles.sectionSubtitle}>{meta.subtitle}</p>
        </div>
        <Link href={meta.seeAllHref} className={styles.sectionLink}>
          {meta.seeAllLabel} →
        </Link>
      </div>

      <div className={styles.kitsGrid}>
        {LIBRARY_BUILD_KITS.map((kit) => (
          <Link key={kit.id} href={kit.href} className={styles.kitCard}>
            <div className={styles.kitTypeRow}>
              <AutoAwesomeOutlinedIcon className={styles.kitTypeIcon} aria-hidden />
              <span className={styles.kitTypeLabel}>{kit.kitType}</span>
            </div>

            <h3 className={styles.kitTitle}>{kit.title}</h3>
            <p className={styles.kitDescription}>{kit.description}</p>

            <div className={styles.kitPartIcons} aria-hidden>
              {/* Backend may provide kit.partLogos later:
              {kit.partLogos?.map((logoUrl, index) => (
                <Image
                  key={`${kit.id}-logo-${index}`}
                  src={logoUrl}
                  alt=""
                  width={28}
                  height={28}
                  className={styles.kitPartIconImage}
                />
              ))}
              */}
              <span className={styles.kitPartIconPlaceholder} />
              <span className={styles.kitPartIconPlaceholder} />
              <span className={styles.kitPartIconPlaceholder} />
              {kit.extraParts > 0 ? (
                <span className={styles.kitExtraCount}>+{kit.extraParts}</span>
              ) : null}
            </div>

            <div className={styles.kitFooter}>
              <span className={styles.kitPartCount}>
                {kit.partCount} {kit.partCount === 1 ? 'part' : 'parts'}
              </span>
              {kit.pairsVerified ? (
                <span className={styles.kitVerified}>
                  <CheckCircleOutlineIcon className={styles.kitVerifiedIcon} aria-hidden />
                  pairs verified
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
