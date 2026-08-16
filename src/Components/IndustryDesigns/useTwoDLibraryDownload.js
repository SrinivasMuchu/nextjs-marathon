"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import BillingAddress from "@/Components/CommonJsx/BillingAddress";
import { checkTwoDLibraryDownload } from "@/api/twoDLibraryPaymentApi";
import { openTwoDLibraryPayment } from "@/lib/techDraw/twoDLibraryPayment";

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
}) {
  return (
    <>
      {openLogin ? <UserLoginPupUp onClose={onCloseLogin} /> : null}
      {openBilling ? (
        <BillingAddress
          onClose={onCloseBilling}
          onSave={onPay}
          cadId={designId}
          designDetails={{ title: designTitle || "2D drawing set" }}
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
    },
  };
}
