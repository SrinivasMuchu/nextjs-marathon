"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const CubeLoader = dynamic(() => import("@/Components/CommonJsx/Loaders/CubeLoader"), {
  ssr: false,
});

const CadUploadingView = dynamic(() => import("@/Components/PDMViewer/CadUploadingView"), {
  ssr: false,
});

export default function CadUploadingPage() {
  return (
    <Suspense fallback={<CubeLoader />}>
      <CadUploadingView />
    </Suspense>
  );
}
