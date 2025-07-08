"use client"
import { sendFloatingButtonEvent } from '@/common.helper';
import { useState } from 'react'
import React from 'react'

function FloatingButton() {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div>{showOptions && (
      <div className="fixed bottom-20 right-6 flex flex-col gap-2 z-[9999]">
        <a
          href="/tools/cad-viewer"
          onClick={(e) => {
            e.preventDefault();
            sendFloatingButtonEvent('floating_button_view_click');
            setTimeout(() => {
              window.location.href = "/tools/cad-viewer";
            }, 100); // 100ms delay to allow GA event to fire
          }}
          className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
        >
          View CAD
        </a>
        <a
          href="/tools/3d-file-converter"
          onClick={(e) => {
            e.preventDefault();
            sendFloatingButtonEvent('floating_button_convert_click');
            setTimeout(() => {
              window.location.href = "/tools/cad-viewer";
            }, 100); // 100ms delay to allow GA event to fire
          }}
         
          className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
        >
          Convert CAD
        </a>
        <a
         onClick={(e) => {
            e.preventDefault();
            sendFloatingButtonEvent('floating_button_publish_click');
            setTimeout(() => {
              window.location.href = "/tools/cad-viewer";
            }, 100); // 100ms delay to allow GA event to fire
          }}
         
          href="/publish-cad"
          className="bg-white text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-100"
        >
          Publish CAD
        </a>
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