"use client";
const CubeLoader = dynamic(() => import('@/Components/CommonJsx/Loaders/CubeLoader'), {
  ssr: false,
});
// import CubeLoader from "@/Components/CommonJsx/Loaders/CubeLoader";
import axios from "axios";
import IndustryCadViewer from "@/Components/IndustryDesigns/IndustryCadViewer";
import { GlbExplodeViewer } from "@/Components/PDMViewer/GlbExplodeViewer";
import { BASE_URL, DESIGN_GLB_PREFIX_URL } from "@/config";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";

const PartDesignView = dynamic(() => import("@/Components/PDMViewer/PartDesignView"), { ssr: false });

function DesignViewContent() {
  const searchParams = useSearchParams();
  const format = searchParams.get("format");
  const isSample = /^(true|1|yes)$/i.test(String(searchParams.get("sample") || ""));
  const glbParam = searchParams.get("glb");
  const hasGlbParam = glbParam != null;
  const queryIsGlb = hasGlbParam && /^(true|1|yes)$/i.test(String(glbParam));
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
  const [status, setStatus] = useState(fileId ? "PENDING" : null);
  const [isGlbViewer, setIsGlbViewer] = useState(false);

  useEffect(() => {
    if (!fileId || !queryIsGlb) return;
    if (isSample) {
      setStatus("COMPLETED");
      setIsGlbViewer(true);
      return;
    }

    let cancelled = false;
    let intervalId = null;

    const fetchGlbStatus = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/v1/cad/get-status`,
          { id: fileId, cad_type: "GLB_VIEWER" },
          { headers: { "user-uuid": localStorage.getItem("uuid") || "" } }
        );
        const nextStatus = response?.data?.data?.status || "IN_QUEUE";
        if (cancelled) return;
        setStatus(nextStatus);
        setIsGlbViewer(nextStatus === "COMPLETED");
        if (nextStatus === "COMPLETED" || nextStatus === "FAILED") {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (e) {
        if (!cancelled) {
          setStatus("FAILED");
          setIsGlbViewer(false);
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      }
    };

    fetchGlbStatus();
    intervalId = setInterval(fetchGlbStatus, 3000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [fileId, queryIsGlb, isSample]);

  useEffect(() => {
    if (!fileId || format || queryIsGlb) return;
    if (isSample) {
      // Sample route is static: skip status polling/API entirely.
      setStatus("COMPLETED");
      setIsGlbViewer(queryIsGlb);
      return;
    }

    let cancelled = false;
    let intervalId = null;

    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/cad/get-status`, {
          params: { id: fileId, cad_type: "CAD_VIEWER" },
          headers: { "user-uuid": localStorage.getItem("uuid") || "" },
        });
        const nextStatus = response?.data?.data?.status || "PENDING";
        const hasGlb = hasGlbParam
          ? queryIsGlb
          : Boolean(response?.data?.data?.glb_url);
        if (cancelled) return;
        setStatus(nextStatus);
        setIsGlbViewer(hasGlb);
      } catch (e) {
        if (!cancelled) {
          setStatus("FAILED");
          setIsGlbViewer(false);
        }
      }
    };

    fetchStatus();
    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [fileId, format, hasGlbParam, queryIsGlb, isSample]);

  if (!fileId) {
    return <PartDesignView />;
  }
  if (queryIsGlb) {
    if (status !== "COMPLETED") {
      return <CubeLoader uploadingMessage={status || "IN_QUEUE"} />;
    }
    return (
      <GlbExplodeViewer
        glbUrl={glbUrl}
        metaUrl={metaUrl}
        cacheBust={cacheBust || fileId}
      />
    );
  }
  if (format) {
    return <IndustryCadViewer />;
  }
  if (status !== "COMPLETED") {
    return <CubeLoader uploadingMessage={status || "PENDING"} />;
  }

  if (!isGlbViewer) {
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