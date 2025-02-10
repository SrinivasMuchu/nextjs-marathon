
import React from "react";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from 'next/link';
import styles from './HomeTopNav.module.css';
import TopNavRequestBtn from "../../CommonJsx.js/TopNavRequestBtn";
import MenuButton from "@/Components/CommonJsx.js/MenuButton";

function HomeTopNav() {

  return (
    <>

      <div className={styles['home-page-top']}>
        <Image src={IMAGEURLS.logo} alt="Marathon Logo" width={500}
          height={500} className={styles['home-page-top-logo']}/>
        <div className={styles['home-page-navs']}>
          {/* Use Link for navigation */}
          <Link href="#why-us">Why us?</Link>
          <Link href="#capabilities">Capabilities</Link>
          <Link href="#product">Product</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#security">Security</Link>

        </div>
        <div className={styles['home-pg-btns']}>
          {/* buttons */}
          <TopNavRequestBtn styles={styles} className={'try-demo'} />
          {/* <button className={styles['try-demo']} onClick={() => setOpenDemoForm(!openDemoForm)}>Request demo</button> */}
          {/* <button className={styles['home-login']} onClick={HnadleNavigate}>Login</button> */}
        </div>
        <div className={styles['home-pg-menu']} >
          <MenuButton styles={{ styles }} />
        </div>


      </div>



    </>
  );
}

export default HomeTopNav;
