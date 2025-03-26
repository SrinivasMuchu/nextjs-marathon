"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeTopNav.module.css";
import TopNavRequestBtn from "../../CommonJsx/TopNavRequestBtn";
import MenuButton from "@/Components/CommonJsx/MenuButton";
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';

function HomeTopNav() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showHoverMenu, setShowHoverMenu] = useState(false); // Track hover menu state
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

  return (
    <div className={styles["home-page-top"]} >
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
        <a href="#why-us" onClick={(e) => handleAnchorClick(e, "why-us")} onMouseEnter={() => setShowHoverMenu(false)}>Why us?</a>
        <a href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")} onMouseEnter={() => setShowHoverMenu(false)}>Capabilities</a>
        <a href="#product" onClick={(e) => handleAnchorClick(e, "product")} onMouseEnter={() => setShowHoverMenu(false)}>Product</a>
        <a href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")} onMouseEnter={() => setShowHoverMenu(false)}>Pricing</a>
        <a href="#security" onClick={(e) => handleAnchorClick(e, "security")} onMouseEnter={() => setShowHoverMenu(false)}>Security</a>

        {/* Wrap "Tools" and Hover Menu Inside a Common Container */}
        <div
          className={styles["tools-hover-container"]}
          onMouseEnter={() => setShowHoverMenu('tools')}
          // onMouseLeave={() => setShowHoverMenu(false)}
        >
          {/* Tools Dropdown Trigger */}
          <span style={{ cursor: "pointer" }}>
            Tools <KeyboardArrowDownSharpIcon />
          </span>

          {/* Hover Dropdown Menu */}
          {showHoverMenu==='tools' && (
            <div className={styles["hover-dropdown-menu"]} onMouseLeave={() => setShowHoverMenu(false)}>
              <div className={styles["hover-dropdown-menu-list"]}>
                <span>HR</span>
                <div className={styles["hover-dropdown-menu-sub-list"]}>
                  <Link href="/tools/org-hierarchy">Org Hierarchy</Link>
                </div>
              </div>
              <div className={styles["hover-dropdown-menu-vertical"]}></div>
              <div className={styles["hover-dropdown-menu-list"]}>
                <span>Engineering</span>
                <div className={styles["hover-dropdown-menu-sub-list"]}>
                  <Link href="/tools/cad-viewer">CAD Viewer</Link>
                  <Link href="/tools/cad-viewer">CAD Viewer</Link>
                </div>
              </div>
              <div className={styles["hover-dropdown-menu-vertical"]}></div>
            </div>
          )}
        </div>

        {/* Dropdown for Blogs */}
        <div style={{ position: "relative" }}>
          <span style={{ cursor: "pointer" }} onMouseEnter={() => setShowHoverMenu('blogs')}>
            Blogs <KeyboardArrowDownSharpIcon />
          </span>
          {showHoverMenu==='blogs' && (
            <div className={styles["hover-dropdown-menu"]} onMouseLeave={() => setShowHoverMenu(false)}>
              <div className={styles["hover-dropdown-menu-list"]}>
                <span>Blogs</span>
                <div className={styles["hover-dropdown-menu-sub-list"]}>
                  <Link href="/blog/part-number-nomenclature-guide">Part Number Nomenclature Guide</Link>
                </div>
              </div>
              <div className={styles["hover-dropdown-menu-vertical"]}></div>
             
            </div>
          )}
          {/* {openDropdown === "blogs" && (
            <div className={styles["dropdown-menu"]} style={{ width: "200px" }}>
              <Link href="/blog/part-number-nomenclature-guide">Part Number Nomenclature Guide</Link>
            </div>
          )} */}
        </div>
      </div>

      <div className={styles["home-pg-btns"]} onMouseEnter={() => setShowHoverMenu(false)}>
        <TopNavRequestBtn styles={styles} className={"try-demo"} />
      </div>

      <div className={styles["home-pg-menu"]}>
        <MenuButton styles={{ styles }} />
      </div>
    </div>
  );
}

export default HomeTopNav;
