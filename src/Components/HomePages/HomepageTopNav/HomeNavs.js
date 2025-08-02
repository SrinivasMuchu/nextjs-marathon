
import React from 'react';

import styles from './HomeTopNav.module.css'; 
import TopNavRequestBtn from '@/Components/CommonJsx/TopNavRequestBtn';
import MobileMenu from './MobileMenu';


function HomeNavs({ onClose }) {

  return (
    <div className={styles['menu-page']}>
     <MobileMenu styles={styles} onClose={onClose}/>
      <div className={styles['menu-buttons']}>
        <TopNavRequestBtn styles={styles} className={'try-demo'} topBar='profile'/>
        {/* <button className={styles['try-demo']} onClick={() => setOpenDemoForm(true)}>Request demo</button> */}
        {/* <button className={styles['home-login-menu']} onClick={HnadleNavigate}>
          Login
        </button> */}
      </div>
    </div>
  );
}

export default HomeNavs;
