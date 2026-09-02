"use client";

import axios from "axios";
import styles from "../IndustryDesigns/IndustryDesign.module.css";
import { sendGAtagEvent } from "@/common.helper";
import React, { useContext, useMemo, useState } from "react";
import { BASE_URL, CAD_VIEWER_EVENT, RAZORPAY_KEY_ID, MARATHONDETAILS } from "@/config";
import Tooltip from "@mui/material/Tooltip";
import UserLoginPupUp from "./UserLoginPupUp";
import { contextState } from "./ContextProvider";
import ConverterDownloadFlow from "@/Components/History/ConverterDownloadFlow";
import SupportingFilesPopup from "./SupportingFilesPopup";
import { toast } from "react-toastify";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function readCheckoutUser(contextUser) {
  if (typeof window === "undefined") {
    return { name: contextUser?.name || "", email: contextUser?.email || "" };
  }
  return {
    name:
      contextUser?.name ||
      localStorage.getItem("name") ||
      localStorage.getItem("full_name") ||
      "",
    email:
      contextUser?.email ||
      localStorage.getItem("email") ||
      localStorage.getItem("user_email") ||
      "",
  };
}

function DownloadClientButton({
  folderId,
  xaxis,
  yaxis,
  isDownladable,
  step,
  filetype,
  custumDownload,
  designDetails,
  supportingFileUrl,
  downloadButtonLabel,
}) {
  const [isDownLoading, setIsDownLoading] = useState(false);
  const [isDownloadingMainFile, setIsDownloadingMainFile] = useState(false);
  const [openEmailPopUp, setOpenEmailPopUp] = useState(false);
  const [openBillingDetails, setOpenBillingDetails] = useState(false);
  const [openSupportingFiles, setOpenSupportingFiles] = useState(false);
  const [supportingFiles, setSupportingFiles] = useState([]);
  const [supportingFilesLoading, setSupportingFilesLoading] = useState(false);
  const { setDownloadedFileUpdate, user } = useContext(contextState);

  const pricing = useMemo(() => {
    const base = Number(designDetails?.price);
    if (!Number.isFinite(base) || base < 0) return null;
    return {
      base_price: base,
      price: base,
      currency: "USD",
    };
  }, [designDetails?.price]);

  const pricingDisplay = useMemo(
    () => buildConverterPricingDisplay(pricing || { base_price: 0 }),
    [pricing],
  );

  const fetchSupportingFiles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/v1/cad/get-supporting-files`, {
        params: { design_id: folderId },
        headers: { "user-uuid": localStorage.getItem("uuid") },
      });
      if (response.data.meta.success) {
        return response.data.data.files;
      }
      return [];
    } catch (err) {
      console.error("Error fetching supporting files:", err);
      return [];
    }
  };

  const downloadMainFile = async () => {
    setIsDownloadingMainFile(true);
    try {
      if (supportingFileUrl) {
        const link = document.createElement("a");
        link.href = supportingFileUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        link.remove();
        sendGAtagEvent({
          event_name: "design_view_file_download",
          event_category: CAD_VIEWER_EVENT,
        });
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/v1/cad/get-signedurl`,
        {
          design_id: folderId,
          xaxis,
          yaxis,
          step,
          file_type: filetype,
          action_type: "DOWNLOAD",
        },
        {
          headers: { "user-uuid": localStorage.getItem("uuid") },
        },
      );
      const data = response.data;
      if (data.meta.success) {
        const url = data.data.download_url;
        setDownloadedFileUpdate(data.data.download_url);
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        link.remove();
        sendGAtagEvent({
          event_name: "design_view_file_download",
          event_category: CAD_VIEWER_EVENT,
        });
      }
    } catch (err) {
      console.error("Error downloading file:", err);
      throw err;
    } finally {
      setIsDownloadingMainFile(false);
    }
  };

  const openSupportingFilesAfterPay = () => {
    if (!custumDownload) return;
    setSupportingFiles([]);
    setSupportingFilesLoading(true);
    setOpenSupportingFiles(true);
    fetchSupportingFiles()
      .then((files) => {
        setSupportingFiles(files);
        setSupportingFilesLoading(false);
      })
      .catch(() => {
        setSupportingFiles([]);
        setSupportingFilesLoading(false);
      });
  };

  /** Converter-style checkout: billingId from ConverterDownloadFlow → Razorpay → download. */
  const handleCheckoutPay = async (billingId) => {
    if (!localStorage.getItem("is_verified")) {
      setOpenEmailPopUp(true);
      throw new Error("Please sign in to continue.");
    }

    const res = await axios.post(
      `${BASE_URL}/v1/payment/create-order`,
      {
        cad_file_id: folderId,
        billing_id: billingId,
      },
      {
        headers: { "user-uuid": localStorage.getItem("uuid") },
      },
    );

    if (res.data.meta.status === "active") {
      await downloadMainFile();
      openSupportingFilesAfterPay();
      return {};
    }

    if (!res.data.meta.success) {
      throw new Error(res.data.meta.message || "Failed to create order.");
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error("Razorpay SDK failed to load.");

    const checkoutUser = readCheckoutUser(user);

    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: res.data.data.amount,
        currency: res.data.data.currency,
        name: MARATHONDETAILS.name,
        image: MARATHONDETAILS.image,
        description: designDetails?.title || "CAD download",
        order_id: res.data.data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${BASE_URL}/v1/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                cad_file_id: folderId,
              },
              {
                headers: { "user-uuid": localStorage.getItem("uuid") },
              },
            );

            if (!verifyRes.data.meta.success) {
              reject(new Error("Payment verification failed."));
              return;
            }

            toast.success("Payment successful! Starting download...");
            await downloadMainFile();
            openSupportingFilesAfterPay();
            resolve({
              verification: verifyRes.data.data || {},
            });
          } catch (err) {
            reject(err);
          }
        },
        prefill: {
          name: res.data.data?.prefill?.name || checkoutUser.name,
          email: res.data.data?.prefill?.email || checkoutUser.email,
          contact: res.data.data?.prefill?.contact || "",
        },
        ...(res.data.data?.notes && Object.keys(res.data.data.notes).length
          ? { notes: res.data.data.notes }
          : {}),
        theme: { color: MARATHONDETAILS.theme },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled")),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handleFreeDownload = async () => {
    setIsDownLoading(true);
    try {
      if (!localStorage.getItem("is_verified")) {
        setOpenEmailPopUp(true);
        return;
      }
      if (custumDownload) {
        setSupportingFiles([]);
        setSupportingFilesLoading(true);
        setOpenSupportingFiles(true);
        fetchSupportingFiles()
          .then((files) => {
            setSupportingFiles(files);
            setSupportingFilesLoading(false);
          })
          .catch(() => {
            setSupportingFiles([]);
            setSupportingFilesLoading(false);
          });
      } else {
        await downloadMainFile();
      }
    } finally {
      setIsDownLoading(false);
    }
  };

  const billingHandler = async () => {
    if (!localStorage.getItem("is_verified")) {
      setOpenEmailPopUp(true);
      return;
    }
    try {
      setIsDownLoading(true);
      const downloadCheck = await axios.post(
        `${BASE_URL}/v1/payment/check-download`,
        { cad_file_id: folderId },
        { headers: { "user-uuid": localStorage.getItem("uuid") } },
      );

      if (downloadCheck.data.meta.success) {
        if (!downloadCheck.data.data.can_download) {
          setOpenBillingDetails(true);
        } else {
          await handleFreeDownload();
        }
      }
    } catch (error) {
      console.error("Error checking download permissions:", error);
      toast.error("Could not start download.");
    } finally {
      setIsDownLoading(false);
    }
  };

  const downloadHandler = isDownladable === false ? undefined : billingHandler;
  const defaultCtaLabel = custumDownload ? "Download 3D design" : "Download";
  const ctaLabel = downloadButtonLabel || defaultCtaLabel;

  return (
    <>
      {custumDownload ? (
        <span
          style={{
            display: "block",
            width: "100%",
            visibility: openSupportingFiles ? "hidden" : "visible",
          }}
          aria-hidden={openSupportingFiles}
        >
          {isDownladable === false ? (
            <Tooltip
              title="This file is view-only downloads are disabled by the creator."
              arrow
              placement="top"
              disableHoverListener={isDownladable}
              disableFocusListener={isDownladable}
              disableTouchListener={isDownladable}
              PopperProps={{
                sx: {
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: "#333",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "6px",
                    borderRadius: "4px",
                  },
                },
              }}
            >
              <span>
                <button
                  disabled
                  className="rounded bg-[#610BEE] h-12"
                  style={{
                    opacity: 0.6,
                    cursor: "not-allowed",
                    color: "white",
                    fontSize: "20px",
                    background: "#610BEE",
                    borderRadius: "4px",
                    height: "48px",
                    padding: "10px 20px",
                    border: "none",
                    minWidth: "fit-content",
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                  }}
                >
                  {ctaLabel}
                </button>
              </span>
            </Tooltip>
          ) : (
            <button
              disabled={isDownLoading}
              style={{
                color: "white",
                fontSize: "20px",
                background: "#610BEE",
                borderRadius: "4px",
                height: "48px",
                padding: "10px 20px",
                border: "none",
                minWidth: "fit-content",
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                cursor: isDownLoading ? "not-allowed" : "pointer",
                opacity: isDownLoading ? 0.7 : 1,
              }}
              className="rounded bg-[#610BEE] h-12"
              onClick={downloadHandler}
            >
              {isDownLoading ? "Processing..." : ctaLabel}
            </button>
          )}
        </span>
      ) : (
        <>
          {isDownladable === false ? (
            <Tooltip
              title="This file is view-only downloads are disabled by the creator."
              arrow
              placement="top"
              disableHoverListener={isDownladable}
              disableFocusListener={isDownladable}
              disableTouchListener={isDownladable}
              PopperProps={{
                sx: {
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: "#333",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "6px",
                    borderRadius: "4px",
                  },
                },
              }}
            >
              <span>
                <button
                  disabled
                  className={styles["industry-design-files-btn"]}
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                >
                  {ctaLabel}
                </button>
              </span>
            </Tooltip>
          ) : (
            <button
              disabled={isDownLoading}
              className={styles["industry-design-files-btn"]}
              onClick={downloadHandler}
            >
              {isDownLoading ? "Processing..." : ctaLabel}
            </button>
          )}
        </>
      )}

      {openBillingDetails ? (
        <ConverterDownloadFlow
          product={{
            badge: String(filetype || designDetails?.file_type || "CAD").toUpperCase(),
            title: designDetails?.title || "CAD download",
            detail: designDetails?.description || "One-time download",
            successDetail: "Your file download has started.",
            pricing: pricing || undefined,
          }}
          pricing={pricing || undefined}
          user={readCheckoutUser(user)}
          createdFor="design_billing"
          heading="Download your CAD file"
          payButtonLabel={
            pricingDisplay.totalLabel
              ? `Pay ${pricingDisplay.totalLabel} & download →`
              : undefined
          }
          successTitle="Paid — your download started"
          successBody="Your CAD file is downloading now."
          onClose={() => setOpenBillingDetails(false)}
          onPay={handleCheckoutPay}
        />
      ) : null}

      {openEmailPopUp ? <UserLoginPupUp onClose={() => setOpenEmailPopUp(false)} /> : null}

      {openSupportingFiles ? (
        <SupportingFilesPopup
          files={supportingFiles.supporting_files}
          cadFilenName={supportingFiles.cad_file_name}
          loading={supportingFilesLoading}
          onClose={() => {
            setOpenSupportingFiles(false);
            setSupportingFiles([]);
            setSupportingFilesLoading(false);
          }}
          onDownloadMainFile={downloadMainFile}
          isDownloadingMainFile={isDownloadingMainFile}
        />
      ) : null}
    </>
  );
}

export default DownloadClientButton;
