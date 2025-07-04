"use client";
import IndustryCadViewer from "@/Components/IndustryDesigns/IndustryCadViewer";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React from "react";

const PartDesignView = dynamic(() => import("@/Components/PDMViewer/PartDesignView"), { ssr: false });
const CadHomeDesign = dynamic(() => import("@/Components/CadUploadingHome/CadHomeDesign/CadHomeDesign"), { ssr: false });

function DesignView() {
  const searchParams = useSearchParams();
  const format = searchParams.get("format");
 

  // If format is present, render CadHomeDesign (or your format-specific component)
  if (format) {
    return <IndustryCadViewer />;
  }

  // Default: render the 3D part viewer
  return <PartDesignView />;
}

export default DesignView;