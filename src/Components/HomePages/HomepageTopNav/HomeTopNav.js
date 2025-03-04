
"use client"
import React,{useState} from "react";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from 'next/link';
import styles from './HomeTopNav.module.css';
import TopNavRequestBtn from "../../CommonJsx.js/TopNavRequestBtn";
import MenuButton from "@/Components/CommonJsx.js/MenuButton";

function HomeTopNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <>

      <div className={styles['home-page-top']}>
        <Image src={IMAGEURLS.logo} alt="Marathon Logo" width={500}
          height={500} className={styles['home-page-top-logo']}/>
        <div className={styles['home-page-navs']}>
          
          <Link href="#why-us">Why us?</Link>
          <Link href="#capabilities">Capabilities</Link>
          <Link href="#product">Product</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#security">Security</Link>
          <div style={{position:'relative'}} >
          <span style={{cursor:'pointer'}} onClick={()=>setDropdownOpen(!dropdownOpen)}>Tools ▼</span>
          {dropdownOpen && (
            <div className={styles["dropdown-menu"]}>
              <Link href="/org">Organization</Link>
              {/* <Link href="/about">Organization</Link>
              <Link href="/about">Organization</Link>
              <Link href="/about">Organization</Link> */}
              {/* <Link href="/contact">Contact</Link>
              <Link href="/careers">Careers</Link> */}
            </div>
          )}

          </div>
         
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
