'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import DownloadClientButton from '@/Components/CommonJsx/DownloadClientButton';
import UserLoginPupUp from '@/Components/CommonJsx/UserLoginPupUp';
import useConverterPriceDisplay from '@/Components/HomePages/shared/useConverterPriceDisplay';
import useTechDrawPriceDisplay from '@/Components/CadDrawingPipeline/useTechDrawPriceDisplay';
import { startLibraryFormatConversion } from '@/api/librarySourceApi';
import {
  getDesignPageDownloadOptions,
  getDesignPageSoftwareLine,
} from '@/data/libraryPage';
import styles from './DesignDownloadFormatBox.module.css';

function formatSizeLabel(designData) {
  const raw =
    designData?.file_size ??
    designData?.filesize ??
    designData?.file_size_bytes ??
    designData?.size_bytes ??
    designData?.size;
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return null;
  if (num < 10_000) {
    const mb = num < 100 ? num : num / 1024;
    return `${mb.toFixed(mb >= 10 ? 0 : 1).replace(/\.0$/, '')} MB`;
  }
  const mb = num / (1024 * 1024);
  if (mb >= 100) return `${Math.round(mb)} MB`;
  if (mb >= 1) return `${mb.toFixed(1).replace(/\.0$/, '')} MB`;
  return `${Math.round(num / 1024)} KB`;
}

function formatNativePriceLabel(price) {
  const num = Number(price);
  if (!Number.isFinite(num) || num <= 0) return null;
  if (Number.isInteger(num)) return `$${num}`;
  return `$${num.toFixed(2).replace(/\.?0+$/, '')}`;
}

/**
 * Sidebar download box with native + paid format radios (mock section 4).
 */
export default function DesignDownloadFormatBox({
  designData,
  type,
  onDownloadSuccess,
  onPreferredFormatChange,
}) {
  const router = useRouter();
  const fileType = designData?.file_type || 'step';
  const sizeLabel = formatSizeLabel(designData);
  const nativePriceLabel = formatNativePriceLabel(designData?.price);
  const nativeIsFree = !nativePriceLabel;
  const options = useMemo(
    () =>
      getDesignPageDownloadOptions({
        fileType,
        designId: designData?._id,
        include2dPdf: true,
        price: designData?.price,
      }),
    [fileType, designData?._id, designData?.price],
  );

  const [selectedId, setSelectedId] = useState(options[0]?.id || 'native');
  const [startingConvert, setStartingConvert] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { priceLabel: converterPrice } = useConverterPriceDisplay('$2.99');
  const { totalLabel: drawingPrice } = useTechDrawPriceDisplay();
  const converterLabel = converterPrice || '$2.99';
  const drawingLabel = drawingPrice || '$5.99';

  useEffect(() => {
    if (!options.some((option) => option.id === selectedId)) {
      setSelectedId(options[0]?.id || 'native');
    }
  }, [options, selectedId]);

  const selected = options.find((option) => option.id === selectedId) || options[0];
  // Paid designs only offer the native file, so the format picker has nothing to choose from.
  const showFormatChoices = options.length > 1;

  useEffect(() => {
    if (!selected || selected.kind === 'native') {
      const firstConvert = options.find((option) => option.kind === 'convert');
      onPreferredFormatChange?.(firstConvert || null);
      return;
    }
    onPreferredFormatChange?.(selected);
  }, [selected, options, onPreferredFormatChange]);

  const priceBadge = (option) => {
    if (option.kind === 'native') {
      if (nativeIsFree) {
        return <span className={`${styles.badge} ${styles.badgeFree}`}>Free</span>;
      }
      return <span className={styles.badge}>{nativePriceLabel}</span>;
    }
    if (option.kind === 'drawing') {
      return <span className={styles.badge}>{drawingLabel}</span>;
    }
    return <span className={styles.badge}>1 credit · {converterLabel}</span>;
  };

  const detailText = (option) => {
    if (option.kind === 'native') {
      return sizeLabel ? `Native file · ${sizeLabel}` : 'Native file';
    }
    return option.detail;
  };

  const ctaLabel = (() => {
    if (!selected) return 'Download';
    if (selected.kind === 'native') {
      return nativeIsFree
        ? `Download ${selected.label} — free`
        : `Download ${selected.label} — ${nativePriceLabel}`;
    }
    if (selected.kind === 'drawing') {
      return `Get 2D PDF — ${drawingLabel}`;
    }
    return `Convert to ${selected.label} — ${converterLabel}`;
  })();

  const handlePaidCta = async () => {
    if (!selected?.href && selected?.kind !== 'convert') return;

    if (selected.kind === 'drawing') {
      router.push(selected.href);
      return;
    }

    if (selected.kind !== 'convert') return;

    if (typeof window !== 'undefined' && !window.localStorage.getItem('is_verified')) {
      setShowLogin(true);
      return;
    }

    const outputFormat = String(selected.toLabel || selected.label || '')
      .toLowerCase()
      .replace(/^\./, '');
    if (!designData?._id || !outputFormat) {
      toast.error('Could not start conversion.');
      return;
    }

    setStartingConvert(true);
    try {
      const result = await startLibraryFormatConversion({
        designId: designData._id,
        outputFormat,
      });
      router.push(result.statusPath);
    } catch (err) {
      if (err?.code === 'AUTH_REQUIRED') {
        setShowLogin(true);
      } else {
        toast.error(err?.message || 'Could not start conversion.');
      }
    } finally {
      setStartingConvert(false);
    }
  };

  const softwareLine = getDesignPageSoftwareLine(fileType);
  const nativeDownloadLabel =
    type === 'library' ? ctaLabel : undefined;

  return (
    <section className={styles.box} aria-labelledby="download-this-model-heading">
      <p className={styles.eyebrow} id="download-this-model-heading">
        Download this model
      </p>
      <p className={styles.lead}>
        {showFormatChoices
          ? 'Pick the format your software opens. The native file is free.'
          : `Download the native ${selected?.label || fileType.toUpperCase()} file — ${nativePriceLabel}.`}
      </p>

      {showFormatChoices ? (
        <div className={styles.list} role="radiogroup" aria-label="Download format">
          {options.map((option) => {
            const checked = option.id === selectedId;
            return (
              <label
                key={option.id}
                className={`${styles.row} ${checked ? styles.rowSelected : ''}`}
              >
                <input
                  type="radio"
                  name="design-download-format"
                  value={option.id}
                  checked={checked}
                  onChange={() => setSelectedId(option.id)}
                  className={styles.radioInput}
                />
                <span className={styles.radio} aria-hidden />
                <span className={styles.rowMain}>
                  <span className={styles.rowTitle}>
                    <span className={styles.rowLabel}>{option.label}</span>
                    {priceBadge(option)}
                  </span>
                  <span className={styles.rowDetail}>{detailText(option)}</span>
                </span>
              </label>
            );
          })}
        </div>
      ) : null}

      <div className={styles.ctaWrap}>
        {selected?.kind === 'native' ? (
          <DownloadClientButton
            custumDownload={false}
            folderId={designData._id}
            isDownladable={designData.is_downloadable}
            step={true}
            filetype={fileType}
            downloadButtonLabel={nativeDownloadLabel || ctaLabel}
            suppressConversionPopup
            onDownloadSuccess={onDownloadSuccess}
            designDetails={{
              title: designData.page_title,
              description: designData.page_description,
              price: designData.price,
              file_type: fileType,
            }}
          />
        ) : (
          <button
            type="button"
            className={styles.cta}
            onClick={handlePaidCta}
            disabled={startingConvert}
          >
            {startingConvert ? 'Starting conversion…' : ctaLabel}
          </button>
        )}
      </div>

      <p className={styles.footerNote}>
        {showFormatChoices
          ? `${softwareLine} Need a mesh or a drawing? Pick a format above.`
          : softwareLine}
      </p>

      {showLogin ? <UserLoginPupUp onClose={() => setShowLogin(false)} /> : null}
    </section>
  );
}
