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

function gstCheckoutNote(base) {
  const n = Number(base);
  if (!Number.isFinite(n) || n < 0) return null;
  return (n * 1.18).toFixed(2);
}

function AdminControlsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conversionFree, setConversionFree] = useState(true);
  const [converterPrice, setConverterPrice] = useState("1.5");
  const [twoDLibraryPrice, setTwoDLibraryPrice] = useState("3.00");
  const [twoDLibraryFree, setTwoDLibraryFree] = useState(false);
  const [twoDLibraryVersionPrice, setTwoDLibraryVersionPrice] = useState("4.99");
  const [twoDLibraryVersionFree, setTwoDLibraryVersionFree] = useState(false);
  const [techdrawUploadPrice, setTechdrawUploadPrice] = useState("4.99");
  const [techdrawUploadFree, setTechdrawUploadFree] = useState(false);
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
    setConverterPrice(String(data.converter_price ?? ""));
    setTwoDLibraryPrice(String(data.two_d_library_price ?? "3.00"));
    setTwoDLibraryFree(Boolean(data.two_d_library_free));
    setTwoDLibraryVersionPrice(String(data.two_d_library_version_price ?? "4.99"));
    setTwoDLibraryVersionFree(Boolean(data.two_d_library_version_free));
    setTechdrawUploadPrice(String(data.techdraw_upload_price ?? "4.99"));
    setTechdrawUploadFree(Boolean(data.techdraw_upload_free));
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

  const handleToggleTwoDLibraryFree = async (event) => {
    const next = event.target.checked;
    setTwoDLibraryFree(next);
    setSaving(true);
    try {
      const data = await updateAdminControls({ two_d_library_free: next });
      applyControls(data);
      toast.success(
        next
          ? "Previous-files 2D library downloads are now free."
          : "Paid previous-files 2D library downloads enabled.",
      );
    } catch (err) {
      setTwoDLibraryFree(!next);
      toast.error(err?.message || "Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTwoDLibraryVersionFree = async (event) => {
    const next = event.target.checked;
    setTwoDLibraryVersionFree(next);
    setSaving(true);
    try {
      const data = await updateAdminControls({ two_d_library_version_free: next });
      applyControls(data);
      toast.success(
        next
          ? "Versioned 2D library downloads are now free."
          : "Paid versioned 2D library downloads enabled.",
      );
    } catch (err) {
      setTwoDLibraryVersionFree(!next);
      toast.error(err?.message || "Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTechdrawUploadFree = async (event) => {
    const next = event.target.checked;
    setTechdrawUploadFree(next);
    setSaving(true);
    try {
      const data = await updateAdminControls({ techdraw_upload_free: next });
      applyControls(data);
      toast.success(
        next
          ? "User TechDraw uploads are now free for all users."
          : "Paid user TechDraw uploads enabled.",
      );
    } catch (err) {
      setTechdrawUploadFree(!next);
      toast.error(err?.message || "Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLibraryPrices = async (event) => {
    event.preventDefault();
    const legacy = Number(twoDLibraryPrice);
    const versioned = Number(twoDLibraryVersionPrice);
    const upload = Number(techdrawUploadPrice);
    if (!Number.isFinite(legacy) || legacy < 0) {
      toast.error("Enter a valid previous-files 2D library price (0 or greater).");
      return;
    }
    if (!Number.isFinite(versioned) || versioned < 0) {
      toast.error("Enter a valid versioned 2D library price (0 or greater).");
      return;
    }
    if (!Number.isFinite(upload) || upload < 0) {
      toast.error("Enter a valid user-upload TechDraw price (0 or greater).");
      return;
    }
    setSaving(true);
    try {
      const data = await updateAdminControls({
        two_d_library_price: legacy,
        two_d_library_free: twoDLibraryFree,
        two_d_library_version_price: versioned,
        two_d_library_version_free: twoDLibraryVersionFree,
        techdraw_upload_price: upload,
        techdraw_upload_free: techdrawUploadFree,
      });
      applyControls(data);
      toast.success("2D library and upload prices updated.");
    } catch (err) {
      toast.error(err?.message || "Failed to update prices.");
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

  const legacyCheckout = gstCheckoutNote(twoDLibraryPrice);
  const versionCheckout = gstCheckoutNote(twoDLibraryVersionPrice);
  const uploadCheckout = gstCheckoutNote(techdrawUploadPrice);

  return (
    <div className={styles.panel}>
      <p className={styles.lead}>
        Configure CAD converter, 2D library downloads (previous vs versioned), and user TechDraw
        upload pricing. Converter files under 5 MB and sample files stay free.
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
        <h3 className={styles.rowTitle}>2D library &amp; user upload prices (USD base)</h3>
        <p className={styles.rowHint}>
          Enter base prices only. Checkout adds 18% GST. Versioned designs
          (`version: true` / techdraw-v2) use the versioned price; previous files use the legacy price.
        </p>
        <form className={styles.libraryPriceForm} onSubmit={handleSaveLibraryPrices}>
          <div className={styles.libraryPriceRow}>
            <div className={styles.libraryPriceRowHeader}>
              <div>
                <p className={styles.libraryPriceRowTitle}>Previous files download (non-versioned)</p>
                <p className={styles.libraryPriceRowHint}>
                  {twoDLibraryFree
                    ? "Free — users download without payment."
                    : "Paid — base price before 18% GST at checkout."}
                </p>
              </div>
              <Switch
                checked={twoDLibraryFree}
                onChange={handleToggleTwoDLibraryFree}
                disabled={saving}
                color="primary"
                inputProps={{ "aria-label": "Toggle free previous-files 2D library downloads" }}
              />
            </div>
            <label className={styles.packField}>
              Base price (USD)
              <div className={styles.priceInputWrap}>
                <span className={styles.currency}>$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.priceInput}
                  value={twoDLibraryPrice}
                  onChange={(e) => setTwoDLibraryPrice(e.target.value)}
                  disabled={saving || twoDLibraryFree}
                />
              </div>
            </label>
            {twoDLibraryFree ? (
              <p className={styles.note}>Price is ignored while free downloads are on.</p>
            ) : legacyCheckout ? (
              <p className={styles.note}>Checkout charges ${legacyCheckout} (incl. GST).</p>
            ) : null}
          </div>

          <div className={styles.libraryPriceRow}>
            <div className={styles.libraryPriceRowHeader}>
              <div>
                <p className={styles.libraryPriceRowTitle}>Versioned files download (techdraw-v2)</p>
                <p className={styles.libraryPriceRowHint}>
                  {twoDLibraryVersionFree
                    ? "Free — users download without payment."
                    : "Paid — base price before 18% GST at checkout."}
                </p>
              </div>
              <Switch
                checked={twoDLibraryVersionFree}
                onChange={handleToggleTwoDLibraryVersionFree}
                disabled={saving}
                color="primary"
                inputProps={{ "aria-label": "Toggle free versioned 2D library downloads" }}
              />
            </div>
            <label className={styles.packField}>
              Base price (USD)
              <div className={styles.priceInputWrap}>
                <span className={styles.currency}>$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.priceInput}
                  value={twoDLibraryVersionPrice}
                  onChange={(e) => setTwoDLibraryVersionPrice(e.target.value)}
                  disabled={saving || twoDLibraryVersionFree}
                />
              </div>
            </label>
            {twoDLibraryVersionFree ? (
              <p className={styles.note}>Price is ignored while free downloads are on.</p>
            ) : versionCheckout ? (
              <p className={styles.note}>Checkout charges ${versionCheckout} (incl. GST).</p>
            ) : null}
          </div>

          <div className={styles.libraryPriceRow}>
            <div className={styles.libraryPriceRowHeader}>
              <div>
                <p className={styles.libraryPriceRowTitle}>User TechDraw upload job</p>
                <p className={styles.libraryPriceRowHint}>
                  {techdrawUploadFree
                    ? "Free — all upload jobs skip payment."
                    : "Paid — first job per org may still be free; later jobs use this price."}
                </p>
              </div>
              <Switch
                checked={techdrawUploadFree}
                onChange={handleToggleTechdrawUploadFree}
                disabled={saving}
                color="primary"
                inputProps={{ "aria-label": "Toggle free user TechDraw uploads" }}
              />
            </div>
            <label className={styles.packField}>
              Base price (USD)
              <div className={styles.priceInputWrap}>
                <span className={styles.currency}>$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={styles.priceInput}
                  value={techdrawUploadPrice}
                  onChange={(e) => setTechdrawUploadPrice(e.target.value)}
                  disabled={saving || techdrawUploadFree}
                />
              </div>
            </label>
            {techdrawUploadFree ? (
              <p className={styles.note}>Price is ignored while free uploads are on.</p>
            ) : uploadCheckout ? (
              <p className={styles.note}>
                Paid uploads charge ${uploadCheckout} (incl. GST). First job may still be free.
              </p>
            ) : null}
          </div>

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            Save 2D &amp; upload prices
          </button>
        </form>
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
