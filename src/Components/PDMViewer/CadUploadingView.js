"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import { uploadCadViewerFile } from "@/Components/PDMViewer/cadViewerUploadPipeline";

const CubeLoader = dynamic(() => import("@/Components/CommonJsx/Loaders/CubeLoader"), {
  ssr: false,
});

/**
 * Dedicated upload step: receives `file` from context, uploads to S3 + create-cad,
 * then hard-navigates to cad-renderer with fileId (no reliance on context on viewer route).
 */
export default function CadUploadingView() {
  const { file, setFile } = useContext(contextState);
  const router = useRouter();
  const [uploadingMessage, setUploadingMessage] = useState("");
  const [uploadProgressPercent, setUploadProgressPercent] = useState(null);
  const [, setIsLoading] = useState(true);
  const uploadStartedRef = useRef(false);

  const goBack = useCallback(() => {
    setFile(null);
    router.replace("/tools/3D-cad-viewer");
  }, [setFile, router]);

  useEffect(() => {
    if (!file) {
      const t = setTimeout(() => {
        if (!uploadStartedRef.current) {
          goBack();
        }
      }, 2500);
      return () => clearTimeout(t);
    }

    if (uploadStartedRef.current) return;
    uploadStartedRef.current = true;

    (async () => {
      await uploadCadViewerFile(file, {
        setUploadProgressPercent,
        setUploadingMessage,
        setIsLoading,
        onSuccess: (fileId) => {
          setFile(null);
          window.location.href = `/tools/cad-renderer?fileId=${encodeURIComponent(fileId)}`;
        },
        onFailure: () => {
          setIsLoading(false);
          setUploadProgressPercent(null);
          goBack();
        },
      });
    })();
  }, [file, goBack, setFile]);

  return (
    <CubeLoader
      uploadingMessage={uploadingMessage || "UPLOADINGFILE"}
      uploadProgressPercent={uploadProgressPercent ?? undefined}
    />
  );
}
