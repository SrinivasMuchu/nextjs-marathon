"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeTopNav.module.css";
import TopNavProfileButton from "../../CommonJsx/TopNavProfileButton";
import MenuButton from "@/Components/CommonJsx/MenuButton";
import CheckHistory from "@/Components/CommonJsx/CheckHistory";

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


  const toggleDropdown = (e,dropdownName) => {
    e.stopPropagation()
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className={styles["home-page-top"]} onClick={()=> setOpenDropdown(false)}>
      <Link href="/">
        <Image
          src={IMAGEURLS.logo}
          alt="Marathon Logo"
          width={500}
          height={500}
          className={styles["home-page-top-logo"]}
          loading="eager"
        />
      </Link>

      <div className={styles["home-page-navs"]}>
        <Link href="#why-us" onClick={(e) => handleAnchorClick(e, "why-us")}>Why us?</Link>
        <Link href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")}>Capabilities</Link>
        <Link href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</Link>
        <Link href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</Link>
        {/* <a href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</a> */}

        {/* Dropdown for Tools */}
        <div style={{ position: "relative" }}>
          <span style={{ cursor: "pointer" }} onClick={(e) => toggleDropdown(e,"tools")}>
            Tools ▼
          </span>
          {openDropdown === "tools" && (
            <div className={styles["dropdown-menu"]}>
              <Link href="/tools/org-hierarchy" onClick={()=>setOpenDropdown(false)}>Org Hierarchy</Link>
              <Link href="/tools/cad-viewer" onClick={()=>setOpenDropdown(false)}>CAD Viewer</Link>
              <Link href="/tools/3d-file-converter" onClick={()=>setOpenDropdown(false)}>CAD File Convert</Link>
              {/* <Link href="/tools/upload-cad-file">upload cad file</Link> */}
            </div>
          )}
        </div>

        {/* Dropdown for Blogs */}
        <div style={{ position: "relative" }}>
          <span style={{ cursor: "pointer" }} onClick={(e) => toggleDropdown(e,"blogs")}>
            Blogs ▼
          </span>
          {openDropdown === "blogs" && (
            <div className={styles["dropdown-menu"]} style={{ width: '200px' }}>
              <Link href="/blog/part-number-nomenclature-guide" onClick={()=>setOpenDropdown(false)}>Part Number Nomenclature Guide</Link>
            </div>
          )}
        </div>

        <Link href="/dashboard?cad_type=CAD_VIEWER" rel="nofollow">
          Dashboard
        </Link>
        <Link href="/library" >Library</Link>
      </div>

      <div className={styles["home-pg-btns"]}>
        <TopNavProfileButton styles={styles} className={"try-demo"} topBar='profile'/>
      </div>

      <div className={styles["home-pg-menu"]}>
        <MenuButton styles={{ styles }} />
      </div>
    </div>
  );
}

export default HomeTopNav;
