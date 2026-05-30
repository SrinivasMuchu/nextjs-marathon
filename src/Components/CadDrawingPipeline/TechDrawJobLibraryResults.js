"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import TwoDTechnicalDrawingPageClient from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPageClient";
import TwoDTechnicalDrawingContentClient from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContentClient";
import { fetchTechDrawBundleFromPrefix } from "@/lib/techDraw/fetchTechDrawBundleFromPrefix";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import { getJobDisplayTitle } from "./pipelineConstants";
import {
  techDrawDesignPath,
  techDrawPipelineStatusPath,
} from "@/lib/techDraw/techDrawJobRoutes";

function mapUserJobToLibraryProps(jobId, job, bundle) {
  const mapped = mapTechDrawBundleToPageProps(jobId, {
    baseUrl: bundle.baseUrl,
    geometryPerSheet: bundle.geometryPerSheet,
    viewSelectionResponse: bundle.viewSelectionResponse,
    dimensionSpecs: bundle.dimensionSpecs,
    dimensionsResponse: bundle.dimensionsResponse,
    designMeta: {
      page_title: job?.title || "",
      part_name: job?.file_name || "",
      route: "",
    },
  });

  const title = getJobDisplayTitle(job);

  return {
    ...mapped,
    breadcrumbLinks: [
      // { label: "Drawing pipeline", href: "/tools/cad-drawing-pipeline" },
      {
        label: title,
        href: techDrawPipelineStatusPath(jobId),
      },
      {
        label: "2D Technical Drawings",
        href: techDrawDesignPath(jobId),
      },
    ],
    heroProps: {
      ...mapped.heroProps,
      title: `${title} — 2D Technical Drawing Set (2D CAD drawings)`,
      showFreeDownloadBadge: false,
    },
    // cadModelHref: "/tools/cad-drawing-pipeline",
    // generateHref: "/tools/cad-drawing-pipeline",
    cadModelHref: "",
    generateHref: "",
    showDownloadAllPdfs: false,
    showCadModelLink: false,
  };
}

export default function TechDrawJobLibraryResults({ jobId, job }) {
  const [pageProps, setPageProps] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadError("");
      const bundle = await fetchTechDrawBundleFromPrefix(job?.output_s3_prefix);
      if (cancelled) return;
      if (!bundle) {
        setLoadError(
          "Drawing files are not available yet. Refresh in a moment or open the pipeline status view.",
        );
        return;
      }
      setPageProps(mapUserJobToLibraryProps(jobId, job, bundle));
    })();

    return () => {
      cancelled = true;
    };
  }, [jobId, job]);

  if (loadError) {
    return (
      <div
        style={{
          padding: 24,
          maxWidth: 640,
          margin: "0 auto",
          fontFamily: "system-ui",
        }}
      >
        <p style={{ color: "#b91c1c", marginBottom: 12 }}>{loadError}</p>
        <Link href={techDrawPipelineStatusPath(jobId)} style={{ color: "#5b21b6" }}>
          ← Back to pipeline status
        </Link>
      </div>
    );
  }

  if (!pageProps) {
    return (
      <div
        style={{
          padding: 48,
          textAlign: "center",
          color: "#6b7280",
          fontFamily: "system-ui",
        }}
      >
        Loading drawing set…
      </div>
    );
  }

  const { breadcrumbLinks, heroProps, ...contentProps } = pageProps;

  return (
    <TwoDTechnicalDrawingPageClient breadcrumbLinks={breadcrumbLinks} heroProps={heroProps}>
      <TwoDTechnicalDrawingContentClient {...contentProps} />
    </TwoDTechnicalDrawingPageClient>
  );
}
