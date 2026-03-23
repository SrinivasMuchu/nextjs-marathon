"use client";
const CubeLoader = dynamic(() => import('@/Components/CommonJsx/Loaders/CubeLoader'), {
  ssr: false,
});
// import CubeLoader from "@/Components/CommonJsx/Loaders/CubeLoader";
import IndustryCadViewer from "@/Components/IndustryDesigns/IndustryCadViewer";
import { GlbExplodeViewer } from "@/Components/PDMViewer/GlbExplodeViewer";
import { DESIGN_GLB_PREFIX_URL } from "@/config";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useMemo } from "react";

const PartDesignView = dynamic(() => import("@/Components/PDMViewer/PartDesignView"), { ssr: false });

function DesignViewContent() {
  const searchParams = useSearchParams();
  const format = searchParams.get("format");
  const fileId =
    searchParams.get("fileId") ||
    searchParams.get("id") ||
    searchParams.get("folderId");
  const cacheBust = searchParams.get("v") || searchParams.get("cb") || searchParams.get("ts");

  const encodedFileId = useMemo(
    () => (fileId ? encodeURIComponent(fileId) : ""),
    [fileId]
  );
  const glbUrl = useMemo(
    () =>
      encodedFileId
        ? `${DESIGN_GLB_PREFIX_URL}${encodedFileId}/${encodedFileId}.glb`
        : "",
    [encodedFileId]
  );
  const metaUrl = useMemo(
    () =>
      encodedFileId
        ? `${DESIGN_GLB_PREFIX_URL}${encodedFileId}/${encodedFileId}.json`
        : "",
    [encodedFileId]
  );

  if (format) {
    return <IndustryCadViewer />;
  }
  if (!fileId) {
    return <PartDesignView />;
  }

  return (
    <GlbExplodeViewer
      glbUrl={glbUrl}
      metaUrl={metaUrl}
      cacheBust={cacheBust || fileId}
    />
  );
}

export default function DesignView() {
  return (
    <Suspense fallback={<CubeLoader/>}>
      <DesignViewContent />
    </Suspense>
  );
}