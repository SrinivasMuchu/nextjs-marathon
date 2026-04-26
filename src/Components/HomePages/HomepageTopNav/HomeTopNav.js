"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

  const handleNavHover = (dropdownName = null) => {
    setOpenDropdown(dropdownName);
  };

  // Add this handler inside your component
  const handleDashboardClick = (e) => {
    setOpenDropdown(false);
    router.refresh();
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
          priority
        />
      </Link>

      <div className={styles["home-page-navs"]}>
        <Link
          href="#why-us"
          onMouseEnter={() => handleNavHover(null)}
          onClick={(e) => handleAnchorClick(e, "why-us")}
        >
          Why us?
        </Link>
        {/* <Link href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")}>Capabilities</Link>
        <Link href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</Link>
        <Link href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</Link> */}
        {/* <a href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</a> */}

        {/* Dropdown for Tools */}
      

        <Link
          href="/dashboard"
          rel="nofollow"
          onMouseEnter={() => handleNavHover(null)}
          onClick={handleDashboardClick}
        >
          Dashboard
        </Link>
        <Link href="/library" onMouseEnter={() => handleNavHover(null)}>Library</Link>
        <Link
          href="/cad-services"
          className={styles.topCta}
          aria-label="Hire Designers"
          onMouseEnter={() => handleNavHover(null)}
        >
          <span className={styles.topCtaDot} />
          Hire Designers <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => handleNavHover("tools")}
        >
          <Link
            href="/tools"
            className={styles["nav-dropdown-trigger"]}
            onClick={() => setOpenDropdown(null)}
          >
            Tools <span aria-hidden>▼</span>
          </Link>
          {openDropdown === "tools" && (
            <div className={styles["dropdown-menu"]}>
              <Link href="/tools" onClick={()=>setOpenDropdown(false)}>All tools</Link>
              <Link href="/tools/industries" onClick={()=>setOpenDropdown(false)}>All industries</Link>
              <Link href="/tools/org-hierarchy" onClick={()=>setOpenDropdown(false)}>Org Hierarchy</Link>
              <Link href="/tools/3D-cad-viewer" onClick={()=>setOpenDropdown(false)}>CAD Viewer</Link>
              <Link href="/tools/3d-cad-file-converter" onClick={()=>setOpenDropdown(false)}>CAD File Convert</Link>
              {/* <Link href="/tools/upload-cad-file">upload cad file</Link> */}
            </div>
          )}
        </div>

        <Link href="/resources" onMouseEnter={() => handleNavHover(null)}>
          Resources
        </Link>

        {/* Dropdown for Blogs */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => handleNavHover("blogs")}
        >
          <span
            className={styles["nav-dropdown-trigger"]}
            role="button"
            tabIndex={0}
            onClick={(e) => toggleDropdown(e,"blogs")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleDropdown(e, "blogs");
            }}
          >
            Blogs <span aria-hidden>▼</span>
          </span>
          {openDropdown === "blogs" && (
            <div className={styles["dropdown-menu"]} style={{ width: '200px' }}>
              <Link href="/blog/part-number-nomenclature-guide" onClick={()=>setOpenDropdown(false)}>Part Number Nomenclature Guide</Link>
            </div>
          )}
        </div>
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
