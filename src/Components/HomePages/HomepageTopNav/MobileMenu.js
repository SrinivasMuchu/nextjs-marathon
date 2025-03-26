"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function MobileMenu({ onClose, styles }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null); // Store dropdown name
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

  // "tools", "hr", "engineering"
  // Track submenus

  const toggleDropdown = (dropdownName) => {
    if (dropdownName === "tools") {
      setOpenDropdown(openDropdown === "tools" ? null : "tools");
      setOpenSubMenu(null); // Reset submenus when closing "tools"
    } else {
      setOpenSubMenu(openSubMenu === dropdownName ? null : dropdownName);
    }
  };

  return (
    <>
      <div className={styles["menu-close-icon"]}>
        <span onClick={handleCloseMenu}>close x</span>
      </div>

      <div className={styles["menu-navs"]}>
        <a href="#why-us" onClick={(e) => handleAnchorClick(e, "why-us")}>Why us?</a>
        <a href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")}>Capabilities</a>
        <a href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</a>
        <a href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</a>
        <a href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</a>

        {/* Dropdown for Tools */}
        <div className={styles["menu-dropdown"]}>
          {/* Tools Main Dropdown */}
          <span style={{ cursor: "pointer" }} onClick={() => toggleDropdown("tools")}>
            Tools ▼
          </span>

          {openDropdown === "tools" && (
            <div className={styles["menu-dropdown"]} style={{ display: "flex", flexDirection: "column",gap:'16px'}}>
              {/* HR Option */}
              <span style={{ cursor: "pointer" }} onClick={() => toggleDropdown("hr")}>
                HR {openSubMenu === "hr" ? "▲" : "▼"}
              </span>

              {/* HR Submenu */}
              {openSubMenu === "hr" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "10px" }}>
                  <Link href="/tools/org-hierarchy">Org Hierarchy</Link>
                </div>
              )}

              {/* Engineering Option */}
              <span style={{ cursor: "pointer" }} onClick={() => toggleDropdown("engineering")}>
                Engineering {openSubMenu === "engineering" ? "▲" : "▼"}
              </span>

              {/* Engineering Submenu */}
              {openSubMenu === "engineering" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "10px" }}>
                  <Link href="/tools/cad-viewer">CAD Viewer</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dropdown for Blogs */}
        <div className={styles["menu-dropdown"]}>
      {/* Blogs Main Dropdown */}
      <span style={{ cursor: "pointer" }} onClick={() => setOpenDropdown("blogs")}>
        Blogs ▼
      </span>

      {openDropdown === "blogs" && (
        <div  style={{ display: "flex", flexDirection: "column" }}>
          <Link href="/blog/part-number-nomenclature-guide">
            Part Number Nomenclature Guide
          </Link>
        </div>
      )}
    </div>
      </div>
    </>
  );
}

export default MobileMenu;
