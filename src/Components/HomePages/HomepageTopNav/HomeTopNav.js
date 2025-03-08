"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeTopNav.module.css";
import TopNavRequestBtn from "../../CommonJsx/TopNavRequestBtn";
import MenuButton from "@/Components/CommonJsx/MenuButton";

function HomeTopNav() {
  const [openDropdown, setOpenDropdown] = useState(null); // Store dropdown name
  const pathname = usePathname();
  const router = useRouter();

  const handleAnchorClick = (event, sectionId) => {
    event.preventDefault();
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to toggle dropdown
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
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

        {/* Dropdown for Tools */}
        <div style={{ position: "relative" }}>
          <span style={{ cursor: "pointer" }} onClick={() => toggleDropdown("tools")}>
            Tools ▼
          </span>
          {openDropdown === "tools" && (
            <div className={styles["dropdown-menu"]}>
              <Link href="/tools/org-hierarchy">Org hierarchy</Link>
            </div>
          )}
        </div>

        {/* Dropdown for Blogs */}
        <div style={{ position: "relative" }}>
          <span style={{ cursor: "pointer" }} onClick={() => toggleDropdown("blogs")}>
            Blogs ▼
          </span>
          {openDropdown === "blogs" && (
            <div className={styles["dropdown-menu"]} style={{width:'200px'}}>
              <Link href="/blog/part-number-nomenclature-guide">Part Number Nomenclature Guide</Link>
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
