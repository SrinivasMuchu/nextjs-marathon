"use client";
import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import { IMAGEURLS } from "@/config";
import Link from "next/link";
import ContactUsText from "../../CommonJsx/ContactUsText";
import FooterForm from "./FooterForm";
import { usePathname, useRouter } from "next/navigation"; // Use the correct imports

function Footer() {
  const pathname = usePathname(); // Get current route
  const router = useRouter(); // For navigation

  // Function to handle anchor link clicks
  const handleAnchorClick = (event, sectionId) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (pathname !== "/") {
      // Redirect to home page first
      router.push(`/#${sectionId}`);
    } else {
      // Scroll smoothly to the section if already on home page
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles["footer-page"]}>
      <div className={styles["footer-page-cont"]}>
        <div className={styles["footer-logo-navs"]}>
          <div className={styles["footer-logo"]}>
            <Image
              src={IMAGEURLS.footerLogo}
              alt="marathon os logo"
              width={160}
              height={30}
            />
            <span>Simplifying Cloud PDM & PLM</span>
          </div>
          <div className={styles["footer-divider"]}></div>
          <div className={styles["footer-navs"]}>
            <a href="#home" onClick={(e) => handleAnchorClick(e, "home")}>Home</a>
            <a href="#why-us" onClick={(e) => handleAnchorClick(e, "why-us")}>Why us?</a>
            <a href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")}>Features</a>
            <a href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</a>
            <a href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</a>
            <a href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</a>
            <ContactUsText />
            <Link href="/terms-and-conditions">Terms Of Service</Link>
            <Link href="/privacy-policy">Privacy Policies</Link>
          </div>
        </div>
        <FooterForm styles={styles} />
      </div>
      <div className={styles["footer-page-copyright"]}>
        <span>Ⓒ Copyrights issued 2023-2024</span>
      </div>
    </div>
  );
}

export default Footer;
