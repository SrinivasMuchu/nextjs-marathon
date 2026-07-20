"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";
import PopupWrapper from "../CommonJsx/PopupWrapper";
import styles from "./ConverterDownloadFlow.module.css";

function getDataList(response) {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function formatAddress(address) {
  if (!address) return "";
  return [
    address.street_address,
    address.appartment_address,
    [address.city, address.state].filter(Boolean).join(", "),
    address.postal_code,
    address.country,
  ].filter(Boolean).join(" · ");
}

function convertedFileName(file) {
  const original = file?.file_name || "converted-file";
  const dot = original.lastIndexOf(".");
  const base = dot > 0 ? original.slice(0, dot) : original;
  return `${base}.${String(file?.output_format || "").toLowerCase()}`;
}

function CloseButton({ onClick }) {
  return (
    <button type="button" className={styles.closeButton} onClick={onClick} aria-label="Close">
      ×
    </button>
  );
}

function FileSummary({ file, priceLabel, compact = false }) {
  const outputFormat = String(file?.output_format || "CAD").toUpperCase();
  return (
    <div className={`${styles.fileSummary} ${compact ? styles.fileSummaryCompact : ""}`}>
      <span className={styles.fileType}>{outputFormat}</span>
      <div className={styles.fileDetails}>
        <strong>{convertedFileName(file)}</strong>
        {!compact && (
          <span>
            {String(file?.input_format || "").toLowerCase()} → {String(file?.output_format || "").toLowerCase()}
            {" · "}converted in {file?.time_taken_seconds ? `${Math.round(file.time_taken_seconds)}s` : "seconds"} · valid ✓
          </span>
        )}
      </div>
      <strong className={styles.price}>{priceLabel}</strong>
    </div>
  );
}

function ConverterDownloadFlow({
  file,
  pricing,
  user,
  onClose,
  onPay,
  onDownloadAgain,
}) {
  const pricingDisplay = useMemo(() => buildConverterPricingDisplay(pricing), [pricing]);
  const [step, setStep] = useState("loading");
  const [addresses, setAddresses] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !paying) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, paying]);

  useEffect(() => {
    let active = true;
    const headers = { "user-uuid": localStorage.getItem("uuid") };

    Promise.allSettled([
      axios.get(`${BASE_URL}/v1/payment/get-billing`, {
        headers,
      }),
      axios.get(`${BASE_URL}/v1/payment/countries`),
    ]).then(([addressResponse, countryResponse]) => {
      if (!active) return;

      const savedAddresses =
        addressResponse.status === "fulfilled" ? getDataList(addressResponse.value) : [];
      const countryOptions =
        countryResponse.status === "fulfilled" ? getDataList(countryResponse.value) : [];

      setAddresses(savedAddresses);
      setCountries(countryOptions);

      if (savedAddresses.length) {
        const saved = savedAddresses[0];
        setSelectedAddress(saved);
        setForm({
          fullName: saved.name || user?.name || "",
          address: [saved.street_address, saved.appartment_address].filter(Boolean).join(", "),
          city: saved.city || "",
          postalCode: saved.postal_code || "",
          country: saved.country || "",
        });
        setStep("review");
      } else {
        setStep("billing");
      }
    });

    return () => {
      active = false;
    };
  }, [user?.name]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const openBillingForm = () => {
    if (selectedAddress) {
      setForm({
        fullName: selectedAddress.name || user?.name || "",
        address: [selectedAddress.street_address, selectedAddress.appartment_address]
          .filter(Boolean)
          .join(", "),
        city: selectedAddress.city || "",
        postalCode: selectedAddress.postal_code || "",
        country: selectedAddress.country || "",
      });
    }
    setError("");
    setStep("billing");
  };

  const saveBillingAddress = async (event) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.address.trim() || !form.city.trim() ||
        !form.postalCode.trim() || !form.country) {
      setError("Please complete all billing address fields.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/payment/create-billing`,
        {
          name: form.fullName.trim(),
          street_address: form.address.trim(),
          appartment_address: "",
          city: form.city.trim(),
          state: selectedAddress?.state || "",
          postal_code: form.postalCode.trim(),
          country: form.country,
          phone: selectedAddress?.phone || "",
          payment_billing_id: selectedAddress?._id || null,
          created_for: "converter",
        },
        { headers: { "user-uuid": localStorage.getItem("uuid") } },
      );

      if (!response?.data?.meta?.success) {
        throw new Error(response?.data?.meta?.message || "Could not save your billing address.");
      }

      const savedData = response.data.data || {};
      const mergedAddress = {
        ...(selectedAddress || {}),
        name: form.fullName.trim(),
        street_address: form.address.trim(),
        appartment_address: "",
        city: form.city.trim(),
        state: selectedAddress?.state || "",
        postal_code: form.postalCode.trim(),
        country: form.country,
        phone: selectedAddress?.phone || "",
        ...savedData,
        _id: savedData._id || selectedAddress?._id,
      };
      setSelectedAddress(mergedAddress);
      setAddresses((current) => [
        mergedAddress,
        ...current.filter((item) => item._id !== mergedAddress._id),
      ]);
      setStep("review");
    } catch (saveError) {
      setError(
        saveError?.response?.data?.message ||
        saveError?.message ||
        "Could not save your billing address.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress?._id) {
      setStep("billing");
      return;
    }

    setPaying(true);
    setError("");
    try {
      const result = await onPay(selectedAddress._id);
      setPaymentResult(result || {});
      setStep("success");
    } catch (paymentError) {
      if (paymentError?.message !== "Payment cancelled") {
        setError(paymentError?.message || "Payment could not be completed. Please try again.");
      }
    } finally {
      setPaying(false);
    }
  };

  const invoice =
    paymentResult?.verification?.invoice ||
    paymentResult?.verification?.invoice_number ||
    paymentResult?.verification?.invoice_id;
  const invoiceUrl =
    paymentResult?.verification?.invoice_url ||
    paymentResult?.verification?.invoiceUrl;

  if (step === "loading") {
    return (
      <PopupWrapper>
        <div className={`${styles.modal} ${styles.loadingModal}`} role="dialog" aria-modal="true">
          <span className={styles.spinner} aria-label="Loading billing details" />
        </div>
      </PopupWrapper>
    );
  }

  if (step === "success") {
    return (
      <PopupWrapper>
        <div className={`${styles.modal} ${styles.successModal}`} role="dialog" aria-modal="true">
          <CloseButton onClick={onClose} />
          <div className={styles.successIcon}>✓</div>
          <h2>Paid — your download started</h2>
          <p>{convertedFileName(file)} is downloading now.</p>
          <p>
            {invoice ? <>Invoice <strong>#{invoice}</strong> was emailed to {user?.email}.</> :
              <>Your invoice was emailed to {user?.email}.</>}
          </p>
          <button type="button" className={styles.primaryButton} onClick={onDownloadAgain}>
            Download again
          </button>
          <div className={styles.successLinks}>
            {invoiceUrl && (
              <a href={invoiceUrl} target="_blank" rel="noreferrer">View invoice</a>
            )}
            <button type="button" onClick={onClose}>Back to dashboard</button>
          </div>
          <small>Re-download free anytime for 7 days from your dashboard.</small>
        </div>
      </PopupWrapper>
    );
  }

  if (step === "billing") {
    return (
      <PopupWrapper>
        <div className={`${styles.modal} ${styles.billingModal}`} role="dialog" aria-modal="true">
          <CloseButton onClick={onClose} />
          <h2>Billing address</h2>
          <p className={styles.subtitle}>Needed once for your tax invoice — we&apos;ll remember it.</p>
          <FileSummary file={file} priceLabel={pricingDisplay.totalLabel} compact />

          <form onSubmit={saveBillingAddress} className={styles.billingForm}>
            <label>
              Full name
              <input
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                autoComplete="name"
                placeholder="Your full name"
              />
              <small>Pre-filled from your account</small>
            </label>
            <label>
              Address
              <input
                name="address"
                value={form.address}
                onChange={updateField}
                autoComplete="street-address"
                placeholder="Street address"
                autoFocus
              />
            </label>
            <div className={styles.billingGrid}>
              <label>
                City
                <input name="city" value={form.city} onChange={updateField} autoComplete="address-level2" />
              </label>
              <label>
                Postal code
                <input name="postalCode" value={form.postalCode} onChange={updateField} autoComplete="postal-code" />
              </label>
              <label>
                Country
                <select name="country" value={form.country} onChange={updateField} autoComplete="country-name">
                  <option value="">Select</option>
                  {countries.map((country) => {
                    const value = country.label || country.name || country.value || country;
                    return <option key={country.value || value} value={value}>{value}</option>;
                  })}
                </select>
              </label>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.primaryButton} disabled={saving}>
              {saving ? "Saving…" : "Save & continue to payment →"}
            </button>
          </form>
          <small className={styles.secureNote}>Saved securely — future checkouts skip this step entirely.</small>
        </div>
      </PopupWrapper>
    );
  }

  return (
    <PopupWrapper>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <CloseButton onClick={onClose} />
        <h2>Download your file</h2>
        <p className={styles.subtitle}>One-time payment · no subscription</p>
        <FileSummary file={file} priceLabel={pricingDisplay.totalLabel} />

        <div className={styles.billingHeading}>
          <span>Billing for your tax invoice</span>
          <button type="button" onClick={openBillingForm}>Change</button>
        </div>
        <div className={styles.selectedAddress}>
          <span>✓</span>
          <p>{selectedAddress?.name} · {formatAddress(selectedAddress)}</p>
        </div>
        <p className={styles.savedNote}>Saved from your last purchase — we&apos;ll reuse it unless you change it.</p>
        {error && <p className={styles.error}>{error}</p>}
        <button type="button" className={styles.primaryButton} onClick={handlePayment} disabled={paying}>
          {paying ? "Opening secure payment…" : `Pay ${pricingDisplay.totalLabel} & download →`}
        </button>
        <div className={styles.paymentTrust}>
          <span>🔒 Secured by<br /><strong>Razorpay</strong></span>
          <span>· Cards, UPI,<br />Netbanking</span>
          <span>· Invoice emailed<br />instantly</span>
        </div>
      </div>
    </PopupWrapper>
  );
}

export default ConverterDownloadFlow;
