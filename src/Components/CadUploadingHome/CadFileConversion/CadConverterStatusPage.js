"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { BASE_URL, CAD_CONVERTER_EVENT } from "@/config";
import { sendClarityEvent, sendGAtagEvent } from "@/common.helper";
import {
  getCadConverterFileIdFromSearchParams,
  readCadConverterJobPreview,
} from "@/lib/cadConverterRoutes";
import {
  getConverterLoadingOverlay,
  hideConverterLoadingOverlay,
  persistConverterLoadingOverlay,
  showConverterLoadingOverlay,
  updateConverterLoadingOverlay,
} from "@/lib/converterLoadingOverlay";

const CONVERTER_TOOL_HREF = "/tools/3d-cad-file-converter";
const DASHBOARD_HREF = "/dashboard?cad_type=CAD_CONVERTER";

const PAGE_SHELL = {
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(180deg, #f7f5ff 0%, #ffffff 42%)",
  display: "flex",
  flexDirection: "column",
};

function CadConverterStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileId = getCadConverterFileIdFromSearchParams(searchParams);
  const fileIdRef = useRef(fileId);

  const [uploadingMessage, setUploadingMessage] = useState(fileId ? "PENDING" : "");
  const [missingId, setMissingId] = useState(!fileId);
  const [notFound, setNotFound] = useState(false);
  const stopPollingRef = useRef(false);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    fileIdRef.current = fileId;
  }, [fileId]);

  const publishOverlay = useCallback((patch = {}) => {
    const overlay = getConverterLoadingOverlay();
    const next = {
      uploadingMessage: patch.uploadingMessage ?? overlay?.uploadingMessage ?? "PENDING",
      uploadProgressPercent: patch.uploadProgressPercent,
      progressPercent: patch.progressPercent ?? overlay?.progressPercent,
      conversionSteps: patch.conversionSteps ?? overlay?.conversionSteps,
      fileName: patch.fileName ?? overlay?.fileName,
      outputFormat: patch.outputFormat ?? overlay?.outputFormat,
      fileSize: patch.fileSize ?? overlay?.fileSize,
      isSampleFile: patch.isSampleFile ?? overlay?.isSampleFile,
      onCancel: patch.onCancel ?? overlay?.onCancel,
    };
    if (overlay?.open) {
      updateConverterLoadingOverlay(next);
    } else {
      showConverterLoadingOverlay(next);
    }
  }, []);

  const stopPolling = useCallback(() => {
    stopPollingRef.current = true;
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const applyProgressPayload = useCallback((data = {}) => {
    const next = {};
    if (Array.isArray(data.steps) && data.steps.length > 0) {
      next.conversionSteps = data.steps;
    }
    const pct = Number(data.progress_percent);
    if (Number.isFinite(pct) && pct >= 0) {
      next.progressPercent = Math.min(100, Math.max(0, Math.round(pct)));
    }
    if (data.file_name) next.fileName = data.file_name;
    if (data.output_format) next.outputFormat = data.output_format;
    if (data.sample_file != null) next.isSampleFile = Boolean(data.sample_file);
    const size = Number(data.input_file_size_bytes);
    if (Number.isFinite(size) && size > 0) next.fileSize = size;
    return next;
  }, []);

  const handleCancel = useCallback(() => {
    stopPolling();
    hideConverterLoadingOverlay();
    router.push(CONVERTER_TOOL_HREF);
  }, [router, stopPolling]);

  const getStatus = useCallback(async () => {
    const id = fileIdRef.current;
    if (!id || stopPollingRef.current) return;

    try {
      const response = await axios.get(`${BASE_URL}/v1/cad/get-status`, {
        params: { id, cad_type: "CAD_CONVERTER" },
        headers: { "user-uuid": localStorage.getItem("uuid") },
      });

      if (stopPollingRef.current) return;

      if (!response.data?.meta?.success) {
        stopPolling();
        setUploadingMessage("FAILED");
        setNotFound(true);
        hideConverterLoadingOverlay();
        toast.error(response.data?.meta?.message || "Could not load conversion status.");
        return;
      }

      const data = response.data.data || {};
      if (!data.status && !data.folderId) {
        stopPolling();
        setNotFound(true);
        setUploadingMessage("FAILED");
        hideConverterLoadingOverlay();
        return;
      }

      const overlayPatch = applyProgressPayload(data);
      const status = data.status;

      if (status === "COMPLETED") {
        stopPolling();
        sendGAtagEvent({
          event_name: "converter_conversion_success",
          event_category: CAD_CONVERTER_EVENT,
        });
        sendClarityEvent("converter_conversion_success", {
          converter_funnel: "converted",
        });
        setUploadingMessage("COMPLETED");
        hideConverterLoadingOverlay();
        router.replace(DASHBOARD_HREF);
        return;
      }

      if (status === "FAILED") {
        stopPolling();
        sendGAtagEvent({
          event_name: "converter_conversion_failure",
          event_category: CAD_CONVERTER_EVENT,
        });
        sendClarityEvent("converter_conversion_failure", {
          converter_funnel: "failed",
        });
        setUploadingMessage("FAILED");
        hideConverterLoadingOverlay();
        toast.error("Conversion failed. Please try again.");
        return;
      }

      setUploadingMessage(status || "PENDING");
      publishOverlay({
        ...overlayPatch,
        uploadingMessage: status || "PENDING",
        onCancel: handleCancel,
      });
    } catch (error) {
      console.error("Error fetching converter status:", error);
      stopPolling();
      setUploadingMessage("FAILED");
      hideConverterLoadingOverlay();
    }
  }, [applyProgressPayload, handleCancel, publishOverlay, router, stopPolling]);

  const getStatusRef = useRef(getStatus);
  useEffect(() => {
    getStatusRef.current = getStatus;
  }, [getStatus]);

  useLayoutEffect(() => {
    if (!fileId) return;
    const preview = readCadConverterJobPreview(fileId);
    const overlay = getConverterLoadingOverlay();

    publishOverlay({
      uploadingMessage: overlay?.uploadingMessage || "PENDING",
      fileName: overlay?.fileName || preview?.fileName || "",
      outputFormat: overlay?.outputFormat || preview?.outputFormat || "",
      fileSize: overlay?.fileSize || preview?.fileSize || null,
      isSampleFile: overlay?.isSampleFile ?? Boolean(preview?.isSampleFile),
      conversionSteps: overlay?.conversionSteps,
      progressPercent: overlay?.progressPercent,
      onCancel: handleCancel,
    });
    persistConverterLoadingOverlay();
  }, [fileId, handleCancel, publishOverlay]);

  useEffect(() => {
    if (!fileId) {
      setMissingId(true);
      hideConverterLoadingOverlay();
      return;
    }
    setMissingId(false);
    setNotFound(false);
    stopPollingRef.current = false;

    getStatusRef.current();
    pollIntervalRef.current = setInterval(() => {
      getStatusRef.current();
    }, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [fileId]);

  useEffect(() => {
    return () => {
      hideConverterLoadingOverlay();
    };
  }, []);

  if (missingId) {
    return (
      <main
        style={{
          ...PAGE_SHELL,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
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
          ...PAGE_SHELL,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
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

  return <div style={PAGE_SHELL} aria-busy="true" aria-live="polite" />;
}

export default CadConverterStatusPage;
