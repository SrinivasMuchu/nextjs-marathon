"use client";

import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import TwoDTechnicalDrawingContentClient from "./TwoDTechnicalDrawingContentClient";
import ConverterDownloadFlow from "@/Components/History/ConverterDownloadFlow";
import { checkTwoDLibraryDownload, getTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";
import { ensureTwoDLibraryDownloadAccess } from "./twoDLibraryDownloadPayment";
import { contextState } from "@/Components/CommonJsx/ContextProvider";

/**
 * Client wrapper for public 2D library design pages — gates ZIP/PDF/SVG/DXF downloads behind $5.99 payment.
 */
export default function TwoDLibraryDrawingDownloads({
  designId,
  designTitle = "",
  contentProps,
}) {
  const { user } = useContext(contextState);
  const [openDownloadFlow, setOpenDownloadFlow] = useState(false);
  const [downloadPricing, setDownloadPricing] = useState(null);
  const pendingHrefRef = useRef("");
  const prices = useMemo(() => getTechDrawPriceDisplay(), []);

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
      if (!href || !designId) return;

      try {
        const access = await checkTwoDLibraryDownload(designId);
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
    [designId, prices.base, prices.currency, prices.total, triggerBrowserDownload],
  );

  const handleLibraryPayment = useCallback(
    async (billingId) => {
      const href = pendingHrefRef.current;
      const result = await ensureTwoDLibraryDownloadAccess({
        cadFileId: designId,
        designTitle,
        userEmail: user?.email,
        billingId,
      });
      if (href) triggerBrowserDownload(href);
      return result;
    },
    [designId, designTitle, triggerBrowserDownload, user?.email],
  );

  const downloadHandlers = useMemo(() => {
    const wrap = (href) => () => requestDownload(href);
    return {
      onPdf: contentProps.pdfHref ? wrap(contentProps.pdfHref) : undefined,
      onZip: contentProps.zipHref ? wrap(contentProps.zipHref) : undefined,
      onSvg: contentProps.svgHref ? wrap(contentProps.svgHref) : undefined,
      onDxf: contentProps.dxfHref ? wrap(contentProps.dxfHref) : undefined,
      onFreecad: contentProps.freecadHref ? wrap(contentProps.freecadHref) : undefined,
      onSheetDownload: requestDownload,
    };
  }, [contentProps, requestDownload]);

  const converterFile = useMemo(
    () => ({
      file_name: `${designTitle || "2d-drawing"}.zip`,
      input_format: "step",
      output_format: "zip",
    }),
    [designTitle],
  );

  const converterPricing = useMemo(
    () => buildConverterPricingDisplay(downloadPricing),
    [downloadPricing],
  );

  return (
    <>
      <TwoDTechnicalDrawingContentClient {...contentProps} {...downloadHandlers} />

      {openDownloadFlow ? (
        <ConverterDownloadFlow
          file={converterFile}
          pricing={converterPricing}
          user={user}
          onClose={closeDownloadFlow}
          onPay={handleLibraryPayment}
          onDownloadAgain={() => {
            const href = pendingHrefRef.current;
            if (href) triggerBrowserDownload(href);
          }}
        />
      ) : null}
    </>
  );
}
