"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import Loading from "../CommonJsx/Loaders/Loading";
import { getAdminControls, updateAdminControls } from "@/api/converterPaymentApi";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";
import styles from "./AdminControlsPanel.module.css";

function AdminControlsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conversionFree, setConversionFree] = useState(true);
  const [converterPrice, setConverterPrice] = useState("1");

  const pricePreview = useMemo(() => {
    const base = Number(converterPrice);
    if (!Number.isFinite(base) || base < 0) return null;
    return buildConverterPricingDisplay({ base_price: base, price: base });
  }, [converterPrice]);

  const loadControls = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminControls();
      setConversionFree(Boolean(data.conversion_free));
      setConverterPrice(String(data.converter_price ?? 1));
    } catch (err) {
      toast.error(err?.message || "Failed to load admin controls.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadControls();
  }, [loadControls]);

  const handleToggleFree = async (event) => {
    const next = event.target.checked;
    setConversionFree(next);
    setSaving(true);
    try {
      const data = await updateAdminControls({ conversion_free: next });
      setConversionFree(Boolean(data.conversion_free));
      setConverterPrice(String(data.converter_price ?? converterPrice));
      toast.success(next ? "Converter downloads are now free for all users." : "Paid converter downloads enabled.");
    } catch (err) {
      setConversionFree(!next);
      toast.error(err?.message || "Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrice = async (event) => {
    event.preventDefault();
    const price = Number(converterPrice);
    if (!Number.isFinite(price) || price < 0) {
      toast.error("Enter a valid price (0 or greater).");
      return;
    }
    setSaving(true);
    try {
      const data = await updateAdminControls({ converter_price: price });
      setConverterPrice(String(data.converter_price));
      toast.success("Converter price updated.");
    } catch (err) {
      toast.error(err?.message || "Failed to update price.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderWrap}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <p className={styles.lead}>
        Configure CAD converter download pricing. Each user&apos;s first converted file is always free.
        Sample files are always free. From the second conversion onward, these settings apply.
      </p>

      <div className={styles.card}>
        <div className={styles.row}>
          <div>
            <h3 className={styles.rowTitle}>Free converter downloads</h3>
            <p className={styles.rowHint}>
              When enabled, users can download converted files without payment (after their first free file).
            </p>
          </div>
          <Switch
            checked={conversionFree}
            onChange={handleToggleFree}
            disabled={saving}
            color="primary"
            inputProps={{ "aria-label": "Toggle free converter downloads" }}
          />
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.rowTitle}>Converter download base price (USD)</h3>
        <p className={styles.rowHint}>
          Base price before 18% GST. Charged per converted file download when free downloads are disabled.
        </p>
        <form className={styles.priceForm} onSubmit={handleSavePrice}>
          <div className={styles.priceInputWrap}>
            <span className={styles.currency}>$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className={styles.priceInput}
              value={converterPrice}
              onChange={(e) => setConverterPrice(e.target.value)}
              disabled={saving || conversionFree}
            />
          </div>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving || conversionFree}
          >
            Save price
          </button>
        </form>
        {pricePreview && !conversionFree && (
          <div className={styles.priceBreakdown}>
            <p><strong>Price: {pricePreview.totalLabel}</strong></p>
          </div>
        )}
        {conversionFree && (
          <p className={styles.note}>Price is ignored while free downloads are enabled.</p>
        )}
      </div>
    </div>
  );
}

export default AdminControlsPanel;
