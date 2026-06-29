import React from 'react';
import Link from 'next/link';
import { getProductDetailToolLinks } from '@/data/crossTemplateLinks';
import styles from './CrossTemplateLinks.module.css';

export default function ProductDetailToolLinks({ fileType }) {
  const links = getProductDetailToolLinks(fileType);
  if (!links.length) return null;

  return (
    <nav className={styles.crossLinksSection} aria-label="Related CAD tools">
      <h3 className={styles.crossLinksTitle}>Related CAD tools</h3>
      <ul className={styles.crossLinksList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.crossLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
