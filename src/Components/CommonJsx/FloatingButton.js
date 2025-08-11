"use client";
import { sendGAtagEvent } from '@/common.helper';
import { CAD_FLOATING_BUTTON_EVENT } from '@/config';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function FloatingButton() {
  const [showOptions, setShowOptions] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(65); // Tailwind bottom-6 = 1.5rem ≈ 24px

  useEffect(() => {
    // AdSense anchor ads use a div with id="google_ads_iframe_*" fixed to bottom.
    const checkAd = () => {
      const adElement = document.querySelector('iframe[id^="google_ads_iframe"]');
      if (adElement) {
        // Add extra space so button is above the ad
        setBottomOffset(adElement.offsetHeight + 16);
      } else {
        setBottomOffset(65);
      }
    };

    checkAd();
    const observer = new MutationObserver(checkAd);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {showOptions && (
        <div
          className="fixed right-6 flex flex-col gap-2 z-[9999]"
          style={{ bottom: bottomOffset + 56 }} // 56px is approx height of main button
        >

          <Link
            href="/tools/cad-viewer"
              onClick={() => {
                sendGAtagEvent({ event_name: 'floating_button_view_click', event_category: CAD_FLOATING_BUTTON_EVENT });
                setShowOptions(false);
              }}
            className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
          >
            View CAD
          </Link>
          <Link
            href="/tools/3d-file-converter"
              onClick={() => {
                sendGAtagEvent({ event_name: 'floating_button_convert_click', event_category: CAD_FLOATING_BUTTON_EVENT });
                setShowOptions(false);
              }}
            className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
          >
            Convert CAD
          </Link>
          <Link
            href="/publish-cad"
            onClick={() =>{
              sendGAtagEvent({ event_name: 'floating_button_publish_click', event_category: CAD_FLOATING_BUTTON_EVENT });
              setShowOptions(false);
            }}
            className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
          >
            Publish CAD
          </Link>
          <Link
            href="/library"
            // onClick={() =>
            //   sendGAtagEvent({ event_name: 'floating_button_library_click', event_category: CAD_FLOATING_BUTTON_EVENT })
            // }
            onClick={() => {
              sendGAtagEvent({
                event_name: 'floating_button_library_click',
                event_category: CAD_FLOATING_BUTTON_EVENT
              });
              setShowOptions(false); // Call your other function here
            }}
            className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
          >
            Library
          </Link>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="fixed right-6 bg-[#610bee] text-white px-5 py-3 rounded-full shadow-lg transition z-[9999]"
        style={{ bottom: bottomOffset }}
      >
        CAD Actions
      </button>
    </div>
  );
}

export default FloatingButton;
