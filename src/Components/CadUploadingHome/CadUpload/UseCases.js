import React from 'react';
import styles from './UseCases.module.css';

function UseCases({ useCases, title, label = 'USE CASES' }) {
  if (!useCases?.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        {label && <p className={styles.label}>{label}</p>}
        {title && <h2 className={styles.mainHeading}>{title}</h2>}

        <div className={styles.list}>
          {useCases.map((item, index) => {
            const titleText = typeof item === 'string' ? item : item.title;
            const descriptionText =
              typeof item === 'string' ? item : item.description;
            const hasDescription =
              typeof descriptionText === 'string' && descriptionText.length > 0;
            const displayDescription = hasDescription
              ? `✓ ${descriptionText}`
              : titleText ? `✓ ${titleText}` : '';

            return (
              <div key={index} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{titleText}</h3>
                  <p className={styles.cardDescription}>
                    {displayDescription}
                  </p>
                </div>
               
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default UseCases;
