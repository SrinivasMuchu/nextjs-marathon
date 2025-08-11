"use client";
import React, { useEffect, useState } from "react";
import LeftRightBanner from "./AdsBanner";

function AnchorAdBanner() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
    const adEl = document.querySelector('ins[data-ad-slot="4237862906"]');
    if (!adEl) return;

    const observer = new MutationObserver(() => {
        if (adEl.innerHTML.trim().length > 0) {
            setIsLoaded(true);
            observer.disconnect();
        }
    });

    observer.observe(adEl, { childList: true, subtree: true });

    return () => observer.disconnect();
}, []);


    if (!isLoaded) return null;

    return (
        <div style={{ width: "80%", margin: "0 auto", height: "75px" }}>
            {isLoaded ? <LeftRightBanner adSlot="4237862906" /> : null}
        </div>

    );
}

export default AnchorAdBanner;
