"use client"
import React, { useState } from 'react'
import Link from 'next/link';

function MobileMenu({ onClose, styles }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleCloseMenu = () => {
    onClose(); // Close the menu using the onClose prop
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
        <Link href="#why-us" onClick={handleCloseMenu}>Why us?</Link>
        <Link href="#capabilities" onClick={handleCloseMenu}>Capabilities</Link>
        <Link href="#product" onClick={handleCloseMenu}>Product</Link>
        <Link href="#pricing" onClick={handleCloseMenu}>Pricing</Link>
        <Link href="#security" onClick={handleCloseMenu}>Security</Link>
        <div className={styles['menu-dropdown']}>
          <span style={{ cursor: 'pointer' }} onClick={() => setDropdownOpen(!dropdownOpen)}>Tools ▼</span>
          {dropdownOpen && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <Link href="/org">Organization</Link>
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