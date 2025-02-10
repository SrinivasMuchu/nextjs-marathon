"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";


const Boxes = dynamic(() => import("./ui/background-boxes"), { ssr: false });
function BoxesConditional() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth > 768);
        };

        checkScreenSize(); // Initial check
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return isDesktop ? <Boxes /> : null;
}

export default BoxesConditional