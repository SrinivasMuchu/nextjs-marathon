"use client";
import { sendGAtagEvent } from '@/common.helper';
import { CAD_FLOATING_BUTTON_EVENT } from '@/config';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { contextState } from './ContextProvider';
import { useCadForm } from '../CadServicePages/CadFormContext';

function FloatingButton() {
  const pathname = usePathname();
  const { anchorAds } = useContext(contextState);
  const { showPopup } = useCadForm();
  const [showOptions, setShowOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStickyStripVisible, setIsStickyStripVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 1399px)');
    const updateIsMobile = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStickyStripVisibility = (event) => {
      setIsStickyStripVisible(Boolean(event?.detail?.visible));
    };

    window.addEventListener('sticky-cad-strip-visibility-change', handleStickyStripVisibility);

    return () => {
      window.removeEventListener('sticky-cad-strip-visibility-change', handleStickyStripVisibility);
    };
  }, []);

  useEffect(() => {
    setIsStickyStripVisible(false);
  }, [pathname]);

  if (showPopup) return null;
  if (isMobile && isStickyStripVisible) return null;

  return (
    <div>
      {showOptions && (
        <div
          className="fixed flex flex-col gap-2 z-[9999]"
          style={{
            right: 'max(12px, env(safe-area-inset-right, 0px))',
            bottom: anchorAds ? 'max(150px, calc(80px + env(safe-area-inset-bottom, 0px)))' : 'max(80px, calc(20px + env(safe-area-inset-bottom, 0px)))',
          }}
        >

          <Link
            href="/tools/3d-cad-viewer"
              onClick={() => {
                sendGAtagEvent({ event_name: 'floating_button_view_click', event_category: CAD_FLOATING_BUTTON_EVENT });
                setShowOptions(false);
              }}
            className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
          >
            View CAD
          </Link>
          <Link
            href="/tools/3d-cad-file-converter"
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
        type="button"
        onClick={() => setShowOptions(!showOptions)}
        className="fixed bg-[#610bee] text-white px-4 py-3 sm:px-5 rounded-full shadow-lg transition z-[9999] text-sm sm:text-base"
        style={{
          right: 'max(12px, env(safe-area-inset-right, 0px))',
          bottom: anchorAds
            ? 'max(95px, calc(20px + env(safe-area-inset-bottom, 0px)))'
            : 'max(20px, env(safe-area-inset-bottom, 0px))',
        }}
      >
        CAD Actions
      </button>
    </div>
  );
}

export default FloatingButton;
