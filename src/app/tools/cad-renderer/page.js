"use client";
const CubeLoader = dynamic(() => import('@/Components/CommonJsx/Loaders/CubeLoader'), {
  ssr: false,
});
// import CubeLoader from "@/Components/CommonJsx/Loaders/CubeLoader";
import IndustryCadViewer from "@/Components/IndustryDesigns/IndustryCadViewer";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const PartDesignView = dynamic(() => import("@/Components/PDMViewer/PartDesignView"), { ssr: false });

function DesignViewContent() {
  const searchParams = useSearchParams();
  const format = searchParams.get("format");

  if (format) {
    return <IndustryCadViewer />;
  }
  return <PartDesignView />;
}

export default function DesignView() {
  return (
    <Suspense fallback={<CubeLoader/>}>
      <DesignViewContent />
    </Suspense>
  );
}