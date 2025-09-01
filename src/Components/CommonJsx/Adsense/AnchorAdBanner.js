"use client";
import React, { useEffect, useState,useContext } from "react";
import { contextState } from "../ContextProvider";
import { GOOGLE_ADSENSE_CLIENT_ID } from "@/config";
import { usePathname } from "next/navigation";
import styles from '../CommonStyles.module.css'
function AnchorAdBanner({ adSlot }) {
  const {setAnchorAds,anchorAds} = useContext(contextState);
const pathname = usePathname();
  const [key, setKey] = useState(0);
 


  useEffect(() => {
    setKey(prev => prev + 1);
     if (window.innerWidth < 480) {
      setAnchorAds(false);
      return; // Don't observe
    }
    setAnchorAds(true);
  }, [pathname, adSlot]);


  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [key]);


  if (!anchorAds) return null;


  return (
    <div
    className={styles.anchorAds}
    style={{
      position: "fixed",
      width: "100%",
      left: 0,
      right: 0,
      bottom: 0,
      // background: "#fff",
      // display: "flex",
      justifyContent: "center",
      height:'90px',
      zIndex: 9999,
      pointerEvents: "none", // allow clicks through outer except for the inner box
    }}
  >
    {/* inner: actual ad container (centered) */}
    <div
      style={{
        position: "relative", 
        minWidth:'480px'  ,  // makes the close button position relative to this box
        // width:'100%',            // full width on small screens
        // maxWidth: "728px",        // narrow & centered on larger screens
        margin: "0 12px",         // small side gap on mobile
        height: "90px",
        background: "#e1e2e3ff",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.15)",
       
        pointerEvents: "auto",    // allow interacting with ad and button
      }}
    >
      <button
        onClick={() => setAnchorAds(false)}
        style={{
          position: "absolute",
          top: -15,
          right: -15,
          zIndex: 99999,
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 24,
          height: 24,
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        ×
      </button>


      <ins
        key={key}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-full-width-responsive={window.innerWidth < 480 ? "false" : "true"}
      />
    </div>
  </div>
  );
}


export default AnchorAdBanner;


// data-full-width-responsive="true"

