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
      title='Advertisement'
      className={styles.anchorAds}
      style={{
        position: "fixed",
        bottom: "0",
        right: "0",
        width: "100%",   // mobile: 320x50, desktop: maybe bigger
        height: "90px",
        background: "#edf2f7",
        zIndex: 9999,
        boxShadow: "0 -2px 5px rgba(0,0,0,0.15)",
        justifyContent:'center',
        alignItems:'center'
      }}
    >
        <button
        onClick={() => setAnchorAds(false)}
        style={{
          position: "absolute",
          top: "-8px",
          right: "8px",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          cursor: "pointer",
          fontSize: "12px",
          lineHeight: "20px",
          textAlign: "center",
          
        }}
      >
        ×
      </button>
      
      <ins
        key={key}
        className="adsbygoogle"
        style={{ display: "inline-block", width: "750px", height: "100%",background:'#fff' }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AnchorAdBanner;

// data-full-width-responsive="true"