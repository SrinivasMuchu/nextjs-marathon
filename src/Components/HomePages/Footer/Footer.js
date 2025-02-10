
import React from 'react'
import styles from './Footer.module.css'
import Image from "next/image";
import { IMAGEURLS } from "@/config";
import Link from 'next/link';
import ContactUsText from '../../CommonJsx.js/ContactUsText';
import FooterForm from './FooterForm';

function Footer() {

  return (
    <div className={styles['footer-page']}>
      <div className={styles['footer-page-cont']}>
        <div className={styles['footer-logo-navs']}>
          <div className={styles['footer-logo']}>
            <Image
              src={IMAGEURLS.footerLogo}
              alt="Encryption in transit"
              width={160}
              height={30}
            />
            <span>Simplifying Cloud PDM & PLM</span>
          </div>
          <div className={styles['footer-divider']}>

          </div>
          <div className={styles['footer-navs']}>
            {/* <span>Home</span>
            <span>Features</span>
            <span>Product</span>
            <span>Pricing</span>
            <span>Contact us</span>
            <span>Terms Of Service</span>
            <span>Privacy Policies</span> */}
            <Link href="#home">Home</Link>
            <Link href="#why-us" >
              Why us?
            </Link>

            <Link href="#capabilities">Features</Link>
            <Link href="#product">Product</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#security">Security</Link>
            <ContactUsText/>
            {/* <span style={{ cursor: 'pointer' }} onClick={() => setOpenDemoForm(true)}>Contact us</span> */}
            <Link href="https://marathon-os.com/terms-and-conditions">Terms Of Service</Link>
            <Link href="https://marathon-os.com/privacy-policy">Privacy Policies</Link>

          </div>
        </div>

       <FooterForm styles={styles}/>
      </div>
      <div className={styles['footer-page-copyright']}>
        <span>Ⓒ Copyrights issued 2023-2024</span>
      </div>
    </div>
  )
}

export default Footer