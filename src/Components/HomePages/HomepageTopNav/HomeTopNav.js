"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // Use usePathname instead of useRouter
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeTopNav.module.css";
import TopNavRequestBtn from "../../CommonJsx/TopNavRequestBtn";
import MenuButton from "@/Components/CommonJsx/MenuButton";

function HomeTopNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    <div className={styles["home-page-top"]}>
      <Link href="/">
        <Image
          src={IMAGEURLS.logo}
          alt="Marathon Logo"
          width={500}
          height={500}
          className={styles["home-page-top-logo"]}
        />
      </Link>

      <div className={styles["home-page-navs"]}>
        <a href="#why-us" onClick={(e) => handleAnchorClick(e, "why-us")}>Why us?</a>
        <a href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")}>Capabilities</a>
        <a href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</a>
        <a href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</a>
        <a href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</a>

        <div style={{ position: "relative" }}>
          <span style={{ cursor: "pointer" }} onClick={() => setDropdownOpen(!dropdownOpen)}>Tools ▼</span>
          {dropdownOpen && (
            <div className={styles["dropdown-menu"]}>
              <Link href="/tools/org-hierarchy">Org hierarchy</Link>
            </div>
          )}
        </div>
      </div>

      <div className={styles["home-pg-btns"]}>
        <TopNavRequestBtn styles={styles} className={"try-demo"} />
      </div>

      <div className={styles["home-pg-menu"]}>
        <MenuButton styles={{ styles }} />
      </div>
    </div>
  );
}

export default HomeTopNav;
