"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { BASE_URL, CAD_CONVERTER_EVENT } from "@/config";
import { sendClarityEvent, sendGAtagEvent } from "@/common.helper";
import {
  getCadConverterFileIdFromSearchParams,
} from "@/lib/cadConverterRoutes";

const CubeLoader = dynamic(() => import("@/Components/CommonJsx/Loaders/CubeLoader"), {
  ssr: false,
});

const CONVERTER_TOOL_HREF = "/tools/3d-cad-file-converter";
const DASHBOARD_HREF = "/dashboard?cad_type=CAD_CONVERTER";

function CadConverterStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = getCadConverterFileIdFromSearchParams(searchParams);
  const fileIdRef = useRef(fileId);

  const [uploadingMessage, setUploadingMessage] = useState(fileId ? "PENDING" : "");
  const [progressPercent, setProgressPercent] = useState(null);
  const [conversionSteps, setConversionSteps] = useState(null);
  const [fileName, setFileName] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [fileSize, setFileSize] = useState(null);
  const [isSampleFile, setIsSampleFile] = useState(false);
  const [missingId, setMissingId] = useState(!fileId);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fileIdRef.current = fileId;
  }, [fileId]);

  const applyProgressPayload = useCallback((data = {}) => {
    if (Array.isArray(data.steps) && data.steps.length > 0) {
      setConversionSteps(data.steps);
    }
    const pct = Number(data.progress_percent);
    if (Number.isFinite(pct) && pct >= 0) {
      setProgressPercent(Math.min(100, Math.max(0, Math.round(pct))));
    }
    if (data.file_name) setFileName(data.file_name);
    if (data.output_format) setOutputFormat(data.output_format);
    if (data.sample_file != null) setIsSampleFile(Boolean(data.sample_file));
    const size = Number(data.input_file_size_bytes);
    if (Number.isFinite(size) && size > 0) setFileSize(size);
  }, []);

  const getStatus = useCallback(async () => {
    const id = fileIdRef.current;
    if (!id) return;

    try {
      const response = await axios.get(`${BASE_URL}/v1/cad/get-status`, {
        params: { id, cad_type: "CAD_CONVERTER" },
        headers: { "user-uuid": localStorage.getItem("uuid") },
      });

      if (!response.data?.meta?.success) {
        setUploadingMessage("FAILED");
        setNotFound(true);
        toast.error(response.data?.meta?.message || "Could not load conversion status.");
        return;
      }

      const data = response.data.data || {};
      if (!data.status && !data.folderId) {
        setNotFound(true);
        setUploadingMessage("FAILED");
        return;
      }

      applyProgressPayload(data);
      const status = data.status;

      if (status === "COMPLETED") {
        sendGAtagEvent({
          event_name: "converter_conversion_success",
          event_category: CAD_CONVERTER_EVENT,
        });
        sendClarityEvent("converter_conversion_success", {
          converter_funnel: "converted",
        });
        setUploadingMessage("COMPLETED");
        setProgressPercent(100);
        router.replace(DASHBOARD_HREF);
        return;
      }

      if (status === "FAILED") {
        sendGAtagEvent({
          event_name: "converter_conversion_failure",
          event_category: CAD_CONVERTER_EVENT,
        });
        sendClarityEvent("converter_conversion_failure", {
          converter_funnel: "failed",
        });
        setUploadingMessage("FAILED");
        toast.error("Conversion failed. Please try again.");
        return;
      }

      setUploadingMessage(status || "PENDING");
    } catch (error) {
      console.error("Error fetching converter status:", error);
      setUploadingMessage("FAILED");
    }
  }, [applyProgressPayload, router]);

  useEffect(() => {
    if (!fileId) {
      setMissingId(true);
      return;
    }
    setMissingId(false);
    setNotFound(false);

    getStatus();
    const interval = setInterval(getStatus, 2000);
    return () => clearInterval(interval);
  }, [fileId, getStatus]);

  const handleCancel = () => {
    router.push(CONVERTER_TOOL_HREF);
  };

  if (missingId) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          background: "#faf8ff",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, color: "#1f2937" }}>No conversion selected</h1>
        <p style={{ margin: 0, color: "#6b7280", maxWidth: 420 }}>
          Open a conversion from the converter or your dashboard to track its progress.
        </p>
        <Link href={CONVERTER_TOOL_HREF} style={{ color: "#6d28d9", fontWeight: 600 }}>
          Go to CAD converter
        </Link>
      </main>
    );
  }

  if (notFound || uploadingMessage === "FAILED") {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          background: "#faf8ff",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, color: "#1f2937" }}>
          {notFound ? "Conversion not found" : "Conversion failed"}
        </h1>
        <p style={{ margin: 0, color: "#6b7280", maxWidth: 420 }}>
          {notFound
            ? "This file id is invalid or no longer available."
            : "Something went wrong while converting your file. Please try again."}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href={CONVERTER_TOOL_HREF} style={{ color: "#6d28d9", fontWeight: 600 }}>
            Convert another file
          </Link>
          <Link href={DASHBOARD_HREF} style={{ color: "#6b7280", fontWeight: 600 }}>
            Open dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CubeLoader
        uploadingMessage={uploadingMessage}
        type="convert"
        progressPercent={progressPercent ?? undefined}
        conversionSteps={conversionSteps}
        fileName={fileName}
        outputFormat={outputFormat}
        fileSize={fileSize}
        isSampleFile={isSampleFile}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default CadConverterStatusPage;
