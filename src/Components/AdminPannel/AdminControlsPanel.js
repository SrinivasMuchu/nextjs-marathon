"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import Loading from "../CommonJsx/Loaders/Loading";
import { getAdminControls, updateAdminControls } from "@/api/converterPaymentApi";
import { buildConverterPricingDisplay } from "@/lib/converterPricing";
import styles from "./AdminControlsPanel.module.css";

const EMPTY_PACKS = [
  { id: "starter", name: "Starter", credits: "", price: "" },
  { id: "pro", name: "Pro", credits: "", price: "" },
  { id: "team", name: "Team", credits: "", price: "" },
  { id: "studio", name: "Studio", credits: "", price: "" },
];

function AdminControlsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conversionFree, setConversionFree] = useState(true);
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(true);
  const [converterPrice, setConverterPrice] = useState("1.5");
  const [packs, setPacks] = useState(EMPTY_PACKS);

  const pricePreview = useMemo(() => {
    const base = Number(converterPrice);
    if (!Number.isFinite(base) || base < 0 || converterPrice === "") return null;
    return buildConverterPricingDisplay({ base_price: base, price: base });
  }, [converterPrice]);

  const packPreviews = useMemo(
    () =>
      packs.map((pack) => {
        const base = Number(pack.price);
        if (!Number.isFinite(base) || base < 0 || pack.price === "") {
          return { id: pack.id, preview: null };
        }
        return {
          id: pack.id,
          preview: buildConverterPricingDisplay({ base_price: base, price: base }),
        };
      }),
    [packs],
  );

  const applyControls = (data) => {
    setConversionFree(Boolean(data.conversion_free));
    setSubscriptionsEnabled(data.converter_subscriptions !== false);
    setConverterPrice(String(data.converter_price ?? ""));
    if (Array.isArray(data.converter_packs) && data.converter_packs.length) {
      setPacks(
        data.converter_packs.map((pack) => ({
          id: pack.id,
          name: pack.name,
          credits: String(pack.credits ?? ""),
          price: String(pack.price ?? ""),
          description: pack.description || "",
          featured: Boolean(pack.featured),
          save_best: Boolean(pack.save_best),
        })),
      );
    }
  };

  const loadControls = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminControls();
      applyControls(data);
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
      applyControls(data);
      toast.success(next ? "Converter downloads are now free for all users." : "Paid converter downloads enabled.");
    } catch (err) {
      setConversionFree(!next);
      toast.error(err?.message || "Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSubscriptions = async (event) => {
    const next = event.target.checked;
    setSubscriptionsEnabled(next);
    setSaving(true);
    try {
      const data = await updateAdminControls({ converter_subscriptions: next });
      applyControls(data);
      toast.success(
        next
          ? "Credit pack subscriptions are now visible to users."
          : "Credit pack subscriptions hidden. Users pay per file only.",
      );
    } catch (err) {
      setSubscriptionsEnabled(!next);
      toast.error(err?.message || "Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrice = async (event) => {
    event.preventDefault();
    const price = Number(converterPrice);
    if (!Number.isFinite(price) || price < 0) {
      toast.error("Enter a valid single-file price (0 or greater).");
      return;
    }

    const normalizedPacks = packs.map((pack) => ({
      id: pack.id,
      name: pack.name,
      credits: Number(pack.credits),
      price: Number(pack.price),
      description: pack.description,
      featured: pack.featured,
      save_best: pack.save_best,
    }));

    for (const pack of normalizedPacks) {
      if (!Number.isFinite(pack.credits) || pack.credits < 1) {
        toast.error(`${pack.name}: credits must be at least 1.`);
        return;
      }
      if (!Number.isFinite(pack.price) || pack.price < 0) {
        toast.error(`${pack.name}: enter a valid pack price.`);
        return;
      }
    }

    setSaving(true);
    try {
      const data = await updateAdminControls({
        converter_price: price,
        converter_packs: normalizedPacks,
      });
      applyControls(data);
      toast.success("Converter pricing updated.");
    } catch (err) {
      toast.error(err?.message || "Failed to update price.");
    } finally {
      setSaving(false);
    }
  };

  const updatePack = (id, field, value) => {
    setPacks((current) =>
      current.map((pack) => (pack.id === id ? { ...pack, [field]: value } : pack)),
    );
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
        Configure CAD converter download pricing. Files under 5 MB are always free to download.
        Sample files are always free. For larger files, users pay per file — or buy a credit pack
        when subscriptions are enabled.
      </p>

      <div className={styles.card}>
        <div className={styles.row}>
          <div>
            <h3 className={styles.rowTitle}>Free converter downloads</h3>
            <p className={styles.rowHint}>
              When enabled, users can download all converted files without payment.
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
        <div className={styles.row}>
          <div>
            <h3 className={styles.rowTitle}>Credit pack subscriptions</h3>
            <p className={styles.rowHint}>
              When off, the credits pill, pack pricing section, and pack checkout are hidden.
              Users download a single file by paying per conversion, as before.
            </p>
          </div>
          <Switch
            checked={subscriptionsEnabled}
            onChange={handleToggleSubscriptions}
            disabled={saving}
            color="primary"
            inputProps={{ "aria-label": "Toggle converter credit pack subscriptions" }}
          />
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.rowTitle}>Single download base price (USD)</h3>
        <p className={styles.rowHint}>
          Base price before 18% GST. Charged per converted file when the user has no credits.
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
            Save pricing
          </button>
        </form>
        {pricePreview && (
          <div className={styles.priceBreakdown}>
            <p>Base: {pricePreview.baseLabel}</p>
            <p>GST (18%): {pricePreview.gstLabel}</p>
            <p>
              <strong>Customer pays (incl. GST): {pricePreview.totalLabel}</strong>
            </p>
            {conversionFree ? (
              <p className={styles.note}>Shown for reference — ignored while free downloads are on.</p>
            ) : null}
          </div>
        )}
        {conversionFree && !pricePreview && (
          <p className={styles.note}>Price is ignored while free downloads are enabled.</p>
        )}
      </div>

      <div className={styles.card}>
        <h3 className={styles.rowTitle}>Credit pack subscriptions</h3>
        <p className={styles.rowHint}>
          Users can buy these packs any number of times. Credits stack — 3 Starter packs add 9 downloads.
        </p>
        <div className={styles.packGrid}>
          {packs.map((pack) => {
            const packPreview = packPreviews.find((item) => item.id === pack.id)?.preview;
            return (
            <div key={pack.id} className={styles.packCard}>
              <p className={styles.packName}>{pack.name}</p>
              <label className={styles.packField}>
                Credits
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pack.credits}
                  onChange={(e) => updatePack(pack.id, "credits", e.target.value)}
                  disabled={saving || conversionFree}
                />
              </label>
              <label className={styles.packField}>
                Pack base price (USD)
                <div className={styles.priceInputWrap}>
                  <span className={styles.currency}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={styles.priceInput}
                    value={pack.price}
                    onChange={(e) => updatePack(pack.id, "price", e.target.value)}
                    disabled={saving || conversionFree}
                  />
                </div>
              </label>
              {packPreview ? (
                <p className={styles.packGstPreview}>
                  Incl. GST: <strong>{packPreview.totalLabel}</strong>
                  {" · "}GST {packPreview.gstLabel}
                </p>
              ) : null}
            </div>
            );
          })}
        </div>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleSavePrice}
          disabled={saving || conversionFree}
        >
          Save pack prices
        </button>
      </div>
    </div>
  );
}

export default AdminControlsPanel;
