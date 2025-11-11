import React from 'react';
import styles from './Loading.module.css';

function Loading({ smallScreen, excellLoading }) {
  const getClassName = () => {
    if (smallScreen) return styles.screen1;
    if (excellLoading) return styles.excellLoading;
    if (smallScreen === 'earnings') return styles.screen2;
    return styles.screen;
  };

  return (
    <div className={getClassName()}>
      <div className={styles.loader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
}

export default Loading;
