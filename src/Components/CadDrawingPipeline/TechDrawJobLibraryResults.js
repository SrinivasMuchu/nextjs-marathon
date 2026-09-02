"use client";

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import TwoDTechnicalDrawingPageClient from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPageClient";
import TwoDTechnicalDrawingContentClient from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContentClient";
import ConverterDownloadFlow from "@/Components/History/ConverterDownloadFlow";
import { fetchTechDrawBundleForJob } from "@/lib/techDraw/fetchTechDrawBundleFromPrefix";
import { mapTechDrawBundleToPageProps } from "@/lib/techDraw/mapTechDrawBundleToPageProps";
import { buildTwoDDrawingHeroTitle } from "@/lib/techDraw/twoDDrawingPageHelpers";
import { getJobDisplayTitle } from "./pipelineConstants";
import { adminHrefForTab } from "@/Components/AdminPannel/adminTabConfig";
import {
  techDrawDesignPath,
  techDrawPipelineStatusPath,
} from "@/lib/techDraw/techDrawJobRoutes";
import { checkTechDrawDownload, getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";
import { ensureTechDrawDownloadAccess } from "./techDrawDownloadPayment";
import { contextState } from "@/Components/CommonJsx/ContextProvider";

function mapUserJobToLibraryProps(jobId, job, bundle, { adminMode, getPipelineStatusPath, getDesignPath } = {}) {
  const mapped = mapTechDrawBundleToPageProps(jobId, {
    baseUrl: bundle.baseUrl,
    outputS3Prefix: bundle.outputS3Prefix,
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
  const pipelinePath = getPipelineStatusPath?.(jobId) || techDrawPipelineStatusPath(jobId);
  const designPath = getDesignPath?.(jobId) || techDrawDesignPath(jobId);

  return {
    ...mapped,
    breadcrumbLinks: adminMode
      ? [
          { label: "Admin", href: adminHrefForTab("techdraw-jobs") },
          { label: title, href: pipelinePath },
          { label: "2D Technical Drawings", href: designPath },
        ]
      : [
          { label: "Drawing pipeline", href: "/tools/cad-drawing-pipeline" },
          { label: title, href: pipelinePath },
          { label: "2D Technical Drawings", href: designPath },
        ],
    heroProps: {
      ...mapped.heroProps,
      title: buildTwoDDrawingHeroTitle(title),
      showFreeDownloadBadge: false,
    },
    cadModelHref: "/tools/cad-drawing-pipeline",
    generateHref: "/tools/cad-drawing-pipeline",
    showDownloadAllPdfs: false,
    showCadModelLink: false,
  };
}

export default function TechDrawJobLibraryResults({
  jobId,
  job,
  adminMode = false,
  getPipelineStatusPath,
  getDesignPath,
}) {
  const { user } = useContext(contextState);
  const [pageProps, setPageProps] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [openDownloadFlow, setOpenDownloadFlow] = useState(false);
  const [downloadPricing, setDownloadPricing] = useState(null);
  const pendingHrefRef = useRef("");
  const prices = useMemo(() => getTechDrawPriceDisplay(), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadError("");
      const bundle = await fetchTechDrawBundleForJob(jobId, job?.output_s3_prefix);
      if (cancelled) return;
      if (!bundle) {
        setLoadError(
          "Drawing files are not available yet. Refresh in a moment or open the pipeline status view.",
        );
        return;
      }
      setPageProps(
        mapUserJobToLibraryProps(jobId, job, bundle, {
          adminMode,
          getPipelineStatusPath,
          getDesignPath,
        }),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [adminMode, getDesignPath, getPipelineStatusPath, jobId, job]);

  const triggerBrowserDownload = useCallback((href) => {
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
  }, []);

  const closeDownloadFlow = useCallback(() => {
    setOpenDownloadFlow(false);
    pendingHrefRef.current = "";
    setDownloadPricing(null);
  }, []);

  const requestDownload = useCallback(
    async (href) => {
      if (!href) return;
      if (adminMode) {
        triggerBrowserDownload(href);
        return;
      }

      try {
        const access = await checkTechDrawDownload(jobId);
        if (access.can_download) {
          triggerBrowserDownload(href);
          return;
        }

        pendingHrefRef.current = href;
        setDownloadPricing(
          access.pricing || {
            base_price: prices.base,
            price: prices.base,
            price_with_gst: prices.total,
            currency: prices.currency,
          },
        );
        setOpenDownloadFlow(true);
      } catch (err) {
        toast.error(err?.message || "Could not start download checkout.");
      }
    },
    [adminMode, jobId, prices.base, prices.currency, prices.total, triggerBrowserDownload],
  );

  const handleTechDrawPayment = useCallback(
    async (billingId) => {
      const href = pendingHrefRef.current;
      const result = await ensureTechDrawDownloadAccess({
        jobId,
        jobTitle: job?.title,
        fileName: job?.file_name,
        userEmail: user?.email,
        billingId,
      });
      if (href) triggerBrowserDownload(href);
      return result;
    },
    [job?.file_name, job?.title, jobId, triggerBrowserDownload, user?.email],
  );

  const downloadHandlers = useMemo(() => {
    if (adminMode || !pageProps) return {};
    const wrap = (href) => () => requestDownload(href);
    return {
      onPdf: pageProps.pdfHref ? wrap(pageProps.pdfHref) : undefined,
      onZip: pageProps.zipHref ? wrap(pageProps.zipHref) : undefined,
      onSvg: pageProps.svgHref ? wrap(pageProps.svgHref) : undefined,
      onDxf: pageProps.dxfHref ? wrap(pageProps.dxfHref) : undefined,
      onFreecad: pageProps.freecadHref ? wrap(pageProps.freecadHref) : undefined,
      onSheetDownload: requestDownload,
    };
  }, [adminMode, pageProps, requestDownload]);

  const converterFile = useMemo(
    () => ({
      file_name: job?.file_name || `${job?.title || "drawing"}.zip`,
      input_format: "step",
      output_format: "zip",
    }),
    [job?.file_name, job?.title],
  );

  const converterPricing = useMemo(
    () => buildConverterPricingDisplay(downloadPricing),
    [downloadPricing],
  );

  if (loadError) {
    return (
      <div style={{ padding: 24, maxWidth: 640, margin: "0 auto", fontFamily: "system-ui" }}>
        <p style={{ color: "#b91c1c", marginBottom: 12 }}>{loadError}</p>
        <Link href={getPipelineStatusPath?.(jobId) || techDrawPipelineStatusPath(jobId)} style={{ color: "#5b21b6" }}>
          ← Back to pipeline status
        </Link>
      </div>
    );
  }

  if (!pageProps) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#6b7280", fontFamily: "system-ui" }}>
        Loading drawing set…
      </div>
    );
  }

  const { breadcrumbLinks, heroProps, ...contentProps } = pageProps;

  return (
    <>
      <TwoDTechnicalDrawingPageClient breadcrumbLinks={breadcrumbLinks} heroProps={heroProps}>
        <TwoDTechnicalDrawingContentClient {...contentProps} {...downloadHandlers} />
      </TwoDTechnicalDrawingPageClient>

      {openDownloadFlow ? (
        <ConverterDownloadFlow
          file={converterFile}
          pricing={converterPricing}
          user={user}
          onClose={closeDownloadFlow}
          onPay={handleTechDrawPayment}
          onDownloadAgain={() => {
            const href = pendingHrefRef.current;
            if (href) triggerBrowserDownload(href);
          }}
        />
      ) : null}
    </>
  );
}
