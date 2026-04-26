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

function getOrCreateUuid() {
  if (typeof window === "undefined") return "";
  let uuid = localStorage.getItem("uuid");
  if (!uuid) {
    uuid = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("uuid", uuid);
  }
  return uuid;
}

function DesignViewContent() {
  const searchParams = useSearchParams();
  const format = searchParams.get("format");
  const isSample = /^(true|1|yes)$/i.test(String(searchParams.get("sample") || ""));
  const glbParam = searchParams.get("glb");
  const hasGlbParam = glbParam != null;
  const queryIsGlb = hasGlbParam && /^(true|1|yes)$/i.test(String(glbParam));
  const designId = searchParams.get("designId");
  const fileId = searchParams.get("fileId") || searchParams.get("id") || searchParams.get("folderId");
  const targetId = designId || fileId;
  // In cad-renderer route, GLB mode should only be driven by designId.
  // Keep `glb=true` in URL for backward compatibility, but do not switch mode by it.
  const useGlbMode = Boolean(designId);
  const cacheBust = searchParams.get("v") || searchParams.get("cb") || searchParams.get("ts");

  const encodedTargetId = useMemo(
    () => (targetId ? encodeURIComponent(targetId) : ""),
    [targetId]
  );
  const glbUrl = useMemo(
    () =>
      encodedTargetId
        ? `${DESIGN_GLB_PREFIX_URL}${encodedTargetId}/${encodedTargetId}.glb`
        : "",
    [encodedTargetId]
  );
  const metaUrl = useMemo(
    () =>
      encodedTargetId
        ? `${DESIGN_GLB_PREFIX_URL}${encodedTargetId}/${encodedTargetId}.json`
        : "",
    [encodedTargetId]
  );
  const [status, setStatus] = useState(targetId ? "PENDING" : null);
  const [isGlbViewer, setIsGlbViewer] = useState(false);

  useEffect(() => {
    if (!targetId || !useGlbMode) return;
    if (isSample) {
      setStatus("COMPLETED");
      setIsGlbViewer(true);
      return;
    }

    let cancelled = false;
    let intervalId = null;

    const fetchGlbStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/cad/get-status`, {
          params: { id: targetId, cad_type: "GLB_VIEWER" },
          headers: { "user-uuid": getOrCreateUuid() },
        });
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
  }, [targetId, useGlbMode, isSample]);

  useEffect(() => {
    if (!targetId || format || useGlbMode) return;
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
          params: { id: targetId, cad_type: "CAD_VIEWER" },
          headers: { "user-uuid": getOrCreateUuid() },
        });
        const nextStatus = response?.data?.data?.status || "PENDING";
        const hasGlb = hasGlbParam
          ? queryIsGlb
          : Boolean(response?.data?.data?.glb_url);
        if (cancelled) return;
        setStatus(nextStatus);
        setIsGlbViewer(hasGlb);
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

    fetchStatus();
    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [targetId, format, hasGlbParam, queryIsGlb, useGlbMode, isSample]);

  if (!targetId) {
    return <PartDesignView />;
  }
  if (useGlbMode) {
    if (status !== "COMPLETED") {
      return <CubeLoader uploadingMessage={status || "IN_QUEUE"} />;
    }
    return (
      <GlbExplodeViewer
        glbUrl={glbUrl}
        metaUrl={metaUrl}
        cacheBust={cacheBust || targetId}
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
      cacheBust={cacheBust || targetId}
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