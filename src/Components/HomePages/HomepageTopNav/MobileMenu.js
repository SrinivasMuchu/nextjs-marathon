"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CheckHistory from "@/Components/CommonJsx/CheckHistory";

function MobileMenu({ onClose, styles }) {
  const [openDropdown, setOpenDropdown] = useState(null); // Store dropdown name
  const pathname = usePathname();
  const router = useRouter();

  const handleCloseMenu = () => {
    onClose(); // Close the menu
  };

  const handleAnchorClick = (event, sectionId) => {
    event.preventDefault();

    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
    handleCloseMenu();
  };

  // Function to toggle dropdown
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <>
      <div className={styles["menu-close-icon"]}>
        <span onClick={handleCloseMenu}>close x</span>
      </div>

      <div className={styles["menu-navs"]}>
      <a href="/about-us" >About us</a>
        <a href="#why-us" onClick={(e) => handleAnchorClick(e, "why-us")}>Why Us?</a>
        <a href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")}>Capabilities</a>
        <a href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</a>
        <a href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</a>
        <a href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</a>

        {/* Dropdown for Tools */}
        <div className={styles["menu-dropdown"]}>
          <span style={{ cursor: "pointer" }} onClick={() => toggleDropdown("tools")}>
            Tools ▼
          </span>
          {openDropdown === "tools" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Link href="/tools/org-hierarchy" onClick={handleCloseMenu}>
                Org Hierarchy
              </Link>
              <Link href="/tools/cad-viewer" onClick={handleCloseMenu}>CAD Viewer</Link>
              <Link href="/tools/3d-file-converter" onClick={handleCloseMenu}>CAD File Convert</Link>
              {/* <Link href="/tools/upload-cad-file" onClick={handleCloseMenu}>upload cad file</Link> */}
            </div>
          )}
        </div>

        {/* Dropdown for Blogs */}
        <div className={styles["menu-dropdown"]}>
          <span style={{ cursor: "pointer" }} onClick={() => toggleDropdown("blogs")}>
            Blogs ▼
          </span>
          {openDropdown === "blogs" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Link href="/blog/part-number-nomenclature-guide" onClick={handleCloseMenu}>
                Part Number Nomenclature Guide
              </Link>
            </div>
          )}
        </div>
         <a rel="nofollow" href="/dashboard?cad_type=CAD_VIEWER">
      Dashboard
    </a>
        <a href="/library" >Library</a>
        
         
      </div>
    </>
  );
}

export default MobileMenu;
