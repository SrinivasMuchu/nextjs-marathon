"use client";
import React, { useState } from "react";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import HomeNavs from "../HomePages/HomepageTopNav/HomeNavs";

function MenuButton({ styles }) {
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
            
                <Image src={IMAGEURLS.menu} alt="Menu Icon" width={500}
                    height={500} onClick={(e) => handleMenuOpen(e)}/>
            
            {openMenu && <HomeNavs onClose={handleCloseMenu}/>}
        </>


    )
}

export default MenuButton