"use client";
import React, { useState } from "react";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import MobileMenu from "../HomePages/HomepageTopNav/MobileMenu";

function MenuButton({ creditsButton }) {
  const [openMenu, setMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuOpen(!openMenu);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <button type="button" className="mobile-menu-trigger" onClick={handleMenuOpen} aria-label="Open menu">
        <Image
          src={IMAGEURLS.menu}
          alt=""
          width={28}
          height={28}
          loading="eager"
        />
      </button>
      {openMenu ? (
        <MobileMenu onClose={handleCloseMenu} creditsButton={creditsButton} />
      ) : null}
    </>
  );
}

export default MenuButton;
