import React from 'react';
import styles from './Loading.module.css';

function Loading({ smallScreen, excellLoading, fullscreen }) {
  const getClassName = () => {
    if (fullscreen) return styles.fullscreen;
    if (smallScreen === 'earnings') return styles.screen2;
    if (smallScreen) return styles.screen1;
    if (excellLoading) return styles.excellLoading;
    return styles.inline;
  };

  return (
    <div className={getClassName()} role="status" aria-label="Loading">
      <div className={styles.loader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
}

export default Loading;
