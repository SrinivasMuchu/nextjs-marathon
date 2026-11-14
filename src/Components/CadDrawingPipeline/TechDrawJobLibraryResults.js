"use client";

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import TwoDTechnicalDrawingPageClient from "@/Components/IndustryDesigns/TwoDTechnicalDrawingPageClient";
import TwoDTechnicalDrawingContentClient from "@/Components/IndustryDesigns/TwoDTechnicalDrawingContentClient";
import ConverterDownloadFlow from "@/Components/History/ConverterDownloadFlow";
import ConverterCreditPlansPopup from "@/Components/History/ConverterCreditPlansPopup";
import { ensureConverterPackPurchase } from "@/Components/History/converterPayment";
import { getConverterPricingInfo } from "@/api/converterPaymentApi";
import TechDrawCreditCheckout from "./TechDrawCreditCheckout";
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
import {
  ensureTechDrawDownloadAccess,
  trackTechDrawCreditsEvent,
  unlockTechDrawWithCredits,
} from "./techDrawDownloadPayment";
import { contextState } from "@/Components/CommonJsx/ContextProvider";

function mapUserJobToLibraryProps(jobId, job, bundle, { adminMode, getPipelineStatusPath, getDesignPath } = {}) {
  const mapped = mapTechDrawBundleToPageProps(jobId, {
    baseUrl: bundle.baseUrl,
    outputS3Prefix: bundle.outputS3Prefix,
    geometryPerSheet: bundle.geometryPerSheet,
    viewSelectionResponse: bundle.viewSelectionResponse,
    dimensionSpecs: bundle.dimensionSpecs,
    dimensionSpecsMeta: bundle.dimensionSpecsMeta,
    dimensionRejections: bundle.dimensionRejections,
    dimensionsResponse: bundle.dimensionsResponse,
    availabilityBySheet: bundle.availabilityBySheet,
    gdtScheme: bundle.gdtScheme,
    drawingConfigPy: bundle.drawingConfigPy,
    drawingDetailsJson: bundle.drawingDetailsJson,
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
          { label: "STEP to 2D drawing", href: "/tools/convert-step-to-2d-drawing" },
          { label: title, href: pipelinePath },
          { label: "2D Technical Drawings", href: designPath },
        ],
    heroProps: {
      ...mapped.heroProps,
      title: buildTwoDDrawingHeroTitle(title),
      showFreeDownloadBadge: false,
    },
    cadModelHref: "/tools/convert-step-to-2d-drawing",
    generateHref: "/tools/convert-step-to-2d-drawing",
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
  const { user, setUser } = useContext(contextState);
  const [pageProps, setPageProps] = useState(null);
  const [loadError, setLoadError] = useState("");
  // Checkout step: null | "choose" (credits or pay) | "pay" (card checkout) | "plans" | "pack"
  const [checkoutStep, setCheckoutStep] = useState(null);
  const [downloadPricing, setDownloadPricing] = useState(null);
  const [creditInfo, setCreditInfo] = useState({ cost: 0, credits: 0 });
  const [creditBusy, setCreditBusy] = useState(false);
  const [creditError, setCreditError] = useState("");
  const [creditPacks, setCreditPacks] = useState([]);
  const [pendingPack, setPendingPack] = useState(null);
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

  const triggerBrowserDownload = useCallback(async (href) => {
    if (!href) return;
    const headers = {};
    if (typeof window !== "undefined") {
      const uuid = localStorage.getItem("uuid");
      const adminUuid = localStorage.getItem("admin-uuid");
      if (uuid) headers["user-uuid"] = uuid;
      if (adminMode && adminUuid) headers["admin-uuid"] = adminUuid;
    }
    const res = await fetch(href, { headers });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new Error(payload?.error || "Download failed.");
    }
    const match = String(res.headers.get("content-disposition") || "").match(/filename="?([^"]+)"?/i);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = match?.[1] || "drawing";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }, [adminMode]);

  const closeDownloadFlow = useCallback(() => {
    setCheckoutStep(null);
    pendingHrefRef.current = "";
    setDownloadPricing(null);
    setCreditError("");
    setPendingPack(null);
  }, []);

  const syncCredits = useCallback(
    (credits) => {
      if (credits == null) return;
      const n = Number(credits) || 0;
      setCreditInfo((prev) => ({ ...prev, credits: n }));
      setUser?.((prev) => ({ ...prev, converter_credits: n }));
    },
    [setUser],
  );

  const requestDownload = useCallback(
    async (href) => {
      if (!href) return;
      try {
        if (!adminMode) {
          const access = await checkTechDrawDownload(jobId);
          if (!access.can_download) {
            pendingHrefRef.current = href;
            setDownloadPricing(
              access.pricing || {
                base_price: prices.base,
                price: prices.base,
                price_with_gst: prices.total,
                currency: prices.currency,
              },
            );
            const creditCost = Number(access.credit_cost) || 0;
            setCreditError("");
            if (creditCost > 0) {
              setCreditInfo({ cost: creditCost, credits: Number(access.credits) || 0 });
              syncCredits(access.credits);
              trackTechDrawCreditsEvent("offered", {
                job_id: jobId,
                credit_cost: creditCost,
                credits: access.credits,
                can_use_credits: Boolean(access.can_use_credits),
              });
              setCheckoutStep("choose");
            } else {
              setCheckoutStep("pay");
            }
            return;
          }
        }
        await triggerBrowserDownload(href);
      } catch (err) {
        toast.error(err?.message || "Could not start download.");
      }
    },
    [adminMode, jobId, prices.base, prices.currency, prices.total, syncCredits, triggerBrowserDownload],
  );

  const handleUseCredits = useCallback(async () => {
    setCreditBusy(true);
    setCreditError("");
    try {
      const result = await unlockTechDrawWithCredits({ jobId, expectedCost: creditInfo.cost });
      syncCredits(result.credits);
      if (!result.ok) {
        if (result.credit_cost != null) {
          setCreditInfo((prev) => ({ ...prev, cost: Number(result.credit_cost) || prev.cost }));
        }
        setCreditError(result.message || "Could not use credits.");
        return;
      }
      const href = pendingHrefRef.current;
      closeDownloadFlow();
      if (result.credits_used > 0) {
        toast.success(
          `${result.credits_used} credits used. ${Number(result.credits) || 0} left. Re-downloading this drawing is free.`,
        );
      }
      if (href) await triggerBrowserDownload(href);
    } catch (err) {
      setCreditError(err?.message || "Could not use credits.");
    } finally {
      setCreditBusy(false);
    }
  }, [closeDownloadFlow, creditInfo.cost, jobId, syncCredits, triggerBrowserDownload]);

  const handleBuyCredits = useCallback(async () => {
    trackTechDrawCreditsEvent("buy_click", {
      job_id: jobId,
      credit_cost: creditInfo.cost,
      credits: creditInfo.credits,
    });
    setCreditError("");
    try {
      if (!creditPacks.length) {
        const info = await getConverterPricingInfo();
        setCreditPacks(Array.isArray(info?.packs) ? info.packs : []);
      }
      setCheckoutStep("plans");
    } catch (err) {
      setCreditError(err?.message || "Could not load credit packs.");
    }
  }, [creditInfo.cost, creditInfo.credits, creditPacks.length, jobId]);

  const handlePackPayment = useCallback(
    async (billingId) => {
      if (!pendingPack) throw new Error("No pack selected.");
      const result = await ensureConverterPackPurchase({
        packId: pendingPack.id,
        packName: pendingPack.name,
        userEmail: user?.email,
        billingId,
      });
      syncCredits(result?.credits);
      return result;
    },
    [pendingPack, syncCredits, user?.email],
  );

  // After buying (or backing out of) a pack, return to the same drawing's checkout with a fresh balance.
  const returnToCreditChoice = useCallback(async () => {
    setPendingPack(null);
    setCheckoutStep("choose");
    try {
      const access = await checkTechDrawDownload(jobId);
      if (access.can_download) {
        setCheckoutStep(null);
        return;
      }
      if (access.credit_cost != null) {
        setCreditInfo((prev) => ({ ...prev, cost: Number(access.credit_cost) || 0 }));
      }
      syncCredits(access.credits);
    } catch {
      // keep the balance we already have
    }
  }, [jobId, syncCredits]);

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
      if (href) await triggerBrowserDownload(href);
      return result;
    },
    [job?.file_name, job?.title, jobId, triggerBrowserDownload, user?.email],
  );

  // Free first set needs a verified email: after login, re-check and skip checkout if free.
  const handleTechDrawAuthed = useCallback(async () => {
    const access = await checkTechDrawDownload(jobId);
    if (!access.can_download) return false;
    const href = pendingHrefRef.current;
    if (href) await triggerBrowserDownload(href);
    return true;
  }, [jobId, triggerBrowserDownload]);

  const downloadHandlers = useMemo(() => {
    if (!pageProps) return {};
    const wrap = (href) => () => requestDownload(href);
    return {
      onPdf: pageProps.pdfHref ? wrap(pageProps.pdfHref) : undefined,
      onZip: pageProps.zipHref ? wrap(pageProps.zipHref) : undefined,
      onSvg: pageProps.svgHref ? wrap(pageProps.svgHref) : undefined,
      onDxf: pageProps.dxfHref ? wrap(pageProps.dxfHref) : undefined,
      onFreecad: pageProps.freecadHref ? wrap(pageProps.freecadHref) : undefined,
      onSheetDownload: requestDownload,
    };
  }, [pageProps, requestDownload]);

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

      {checkoutStep === "choose" ? (
        <TechDrawCreditCheckout
          title={job?.title || job?.file_name}
          priceLabel={converterPricing.totalLabel}
          creditCost={creditInfo.cost}
          credits={creditInfo.credits}
          busy={creditBusy}
          error={creditError}
          onUseCredits={handleUseCredits}
          onPay={() => setCheckoutStep("pay")}
          onBuyCredits={handleBuyCredits}
          onClose={closeDownloadFlow}
        />
      ) : null}

      {checkoutStep === "plans" ? (
        <ConverterCreditPlansPopup
          packs={creditPacks}
          title="Buy converter credits"
          subtitle={`This drawing uses ${creditInfo.cost} credits. Credits also work for file conversions and never expire.`}
          onClose={() => setCheckoutStep("choose")}
          onSelectPack={(pack) => {
            setPendingPack(pack);
            setCheckoutStep("pack");
          }}
        />
      ) : null}

      {checkoutStep === "pack" && pendingPack ? (
        <ConverterDownloadFlow
          mode="pack"
          pack={pendingPack}
          user={user}
          onClose={returnToCreditChoice}
          onPay={handlePackPayment}
        />
      ) : null}

      {checkoutStep === "pay" ? (
        <ConverterDownloadFlow
          file={converterFile}
          pricing={converterPricing}
          user={user}
          onClose={closeDownloadFlow}
          onPay={handleTechDrawPayment}
          onAuthed={handleTechDrawAuthed}
          onDownloadAgain={() => {
            const href = pendingHrefRef.current;
            if (href) triggerBrowserDownload(href);
          }}
        />
      ) : null}
    </>
  );
}
