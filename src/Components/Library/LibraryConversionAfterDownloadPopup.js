'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import PopupWrapper from '@/Components/CommonJsx/PopupWrapper';
import ConverterDownloadFlow from '@/Components/History/ConverterDownloadFlow';
import { ensureConverterPackPurchase } from '@/Components/History/converterPayment';
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getFeaturedConverterPack,
  getSinglePriceLabelFromInfo,
} from '@/lib/converterPricing';
import { getPreferredDesignConvertTarget } from '@/data/libraryPage';
import { startLibraryFormatConversion } from '@/api/librarySourceApi';
import styles from './LibraryConversionAfterDownloadPopup.module.css';

export const LIBRARY_CONVERSION_POPUP_DISMISS_KEY =
  'marathon_library_conversion_popup_dismissed';

export function shouldShowLibraryConversionPopup() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(LIBRARY_CONVERSION_POPUP_DISMISS_KEY) !== '1';
}

export function dismissLibraryConversionPopupPermanently() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LIBRARY_CONVERSION_POPUP_DISMISS_KEY, '1');
}

function packBadge(pack) {
  if (pack.featured) return { label: 'RECOMMENDED', tone: 'purple' };
  if (pack.save_best) return { label: 'BEST VALUE', tone: 'green' };
  const credits = Number(pack.credits) || 0;
  if (credits > 0 && credits < 10) return { label: 'SMALL PROJECTS', tone: 'purple' };
  return { label: 'CREDIT PACK', tone: 'purple' };
}

function packMetaLine(pack) {
  const credits = Number(pack.credits) || 0;
  if (pack.featured) return `${credits} credits · what most people pick`;
  if (pack.save_best) return `${credits} credits · lowest price per file`;
  if (credits === 5) return `${credits} credits · small projects`;
  return `${credits} credits`;
}

function formatFileTypeBadge(fileType) {
  const label = String(fileType || 'STEP')
    .replace(/^\./, '')
    .toUpperCase();
  return `${label} FILE SAVED`;
}

/**
 * Post-download conversion pricing popup (library design pages).
 */
export default function LibraryConversionAfterDownloadPopup({
  fileType = 'step',
  designId,
  onClose,
  user = null,
  onCreditsUpdated,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [singleLabel, setSingleLabel] = useState('$2.99');
  const [packs, setPacks] = useState([]);
  const [selectedId, setSelectedId] = useState('single');
  const [pendingPack, setPendingPack] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        const nextPacks = getConverterPacksFromInfo(info);
        setPacks(nextPacks);
        setSingleLabel(getSinglePriceLabelFromInfo(info) || '$2.99');
        const featured = getFeaturedConverterPack(nextPacks);
        setSelectedId(featured?.id || 'single');
      })
      .catch(() => {
        if (!cancelled) {
          setPacks([]);
          setSingleLabel('$2.99');
          setSelectedId('single');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(() => {
    const single = {
      id: 'single',
      kind: 'single',
      name: 'One-time download',
      meta: '1 credit · just this file',
      badge: { label: 'DOWNLOAD NOW', tone: 'purple' },
      perCreditLabel: `${singleLabel} each`,
      totalLabel: singleLabel,
      saveLabel: '',
      saveTone: 'purple',
    };
    const packOptions = packs.map((pack) => {
      const badge = packBadge(pack);
      const savePercent = Number(pack.save_percent) || 0;
      return {
        id: pack.id,
        kind: 'pack',
        pack,
        name: pack.name || 'Pack',
        meta: packMetaLine(pack),
        badge,
        perCreditLabel: pack.per_credit_label || '',
        totalLabel: pack.price_label || '',
        saveLabel: savePercent > 0 ? `Save ${savePercent}%` : '',
        saveTone: pack.save_best ? 'green' : 'purple',
      };
    });
    return [single, ...packOptions];
  }, [packs, singleLabel]);

  const selected =
    options.find((option) => option.id === selectedId) || options[0];

  const ctaLabel = (() => {
    if (!selected) return 'Continue';
    if (selected.kind === 'single') return `Convert now @ ${selected.totalLabel}`;
    return `Get ${selected.name} @ ${selected.totalLabel}`;
  })();

  const preferred = getPreferredDesignConvertTarget(fileType, designId);
  const outputFormat = String(preferred?.label || 'STL')
    .toLowerCase()
    .replace(/^\./, '');

  const handleDontShowAgain = () => {
    dismissLibraryConversionPopupPermanently();
    onClose?.();
  };

  const startConvertForSingle = async () => {
    if (!designId) {
      router.push(preferred?.href || '/tools/3d-cad-file-converter');
      onClose?.();
      return;
    }
    setStarting(true);
    try {
      const result = await startLibraryFormatConversion({
        designId,
        outputFormat,
      });
      onClose?.();
      router.push(result.statusPath);
    } catch (err) {
      toast.error(err?.message || 'Could not start conversion.');
    } finally {
      setStarting(false);
    }
  };

  const handlePrimary = async () => {
    if (!selected) return;
    if (selected.kind === 'single') {
      await startConvertForSingle();
      return;
    }
    if (!user?._id && typeof window !== 'undefined' && !localStorage.getItem('is_verified')) {
      toast.info('Log in to buy credits.');
      return;
    }
    setPendingPack(selected.pack);
  };

  return (
    <>
      <PopupWrapper>
        <div className={styles.backdrop} onClick={onClose} role="presentation">
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="library-conversion-pricing-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.header}>
              <div className={styles.headerTop}>
                <span className={styles.savedBadge}>
                  <span aria-hidden>✓</span> {formatFileTypeBadge(fileType)}
                </span>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={16} strokeWidth={2.25} />
                </button>
              </div>
              <h2 id="library-conversion-pricing-title" className={styles.title}>
                Need this model in another format?
              </h2>
              <p className={styles.subtitle}>
                Convert the file you just downloaded to STL, OBJ, DWG or a 2D drawing
                set. No install, up to 300 MB, ready in seconds.
              </p>
            </header>

            <div className={styles.body}>
              {loading ? (
                <p className={styles.loading}>Loading plans…</p>
              ) : (
                <div className={styles.list} role="radiogroup" aria-label="Credit plans">
                  {options.map((option) => {
                    const checked = option.id === selectedId;
                    return (
                      <label
                        key={option.id}
                        className={`${styles.row} ${checked ? styles.rowSelected : ''}`}
                      >
                        <input
                          type="radio"
                          name="library-conversion-plan"
                          value={option.id}
                          checked={checked}
                          onChange={() => setSelectedId(option.id)}
                          className={styles.radioInput}
                        />
                        <span className={styles.radio} aria-hidden />
                        <span className={styles.rowMain}>
                          <span className={styles.rowTitle}>
                            <span className={styles.rowName}>{option.name}</span>
                            {option.badge ? (
                              <span
                                className={`${styles.badge} ${
                                  option.badge.tone === 'green'
                                    ? styles.badgeGreen
                                    : styles.badgePurple
                                }`}
                              >
                                {option.badge.label}
                              </span>
                            ) : null}
                          </span>
                          <span className={styles.rowMeta}>{option.meta}</span>
                        </span>
                        <span className={styles.rowEach}>{option.perCreditLabel}</span>
                        <span className={styles.rowPrice}>
                          <span className={styles.rowTotal}>{option.totalLabel}</span>
                          {option.saveLabel ? (
                            <span
                              className={`${styles.rowSave} ${
                                option.saveTone === 'green'
                                  ? styles.rowSaveGreen
                                  : styles.rowSavePurple
                              }`}
                            >
                              {option.saveLabel}
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.primary}
                  onClick={handlePrimary}
                  disabled={loading || starting}
                >
                  {starting ? 'Starting…' : ctaLabel}
                </button>
                <button type="button" className={styles.later} onClick={onClose}>
                  Maybe later
                </button>
              </div>

              <div className={styles.footer}>
                <p className={styles.footerNote}>
                  Credits never expire · invoice on every purchase · secure checkout
                </p>
                <button
                  type="button"
                  className={styles.dontShow}
                  onClick={handleDontShowAgain}
                >
                  Don&apos;t show this again
                </button>
              </div>
            </div>
          </section>
        </div>
      </PopupWrapper>

      {pendingPack ? (
        <ConverterDownloadFlow
          mode="pack"
          pack={pendingPack}
          user={user}
          onClose={() => setPendingPack(null)}
          onPay={async (billingId) => {
            const result = await ensureConverterPackPurchase({
              packId: pendingPack.id,
              packName: pendingPack.name,
              userEmail: user?.email,
              billingId,
            });
            if (result?.credits != null) {
              onCreditsUpdated?.(Number(result.credits) || 0);
            }
            setPendingPack(null);
            onClose?.();
            return result;
          }}
        />
      ) : null}
    </>
  );
}
