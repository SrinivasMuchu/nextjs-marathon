"use client";

import React, { Suspense } from "react";
import CadConverterStatusPage from "@/Components/CadUploadingHome/CadFileConversion/CadConverterStatusPage";

function CadConvertorPageFallback() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf8ff",
        color: "#5b21b6",
        fontFamily: "sans-serif",
      }}
    >
      Loading conversion status…
    </main>
  );
}

export default function CadConvertorPage() {
  return (
    <Suspense fallback={<CadConvertorPageFallback />}>
      <CadConverterStatusPage />
    </Suspense>
  );
}
