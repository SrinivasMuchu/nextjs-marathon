import React from 'react';
import Link from 'next/link';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import styles from './LibraryHubCards.module.css';

const ICON_MAP = {
  cube: ViewInArOutlinedIcon,
  mesh: AutoAwesomeOutlinedIcon,
  drawing: DescriptionOutlinedIcon,
  pdf: PictureAsPdfOutlinedIcon,
  dxf: ArchitectureOutlinedIcon,
  category: CategoryOutlinedIcon,
};

export default function LibraryHubCards({ cards = [] }) {
  if (!cards.length) return null;

  return (
    <section className={styles.hubSection} aria-label="Browse by file type">
      <div className={styles.hubGrid}>
        {cards.map((card) => {
          const Icon = ICON_MAP[card.icon] || CategoryOutlinedIcon;
          const accentClass = styles[`accent-${card.accent}`] || styles['accent-purple'];

          return (
            <Link
              key={card.id}
              href={card.href}
              className={`${styles.hubCard} ${accentClass}`}
            >
              <div className={styles.hubCardTop}>
                <span className={styles.hubCardIconWrap} aria-hidden>
                  <Icon className={styles.hubCardIcon} />
                </span>
                {card.count ? (
                  <span className={styles.hubCardCount}>{card.count}</span>
                ) : null}
              </div>
              <h2 className={styles.hubCardTitle}>{card.title}</h2>
              <p className={styles.hubCardFormats}>{card.formats}</p>
              <p className={styles.hubCardDescription}>{card.description}</p>
              <span className={styles.hubCardLink}>
                {card.browseLabel} →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
