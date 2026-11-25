"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";
import CubeLoader from "@/Components/CommonJsx/Loaders/CubeLoader";

const DxfViewer = dynamic(() => import("./DxfViewer"), { ssr: false });

function uuidHeader() {
  let uuid = localStorage.getItem("uuid");
  if (!uuid) {
    uuid = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("uuid", uuid);
  }
  return { "user-uuid": uuid };
}

/**
 * Fetches one expiring signed URL for a completed drawing job and renders it.
 * The parent already owns status polling, so a refresh does not queue another conversion.
 */
export default function DrawingCadView({ fileId, fileName }) {
  const [signedUrl, setSignedUrl] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState(fileName || "");

  useEffect(() => {
    if (!fileId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const signed = await axios.post(
          `${BASE_URL}/v1/cad/drawing-view-url`,
          { id: fileId },
          { headers: uuidHeader() },
        );
        if (cancelled) return;
        if (!signed?.data?.meta?.success || !signed?.data?.data?.url) {
          setError(signed?.data?.meta?.message || "Could not open this drawing.");
          return;
        }
        setSignedUrl(signed.data.data.url);
        if (signed.data.data.file_name) setName(signed.data.data.file_name);
      } catch (requestError) {
        if (!cancelled) setError("Could not open this drawing.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fileId]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
        <div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!signedUrl) return <CubeLoader uploadingMessage="LOADING_VIEWER" />;
  return <DxfViewer url={signedUrl} fileName={name} />;
}
