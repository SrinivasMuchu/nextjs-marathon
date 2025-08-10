"use client";
import React, { useEffect, useState } from "react";
import LeftRightBanner from "./AdsBanner";

function AnchorAdBanner() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const check = setTimeout(() => {
            const adEl = document.querySelector('ins[data-ad-slot="4237862906"]');
            if (adEl && adEl.innerHTML.trim().length > 0) {
                setIsLoaded(true);
            } else {
                setIsLoaded(false);
            }
        }, 3000);

        return () => clearTimeout(check);
    }, []);

    if (!isLoaded) return null;

    return (
        <div style={{ width: "80%", margin: "0 auto", height: "75px" }}>
            {isLoaded ? <LeftRightBanner adSlot="4237862906" /> : null}
        </div>

    );
}

export default AnchorAdBanner;
