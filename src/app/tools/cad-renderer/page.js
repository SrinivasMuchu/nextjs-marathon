"use client";
const CubeLoader = dynamic(() => import('@/Components/CommonJsx/Loaders/CubeLoader'), {
  ssr: false,
});
// import CubeLoader from "@/Components/CommonJsx/Loaders/CubeLoader";
import axios from "axios";
import IndustryCadViewer from "@/Components/IndustryDesigns/IndustryCadViewer";
import { GlbExplodeViewer } from "@/Components/PDMViewer/GlbExplodeViewer";
import DrawingCadView from "@/Components/PDMViewer/DrawingCadView";
import { BASE_URL, buildCadViewerGlbUrl, buildCadViewerMetaUrl, buildDesignGlbUrl, buildDesignGlbMetaUrl } from "@/config";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { recordFeedbackJobEvent } from "@/api/feedbackApi";

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
  // Library designs (designId) use design-glb CDN; CAD viewer uploads (fileId) use cad-output-files.
  const useLibraryGlbCdn = Boolean(designId);
  const useCadViewerOutput = Boolean(fileId && !designId);
  const cacheBust = searchParams.get("v") || searchParams.get("cb") || searchParams.get("ts");

  // Flow 11a: the 3D view of a converted file counts as "viewed" (the server ignores non-converter ids).
  useEffect(() => {
    if (fileId && !designId && !isSample) recordFeedbackJobEvent({ jobId: fileId, event: "result_viewed" });
  }, [fileId, designId, isSample]);

  const encodedTargetId = useMemo(
    () => (targetId ? encodeURIComponent(targetId) : ""),
    [targetId]
  );
  const glbUrl = useMemo(() => {
    if (!encodedTargetId) return "";
    if (useCadViewerOutput) return buildCadViewerGlbUrl(targetId);
    return buildDesignGlbUrl(targetId);
  }, [encodedTargetId, targetId, useCadViewerOutput]);
  const metaUrl = useMemo(() => {
    if (!encodedTargetId) return "";
    if (useCadViewerOutput) return buildCadViewerMetaUrl(targetId);
    return buildDesignGlbMetaUrl(targetId);
  }, [encodedTargetId, targetId, useCadViewerOutput]);
  const [status, setStatus] = useState(targetId ? "PENDING" : null);
  const [isGlbViewer, setIsGlbViewer] = useState(false);
  const [originalFileName, setOriginalFileName] = useState("");
  const [viewerMode, setViewerMode] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [convertStage, setConvertStage] = useState("");
  const [conversionError, setConversionError] = useState("");

  useEffect(() => {
    if (!targetId || !useLibraryGlbCdn) return;
    if (isSample) {
      setStatus("COMPLETED");
      setIsGlbViewer(true);
      return;
    }

    let cancelled = false;
    let intervalId = null;

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const fetchGlbStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/cad/get-status`, {
          params: { id: targetId, cad_type: "GLB_VIEWER" },
          headers: { "user-uuid": getOrCreateUuid() },
        });
        if (cancelled) return;
        if (response?.data?.meta?.success === false) return;

        const data = response?.data?.data || {};
        const jobStatus = String(data.status || "PENDING").toUpperCase();
        const isGlb = data.is_glb === true;
        const inProgress =
          jobStatus === "PENDING" ||
          jobStatus === "PROCESSING" ||
          jobStatus === "UPLOADING" ||
          jobStatus === "IN_QUEUE";

        // is_glb stays false until the file exists. That is in progress, not a failure.
        if (jobStatus === "COMPLETED" && isGlb) {
          setStatus("COMPLETED");
          setIsGlbViewer(true);
          stopPolling();
          return;
        }

        setIsGlbViewer(false);
        if (jobStatus === "FAILED") {
          setStatus("FAILED");
          return;
        }
        setStatus(inProgress ? jobStatus : "PROCESSING");
      } catch (e) {
        // A dropped poll is not a failed conversion. Keep the in-progress state
        // and let the next tick pick up PENDING / PROCESSING / COMPLETED.
      }
    };

    fetchGlbStatus();
    intervalId = setInterval(fetchGlbStatus, 3000);

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [targetId, useLibraryGlbCdn, isSample]);

  useEffect(() => {
    if (!targetId || format || useLibraryGlbCdn) return;
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
        // Owner check for a drawing returns this message. Mesh status does not.
        if (response?.data?.meta?.message === "File not found.") {
          setViewerMode("drawing");
          setStatus("FAILED");
          setConversionError("File not found.");
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          return;
        }
        const payload = response?.data?.data || {};
        const nextStatus = payload.status || "PENDING";
        const hasGlb = hasGlbParam
          ? queryIsGlb
          : Boolean(payload.glb_url);
        if (cancelled) return;
        setStatus(nextStatus);
        setIsGlbViewer(hasGlb);
        setViewerMode(payload.viewer_mode || "");
        setInputFormat(payload.input_format || "");
        setConvertStage(payload.convert_stage || "");
        setConversionError(payload.conversion_error || "");
        if (payload.file_name) {
          setOriginalFileName(payload.file_name);
        }
        if (nextStatus === "COMPLETED" || (payload.viewer_mode === "drawing" && nextStatus === "FAILED")) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (e) {
        // Keep polling. A single request error is not a failed conversion.
      }
    };

    fetchStatus();
    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [targetId, format, hasGlbParam, queryIsGlb, useLibraryGlbCdn, isSample]);

  if (!targetId) {
    return <PartDesignView />;
  }
  if (useLibraryGlbCdn) {
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
  if (viewerMode === "drawing") {
    if (status === "FAILED") {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div>
            <p>{conversionError || "Conversion failed."}</p>
          </div>
        </div>
      );
    }
    if (status !== "COMPLETED") {
      const stage = String(convertStage || status || "").toUpperCase();
      const dwg = String(inputFormat || "").toLowerCase() === "dwg";
      let message = "PREPARING_DRAWING";
      if (dwg && stage === "PENDING") message = "WAITING_CONVERSION";
      else if (dwg && stage === "PROCESSING") message = "CONVERTING_DWG";
      else if (dwg && (stage === "UPLOADING" || stage === "PREPARING")) message = "PREPARING_DRAWING";
      return <CubeLoader uploadingMessage={message} />;
    }
    return <DrawingCadView fileId={targetId} fileName={originalFileName} />;
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
      originalFileName={originalFileName}
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