'use client'

import React from 'react';
import Link from 'next/link';
import { CircleAlert, Check } from 'lucide-react';
import { CONVERTER_FILTER_EVENT, CONVERTER_HUB_PAGE } from '@/data/converterHubPage';
import styles from './ConverterGuidance.module.css';

function openFormatDirectory(filter) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONVERTER_FILTER_EVENT, { detail: { filter } }));
  }
}

function ConverterGuidance() {
  return (
    <section className={styles.section} aria-label="CAD conversion guidance">
      <div className={styles.inner}>
        <article className={styles.panel}>
          <p className={styles.eyebrow}>{CONVERTER_HUB_PAGE.qualityEyebrow}</p>
          <h2>{CONVERTER_HUB_PAGE.qualityHeading}</h2>
          <p className={styles.panelIntro}>{CONVERTER_HUB_PAGE.qualityIntro}</p>
          <div className={styles.qualityList}>
            {CONVERTER_HUB_PAGE.qualityNotes.map((note) => (
              <div key={note.title} className={styles.qualityItem}>
                <span className={styles.warningIcon} aria-hidden>
                  <CircleAlert size={15} strokeWidth={2} />
                </span>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                  {note.href ? (
                    <Link href={note.href} className={styles.noteCta}>{note.cta}</Link>
                  ) : (
                    <a
                      href="#cad-converter-types-heading"
                      className={styles.noteCta}
                      onClick={() => openFormatDirectory(note.filter)}
                    >
                      {note.cta}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <p className={styles.eyebrow}>{CONVERTER_HUB_PAGE.useEyebrow}</p>
          <h2>{CONVERTER_HUB_PAGE.useHeading}</h2>
          <p className={styles.panelIntro}>{CONVERTER_HUB_PAGE.useIntro}</p>
          <div className={styles.useGrid}>
            {CONVERTER_HUB_PAGE.useCases.map((useCase) => (
              <div key={useCase.title} className={styles.useItem}>
                <span className={styles.checkIcon} aria-hidden>
                  <Check size={14} strokeWidth={2.3} />
                </span>
                <div>
                  <h3>{useCase.title}</h3>
                  <p>{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ConverterGuidance;
