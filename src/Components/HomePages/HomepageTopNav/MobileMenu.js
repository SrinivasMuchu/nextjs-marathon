"use client"
import React, { useState } from 'react'
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
function MobileMenu({ onClose, styles }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname(); // Get current route
    const router = useRouter(); // For navigation
  const handleCloseMenu = () => {
    onClose(); // Close the menu using the onClose prop
  };
  const handleAnchorClick = (event, sectionId) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (pathname !== "/") {
      // Redirect to home page first
      router.push(`/#${sectionId}`);
    } else {
      // Scroll smoothly to the section if already on home page
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
    handleCloseMenu()
  };

  return (
    <>
      <div className={styles['menu-close-icon']}>
        <span onClick={handleCloseMenu}>close x</span>
      </div>
      <div className={styles['menu-navs']}>
        {/* <Link href="#why-us" onClick={handleCloseMenu}>Why us?</Link>
        <Link href="#capabilities" onClick={handleCloseMenu}>Capabilities</Link>
        <Link href="#security" onClick={handleCloseMenu}>Security</Link> */}
        <a href="#why-us" onClick={(e) => handleAnchorClick(e, "why-us")}>Why us?</a>
        <a href="#capabilities" onClick={(e) => handleAnchorClick(e, "capabilities")} >Capabilities</a>
        <a href="#product" onClick={(e) => handleAnchorClick(e, "product")}>Product</a>
        <a href="#pricing" onClick={(e) => handleAnchorClick(e, "pricing")}>Pricing</a>
        <a href="#security" onClick={(e) => handleAnchorClick(e, "security")}>Security</a>
        <div className={styles['menu-dropdown']}>
          <span style={{ cursor: 'pointer' }} onClick={() => setDropdownOpen(!dropdownOpen)}>Tools ▼</span>
          {dropdownOpen && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <Link href="/tools/org-hierarchy">Org hierarchy</Link>
              {/* <Link href="/about">Organization</Link>
              <Link href="/about">Organization</Link> */}
              {/* <Link href="/about">Organization</Link>
              <Link href="/about">Organization</Link>
              <Link href="/about">Organization</Link> */}
              {/* <Link href="/contact">Contact</Link>
              <Link href="/careers">Careers</Link> */}
            </div>
          )}

        </div>


      </div>

    </>
  )
}

export default MobileMenu