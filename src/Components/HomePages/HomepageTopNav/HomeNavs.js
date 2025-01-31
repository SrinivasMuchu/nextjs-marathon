import React from 'react';
import Link from 'next/link'; 
import styles from './HomeTopNav.module.css'; 

function HomeNavs({ onClose,setOpenDemoForm }) {


  const handleCloseMenu = () => {
    onClose(); // Close the menu using the onClose prop
  };



  return (
    <div className={styles['menu-page']}>
      <div className={styles['menu-close-icon']}>
        <span onClick={handleCloseMenu}>close x</span>
      </div>
      <div className={styles['menu-navs']}>
        {/* <Link href="#why-us" onClick={handleCloseMenu}>Why us?</Link>
        <Link href="#capabilities" onClick={handleCloseMenu}>Capabilities</Link>
        <Link href="#security" onClick={handleCloseMenu}>Security</Link> */}
        <Link href="#why-us" onClick={handleCloseMenu}>Why us?</Link>
        <Link href="#capabilities" onClick={handleCloseMenu}>Capabilities</Link>
        <Link href="#product" onClick={handleCloseMenu}>Product</Link>
        <Link href="#pricing" onClick={handleCloseMenu}>Subscription</Link>
        <Link href="#security" onClick={handleCloseMenu}>Security</Link>
      
      </div>
      <div className={styles['menu-buttons']}>
        <button className={styles['try-demo']} onClick={() => setOpenDemoForm(true)}>Request demo</button>
        {/* <button className={styles['home-login-menu']} onClick={HnadleNavigate}>
          Login
        </button> */}
      </div>
    </div>
  );
}

export default HomeNavs;
