"use client"
import { sendGAtagEvent } from '@/common.helper';
import { CAD_FLOATING_BUTTON_EVENT } from '@/config';
import { useState } from 'react'
import React from 'react'
import Link from 'next/link';
function FloatingButton() {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div>{showOptions && (
      <div className="fixed bottom-20 right-6 flex flex-col gap-2 z-[9999]">
        <Link
          href="/tools/cad-viewer"
          onClick={() => {
           
            sendGAtagEvent({ event_name: 'floating_button_view_click', event_category: CAD_FLOATING_BUTTON_EVENT });
            // 100ms delay to allow GA event to fire
          }}
          className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
        >
          View CAD
        </Link>
        <Link
          href="/tools/3d-file-converter"
          onClick={() => {
           
            sendGAtagEvent({ event_name: 'floating_button_convert_click', event_category: CAD_FLOATING_BUTTON_EVENT });
             // 100ms delay to allow GA event to fire
          }}
         
          className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
        >
          Convert CAD
        </Link>
        <Link
        href="/publish-cad"
         onClick={() => {
          
            sendGAtagEvent({ event_name: 'floating_button_publish_click', event_category: CAD_FLOATING_BUTTON_EVENT });
            // 100ms delay to allow GA event to fire
          }}
         
          // href="/publish-cad"
          className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
        >
          Publish CAD
        </Link>
        <Link
        href="/library"
         onClick={() => {
         
            sendGAtagEvent({ event_name: 'floating_button_library_click', event_category: CAD_FLOATING_BUTTON_EVENT });
            // 100ms delay to allow GA event to fire
          }}
         
          // href="/publish-cad"
          className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
        >
          Library
        </Link>
      </div>
    )}

      {/* Floating Main Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="fixed bottom-6 right-6 bg-[#610bee] text-white px-5 py-3 rounded-full shadow-lg transition z-[9999]"
      >
        CAD Actions
      </button></div>
  )
}

export default FloatingButton