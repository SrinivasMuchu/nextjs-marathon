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
      <Link href="/about-us" onClick={handleCloseMenu}>About us</Link>
        <Link href="#why-us" onClick={(e) => handleAnchorClick(e, "why-us")}>Why us?</Link>
        <Link href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")}>Capabilities</Link>
        <Link href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</Link>
        <Link href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</Link>
        <Link href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</Link>
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
         <Link rel="nofollow" href="/dashboard" onClick={handleCloseMenu}>
      Dashboard
    </Link>
        <Link href="/library" onClick={handleCloseMenu}>Library</Link>
        
         
      </div>
    </>
  );
}

export default MobileMenu;
