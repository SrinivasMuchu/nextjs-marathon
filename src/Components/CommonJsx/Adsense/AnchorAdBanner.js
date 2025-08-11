"use client";
import React, { useEffect, useState } from "react";
import { GOOGLE_ADSENSE_CLIENT_ID } from "@/config";
import { usePathname } from "next/navigation";

function AnchorAdBanner({ adSlot }) {
const pathname = usePathname();
  const [key, setKey] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setKey(prev => prev + 1);
    setVisible(true);
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

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        right: "0",
        width: "100%",   // mobile: 320x50, desktop: maybe bigger
        height: "60px",
        background: "#fff",
        zIndex: 9999,
        boxShadow: "0 -2px 5px rgba(0,0,0,0.15)"
      }}
    >
        <button
        onClick={() => setVisible(false)}
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
          textAlign: "center"
        }}
      >
        ×
      </button>
      <ins
        key={key}
        className="adsbygoogle"
        style={{ display: "inline-block", width: "100%", height: "100%" }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AnchorAdBanner;

// data-full-width-responsive="true"