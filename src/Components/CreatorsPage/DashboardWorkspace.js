"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowRight, Check, CreditCard, Download, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { BASE_URL, CAD_CONVERTER_EVENT, buildCadConverterOutputUrlCandidates, toCadOutputCdnUrl } from "@/config";
import { contextState } from "../CommonJsx/ContextProvider";
import { sendGAtagEvent } from "@/common.helper";
import { checkConverterDownload, redeemConverterCredit } from "@/api/converterPaymentApi";
import { ensureConverterDownloadAccess, ensureConverterPackPurchase } from "../History/converterPayment";
import ConverterCreditPlansPopup from "../History/ConverterCreditPlansPopup";
import ConverterDownloadFlow from "../History/ConverterDownloadFlow";
import UserLoginPupUp from "../CommonJsx/UserLoginPupUp";
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
} from "@/lib/converterPricing";
import { cadConverterStatusPath } from "@/lib/cadConverterRoutes";
import CadComparisonPopup, { canViewComparison } from "../History/CadComparisonPopup";
import styles from "./DashboardWorkspace.module.css";

function formatLabel(value) {
  const label = String(value || "").replace(/^\./, "").trim();
  return label ? label.toUpperCase() : "CAD";
}

function formatLongDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function cheapestPackLabel(packs) {
  let best = null;
  packs.forEach((pack) => {
    const amount = Number(pack.price_with_gst);
    if (!Number.isFinite(amount) || amount <= 0 || !pack.price_label) return;
    if (!best || amount < best.amount) best = { amount, label: pack.price_label };
  });
  return best?.label || "";
}

async function downloadConvertedFile(file) {
  const candidates = buildCadConverterOutputUrlCandidates(file);
  if (!candidates.length) {
    throw new Error("Download URL is missing for this conversion.");
  }

  let response = null;
  let lastError = null;
  for (const url of candidates) {
    try {
      response = await fetch(url);
      if (response.ok) break;
      lastError = new Error(`HTTP error! status: ${response.status}`);
      response = null;
    } catch (err) {
      lastError = err;
      response = null;
    }
  }
  if (!response?.ok) throw lastError || new Error("Download failed.");

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  const original = file?.file_name || "design";
  const dot = original.lastIndexOf(".");
  const stem = dot > 0 ? original.slice(0, dot) : original;
  a.href = downloadUrl;
  a.download = `${stem}_converted.${file.output_format || "cad"}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
  sendGAtagEvent({
    event_name: "converter_file_upload_download",
    event_category: CAD_CONVERTER_EVENT,
  });
}

function DashboardWorkspace() {
  const { user, setUser } = useContext(contextState);
  const router = useRouter();
  const [credits, setCredits] = useState(Number(user?.converter_credits) || 0);
  const [packs, setPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState("");
  const [latest, setLatest] = useState(null);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showCreditPlans, setShowCreditPlans] = useState(false);
  const [creditIntent, setCreditIntent] = useState("add");
  const [openBilling, setOpenBilling] = useState(false);
  const [pendingPack, setPendingPack] = useState(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    setCredits(Number(user?.converter_credits) || 0);
  }, [user?.converter_credits]);

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        setPacks(getConverterPacksFromInfo(info));
        setSinglePriceLabel(getSinglePriceLabelFromInfo(info));
        if (info?.credits != null) {
          const next = Number(info.credits) || 0;
          setCredits(next);
          setUser((prev) => ({ ...prev, converter_credits: next }));
        }
      })
      .catch(() => {
        if (!cancelled) setPacks([]);
      });
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${BASE_URL}/v1/cad/get-file-history`, {
        params: { type: "CAD_CONVERTER", page: 1, limit: 1 },
        headers: { "user-uuid": localStorage.getItem("uuid") },
      })
      .then((response) => {
        if (cancelled) return;
        const file = response.data?.data?.cad_converter_files?.[0] || null;
        setLatest(file);
      })
      .catch(() => {
        if (!cancelled) setLatest(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingLatest(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const packFrom = cheapestPackLabel(packs);
  const cap = Math.max(10, credits || 0);
  const fill = credits <= 0 ? 0 : Math.min(100, (credits / cap) * 100);
  const inputFmt = formatLabel(latest?.input_format);
  const outputFmt = formatLabel(latest?.output_format);
  const status = String(latest?.status || "").toUpperCase();
  const completed = status === "COMPLETED";
  const failed = status === "FAILED" || status === "ERROR";
  const dateLabel = formatLongDate(latest?.createdAt || latest?.updatedAt);
  const title = !latest
    ? "No conversions yet"
    : completed
      ? `${inputFmt} to ${outputFmt} conversion complete`
      : failed
        ? `${inputFmt} to ${outputFmt} conversion failed`
        : `${inputFmt} to ${outputFmt} conversion in progress`;
  const subtitle = !latest
    ? "Convert a CAD file and the original and result stay here together."
    : completed
      ? `${dateLabel ? `${dateLabel} · ` : ""}original and converted files are saved together`
      : dateLabel || "We’ll keep this file here when it finishes.";

  const applyCredits = (value) => {
    if (value == null) return;
    const next = Number(value) || 0;
    setCredits(next);
    setUser((prev) => ({ ...prev, converter_credits: next }));
  };

  const openAddCredits = () => {
    setCreditIntent("add");
    setShowCreditPlans(true);
  };

  const viewResult = () => {
    if (!latest?._id || !completed) return;
    if (canViewComparison(latest)) {
      setShowComparison(true);
      return;
    }
    router.push(cadConverterStatusPath(latest._id));
  };

  const handleReportDownload = async () => {
    const rawUrl = latest?.report_pdf_url;
    if (!rawUrl) {
      toast.info("Quality report is not available for this conversion.");
      return;
    }
    setDownloadingReport(true);
    try {
      const url = toCadOutputCdnUrl(rawUrl) || rawUrl;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Report download failed.");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const original = latest?.file_name || "conversion";
      const dot = original.lastIndexOf(".");
      const stem = dot > 0 ? original.slice(0, dot) : original;
      a.href = downloadUrl;
      a.download = `${stem}_quality_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      toast.error("Report download failed. Please try again.");
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleDownload = async () => {
    if (!latest?._id) return;
    if (!localStorage.getItem("is_verified")) {
      setNeedsLogin(true);
      return;
    }
    if (!user?.email) {
      router.push("/dashboard?cad_type=USER_PROFILE");
      return;
    }
    if (!completed) {
      router.push(cadConverterStatusPath(latest._id));
      return;
    }

    setDownloading(true);
    try {
      const access = await checkConverterDownload(latest._id);
      applyCredits(access.credits);
      if (access.can_download && access.reason === "credits") {
        const redeemed = await redeemConverterCredit(latest._id);
        applyCredits(redeemed?.credits);
        await downloadConvertedFile(latest);
        return;
      }
      if (access.can_download) {
        await downloadConvertedFile(latest);
        return;
      }
      setCreditIntent("download");
      if (access.pricing) {
        setSinglePriceLabel(access.pricing.total_label || access.pricing.price_label || singlePriceLabel);
      } else if (access.single_price_label) {
        setSinglePriceLabel(access.single_price_label);
      }
      if (Array.isArray(access.packs) && access.packs.length) {
        setPacks(getConverterPacksFromInfo({ packs: access.packs, pricing: access.pricing }));
      }
      setShowCreditPlans(true);
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePackPayment = async (billingId) => {
    if (!pendingPack) throw new Error("No pack selected.");
    const result = await ensureConverterPackPurchase({
      packId: pendingPack.id,
      packName: pendingPack.name,
      userEmail: user?.email,
      billingId,
    });
    applyCredits(result?.credits);
    return result;
  };

  const handleFilePayment = async (billingId) => {
    if (!latest?._id) throw new Error("No conversion is selected.");
    setDownloading(true);
    try {
      const paymentResult = await ensureConverterDownloadAccess({
        converterFileId: latest._id,
        fileName: latest.file_name,
        userEmail: user?.email,
        billingId,
      });
      applyCredits(paymentResult?.credits);
      downloadConvertedFile(latest).catch(() => {
        toast.error("Payment successful. Open the conversion and download again.");
      });
      return paymentResult;
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Your files. One workspace.</p>
          <h1 className={styles.title}>My workspace</h1>
          <p className={styles.subtitle}>
            All your converted files and downloaded CAD designs, easy to find and manage.
          </p>
        </div>
        <Link href="/tools/3d-cad-file-converter" className={styles.primaryBtn}>
          <Plus size={16} />
          New conversion
        </Link>
      </div>

      <div className={styles.cards}>
        <section className={`${styles.card} ${styles.creditsCard}`}>
          <div className={styles.creditsTop}>
            <p className={styles.kicker}>Available credits</p>
            <span className={styles.creditIcon} aria-hidden>
              <CreditCard size={18} />
            </span>
          </div>
          <p className={styles.creditCount}>
            {credits}
            <span>{credits === 1 ? "credit" : "credits"}</span>
          </p>
          <div className={styles.track} aria-hidden>
            <span style={{ width: `${fill}%` }} />
          </div>
          <p className={styles.note}>Credits never expire. Use them for premium downloads.</p>
          <div className={styles.creditActions}>
            <button type="button" className={styles.addBtn} onClick={openAddCredits}>
              <Plus size={16} />
              Add credits
            </button>
            {packFrom ? <span className={styles.packNote}>Packs from {packFrom}</span> : null}
          </div>
        </section>

        <section className={`${styles.card} ${styles.latestCard}`}>
          <span className={styles.checkBox} aria-hidden>
            <Check size={20} />
          </span>
          <div className={styles.latestBody}>
            <div className={styles.latestMeta}>
              <span className={styles.latestKicker}>Latest conversion</span>
              {!loadingLatest && latest ? (
                <span
                  className={`${styles.pill} ${
                    completed ? styles.pillReady : failed ? styles.pillFailed : styles.pillBusy
                  }`}
                >
                  <i />
                  {completed ? "Ready" : failed ? "Failed" : "Working"}
                </span>
              ) : null}
            </div>
            <h2 className={styles.latestTitle}>{loadingLatest ? "Loading your latest conversion" : title}</h2>
            <p className={styles.latestSub}>{loadingLatest ? "Checking saved files." : subtitle}</p>
          </div>
          {latest ? (
            <div className={styles.latestActions}>
              {completed ? (
                <button type="button" className={styles.ghostBtn} onClick={viewResult}>
                  View result
                  <ArrowRight size={16} />
                </button>
              ) : null}
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={handleDownload}
                disabled={downloading}
              >
                <Download size={16} />
                {downloading ? "Downloading..." : completed ? `Download ${outputFmt}` : "View status"}
              </button>
            </div>
          ) : null}
        </section>
      </div>

      {needsLogin ? <UserLoginPupUp onClose={() => setNeedsLogin(false)} type="dashboard" /> : null}
      {showCreditPlans ? (
        <ConverterCreditPlansPopup
          packs={packs}
          singlePriceLabel={singlePriceLabel}
          title="Pay as you go, cheaper by the pack"
          subtitle="Files under 5 MB are always free. For everything else, buy credits — 1 credit downloads any file, any size, and credits never expire."
          onClose={() => setShowCreditPlans(false)}
          onSelectPack={(pack) => {
            setShowCreditPlans(false);
            setPendingPack(pack);
          }}
          onSelectSingle={() => {
            setShowCreditPlans(false);
            if (creditIntent === "download" && latest?._id) {
              setOpenBilling(true);
              return;
            }
            toast.info("Choose a credit pack to add credits.");
          }}
        />
      ) : null}
      {pendingPack ? (
        <ConverterDownloadFlow
          mode="pack"
          pack={pendingPack}
          user={user}
          onClose={() => setPendingPack(null)}
          onPay={handlePackPayment}
        />
      ) : null}
      {showComparison && latest && canViewComparison(latest) ? (
        <CadComparisonPopup
          file={latest}
          onClose={() => setShowComparison(false)}
          onDownloadPdf={handleReportDownload}
          onDownload={handleDownload}
          downloadingReport={downloadingReport}
          downloading={downloading}
          converterCredits={credits}
        />
      ) : null}
      {openBilling && latest ? (
        <ConverterDownloadFlow
          file={latest}
          pricing={latest.converter_pricing || {}}
          user={user}
          onClose={() => setOpenBilling(false)}
          onPay={handleFilePayment}
          onDownloadAgain={() => downloadConvertedFile(latest)}
        />
      ) : null}
    </div>
  );
}

export default DashboardWorkspace;
