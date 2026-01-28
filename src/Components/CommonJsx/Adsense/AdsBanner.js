"use client";
import { useEffect } from "react";
import { GOOGLE_ADSENSE_CLIENT_ID } from "@/config";

export default function LeftRightBanner({ adSlot }) {
  console.log('GOOGLE_ADSENSE_CLIENT_ID', adSlot);
  useEffect(() => {
  const observer = new ResizeObserver(entries => {
    const width = entries[0].contentRect.width;
    if (width > 0) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log('AdSense pushed after width detected:', width);
      } catch (e) {
        console.error('AdSense error:', e);
      }
      observer.disconnect();
    }
  });
  const el = document.querySelector(`ins[data-ad-slot="${adSlot}"]`);
  if (el) observer.observe(el);
}, [adSlot]);

  return (
    <ins
      
      className="adsbygoogle"
      style={{ display: "block", width: "100%", minHeight: "100px" }}
      data-ad-client={GOOGLE_ADSENSE_CLIENT_ID}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
