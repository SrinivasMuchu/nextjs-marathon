import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CONVERTER_HUB_PAGE } from '@/data/converterHubPage';
import styles from './CadConversionToolLinks.module.css';

function CadConversionToolLinks() {
  return (
    <section className={styles.section} aria-labelledby="most-used-cad-conversion-tools">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{CONVERTER_HUB_PAGE.popularEyebrow}</p>
          <h2 id="most-used-cad-conversion-tools" className={styles.mainHeading}>
            {CONVERTER_HUB_PAGE.popularHeading}
          </h2>
          <p className={styles.intro}>{CONVERTER_HUB_PAGE.popularIntro}</p>
        </header>
        <div className={styles.grid} data-nosnippet>
          {CONVERTER_HUB_PAGE.popular.map((tool) => (
            <Link key={tool.href} href={tool.href} className={styles.card}>
              <div className={styles.formatPair} aria-hidden>
                <span className={styles.formatBadge}>{tool.from}</span>
                <ArrowRight size={14} strokeWidth={2} className={styles.pairArrow} />
                <span className={`${styles.formatBadge} ${styles.formatBadgeTo}`}>{tool.to}</span>
              </div>
              <div className={styles.cardContent}>
                <h3>{tool.from} to {tool.to}</h3>
                <p className={styles.cardDescription}>{tool.description}</p>
              </div>
              <span className={styles.openIcon} aria-hidden>
                <ArrowRight size={17} strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CadConversionToolLinks;
