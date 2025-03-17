"use client";
import dynamic from "next/dynamic";
const PartDesignView = dynamic(() => import("@/Components/PDMViewer/PartDesignView"), {
  ssr: false, // ✅ Prevents SSR issues by loading only in the browser
});
import React from 'react'

function DesignView() {
  return (
    <PartDesignView/>
  )
}

export default DesignView