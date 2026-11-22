"use client";
import { useEffect } from "react";
import { GOOGLE_ADSENSE_CLIENT_ID } from "@/config";

export default function LeftRightBanner({ adSlot }) {
  console.log('GOOGLE_ADSENSE_CLIENT_ID', adSlot);
  useEffect(() => {
    const el = document.querySelector(`ins[data-ad-slot="${adSlot}"]`);
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && el.offsetWidth > 0) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense error:', e);
        }
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(el);
    return () => observer.disconnect();
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
