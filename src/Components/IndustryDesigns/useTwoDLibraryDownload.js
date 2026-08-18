"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import BillingAddress from "@/Components/CommonJsx/BillingAddress";
import { checkTwoDLibraryDownload } from "@/api/twoDLibraryPaymentApi";
import { openTwoDLibraryPayment } from "@/lib/techDraw/twoDLibraryPayment";

function pricingFromAccess(access) {
  const taxable = Number(access?.taxable);
  const gstAmount = Number(access?.gst_amount);
  const total = Number(access?.price);
  if (!Number.isFinite(taxable) || taxable < 0) return null;
  return {
    base_price: taxable,
    gst_rate: Number(access?.gst_rate) || 0.18,
    gst_amount: Number.isFinite(gstAmount) ? gstAmount : Math.round(taxable * 0.18 * 100) / 100,
    total: Number.isFinite(total) ? total : Math.round(taxable * 1.18 * 100) / 100,
    currency: access?.currency || "USD",
  };
}

function filenameFromDisposition(header, fallback) {
  const match = String(header || "").match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
}

async function downloadUrlAsFile(url, fallbackName) {
  const uuid = typeof window !== "undefined" ? localStorage.getItem("uuid") : "";
  const res = await fetch(url, {
    headers: uuid ? { "user-uuid": uuid } : {},
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.error || "Download failed.");
  }
  const blob = await res.blob();
  const name = filenameFromDisposition(res.headers.get("content-disposition"), fallbackName);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export function TwoDLibraryPaywallModals({
  designId,
  designTitle,
  openLogin,
  openBilling,
  onCloseLogin,
  onCloseBilling,
  onPay,
  pricing,
}) {
  return (
    <>
      {openLogin ? <UserLoginPupUp onClose={onCloseLogin} /> : null}
      {openBilling ? (
        <BillingAddress
          onClose={onCloseBilling}
          onSave={onPay}
          cadId={designId}
          designDetails={{
            title: designTitle || "2D drawing set",
            description: "2D technical drawing download",
          }}
          productDetails={{
            title: designTitle || "2D drawing set",
            description: "2D technical drawing download",
            pricing: pricing || {
              base_price: 3,
              gst_rate: 0.18,
              gst_amount: 0.54,
              total: 3.54,
              currency: "USD",
            },
          }}
          createdFor="design_billing"
        />
      ) : null}
    </>
  );
}

export function useTwoDLibraryDownload({ designId, designTitle, enabled }) {
  const [busy, setBusy] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openBilling, setOpenBilling] = useState(false);
  const [pendingHref, setPendingHref] = useState("");
  const [pendingName, setPendingName] = useState("drawing-set.zip");
  const [pricing, setPricing] = useState(null);

  const startDownload = useCallback(async (href, filename) => {
    if (!href) return;
    setBusy(true);
    try {
      await downloadUrlAsFile(href, filename);
    } catch (err) {
      toast.error(err?.message || "Download failed.");
    } finally {
      setBusy(false);
    }
  }, []);

  const requestDownload = useCallback(
    async (href, filename = "drawing-set.zip") => {
      if (!href) return;
      if (!enabled) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      if (!designId) return;

      setBusy(true);
      try {
        const access = await checkTwoDLibraryDownload(designId);
        const nextPricing = pricingFromAccess(access);
        if (nextPricing) setPricing(nextPricing);
        if (access?.can_download) {
          await startDownload(href, filename);
          return;
        }
        if (!localStorage.getItem("is_verified")) {
          setPendingHref(href);
          setPendingName(filename);
          setOpenLogin(true);
          return;
        }
        setPendingHref(href);
        setPendingName(filename);
        setOpenBilling(true);
      } catch (err) {
        toast.error(err?.message || "Could not start download.");
      } finally {
        setBusy(false);
      }
    },
    [designId, enabled, startDownload],
  );

  const handlePay = useCallback(
    async (cadId, billingId) => {
      setBusy(true);
      try {
        await openTwoDLibraryPayment({
          cadFileId: cadId || designId,
          billingId,
          description: designTitle || "2D drawing set",
        });
        toast.success("Payment successful. Starting download...");
        await startDownload(pendingHref, pendingName);
      } catch (err) {
        if (String(err?.message || "") !== "Payment cancelled") {
          toast.error(err?.message || "Payment failed.");
        }
      } finally {
        setBusy(false);
      }
    },
    [designId, designTitle, pendingHref, pendingName, startDownload],
  );

  return {
    busy,
    requestDownload,
    paywall: {
      designId,
      designTitle,
      openLogin,
      openBilling,
      onCloseLogin: () => setOpenLogin(false),
      onCloseBilling: () => setOpenBilling(false),
      onPay: handlePay,
      pricing,
    },
  };
}
