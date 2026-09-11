import React from 'react';
import styles from './UseCases.module.css';

function UseCases({ useCases, title, label = 'USE CASES', headingLevel = 3 }) {
  if (!useCases?.length) return null;
  const HeadingTag = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        {label && <p className={styles.label}>{label}</p>}
        {title && <HeadingTag className={styles.mainHeading}>{title}</HeadingTag>}

        <div className={styles.list}>
          {useCases.map((item, index) => {
            const titleText = typeof item === 'string' ? item : item.title;
            const descriptionText =
              typeof item === 'string' ? '' : item.description;
            const hasDescription =
              typeof descriptionText === 'string' && descriptionText.length > 0;

            return (
              <div key={index} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{titleText}</h3>
                  {hasDescription ? (
                    <p className={styles.cardDescription}>
                      ✓ {descriptionText}
                    </p>
                  ) : null}
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
