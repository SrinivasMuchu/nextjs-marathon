import React, { useEffect } from 'react'

function LeftRightBanner({ adSlot }) {
  useEffect(() => {
    // Push the ad after component mounts
    // The AdSense script is already loaded in layout.js
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('AdSense ad pushed for slot:', adSlot);
        } else {
          console.warn('AdSense not loaded yet');
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [adSlot]);

  return (
    <div style={{ background: 'transparent' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3333540431554607"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default LeftRightBanner