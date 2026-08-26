"use client";

import React, { Suspense } from "react";
import CadConverterStatusPage from "@/Components/CadUploadingHome/CadFileConversion/CadConverterStatusPage";

const PAGE_SHELL = {
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(180deg, #f7f5ff 0%, #ffffff 42%)",
};

function CadConvertorPageFallback() {
  return <main style={PAGE_SHELL} aria-busy="true" />;
}

export default function CadConvertorPage() {
  return (
    <Suspense fallback={<CadConvertorPageFallback />}>
      <CadConverterStatusPage />
    </Suspense>
  );
}
