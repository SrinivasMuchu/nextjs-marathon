import React from 'react';
import Link from 'next/link';
import { TOOL_LIBRARY_CROSS_LINKS } from '@/data/crossTemplateLinks';
import styles from './CrossTemplateLinks.module.css';

export default function ToolLibraryCrossLinks({
  title = 'Explore Marathon OS CAD resources',
  variant = 'light',
}) {
  const bandClass =
    variant === 'dark'
      ? `${styles.toolLibraryBand} ${styles.toolLibraryBandDark}`
      : styles.toolLibraryBand;

  return (
    <section className={bandClass} aria-labelledby="tool-library-cross-links">
      <h2 id="tool-library-cross-links" className={styles.toolLibraryTitle}>
        {title}
      </h2>
      <div className={styles.toolLibraryLinks}>
        {TOOL_LIBRARY_CROSS_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={styles.toolLibraryLink}>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
