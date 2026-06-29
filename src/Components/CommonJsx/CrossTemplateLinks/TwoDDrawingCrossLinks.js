import React from 'react';
import Link from 'next/link';
import { TWO_D_DETAIL_LINKS, TWO_D_SOURCE_MODEL_LINK } from '@/data/crossTemplateLinks';
import styles from './CrossTemplateLinks.module.css';

function LinkIcon({ type }) {
  const icons = {
    '3D': (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M12 12l8-4.5M12 12v10M12 12L4 7.5" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
    '2D': (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <path d="M7 15h4M7 11h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
    draw: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 19h16M6 16l8-10 4 4-8 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    lib: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 6h16v12H4V6z" stroke="currentColor" strokeWidth="1.75" />
        <path d="M4 10h16M9 6v12" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
    view: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
    conv: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M7 7h10l-3-3M17 17H7l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    help: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3a7 7 0 00-4 12.8V18h8v-2.2A7 7 0 0012 3z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M10 21h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  };

  return <span className={styles.twoDCrossIcon}>{icons[type] || icons.lib}</span>;
}

function ResourceCard({ href, label, description, icon, featured = false }) {
  return (
    <Link
      href={href}
      className={featured ? styles.twoDCrossFeaturedCard : styles.twoDCrossCard}
    >
      <span className={styles.twoDCrossCardIconWrap}>
        <LinkIcon type={icon} />
      </span>
      <span className={styles.twoDCrossCardBody}>
        <span className={styles.twoDCrossCardLabel}>{label}</span>
        <span className={styles.twoDCrossCardDesc}>{description}</span>
      </span>
      <span className={styles.twoDCrossCardArrow} aria-hidden>
        →
      </span>
    </Link>
  );
}

export default function TwoDDrawingCrossLinks({ cadModelHref }) {
  return (
    <section className={styles.twoDCrossLinks} aria-labelledby="two-d-cross-links-heading">
      <div className={styles.twoDCrossLinksHeader}>
        <p className={styles.twoDCrossLinksEyebrow}>Explore Marathon OS</p>
        <h2 id="two-d-cross-links-heading" className={styles.twoDCrossLinksTitle}>
          Related resources
        </h2>
        <p className={styles.twoDCrossLinksSubtitle}>
          Jump to the source 3D model, generate your own drawings, or browse tools and libraries.
        </p>
      </div>

      {cadModelHref ? (
        <ResourceCard
          href={cadModelHref}
          label={TWO_D_SOURCE_MODEL_LINK.label}
          description={TWO_D_SOURCE_MODEL_LINK.description}
          icon={TWO_D_SOURCE_MODEL_LINK.icon}
          featured
        />
      ) : null}

      <div className={styles.twoDCrossGrid}>
        {TWO_D_DETAIL_LINKS.map((link) => (
          <ResourceCard
            key={link.href}
            href={link.href}
            label={link.label}
            description={link.description}
            icon={link.icon}
          />
        ))}
      </div>
    </section>
  );
}
