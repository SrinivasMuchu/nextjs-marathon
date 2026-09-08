'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check } from 'lucide-react';
import UserLoginPupUp from '@/Components/CommonJsx/UserLoginPupUp';
import useConverterPriceDisplay from '@/Components/HomePages/shared/useConverterPriceDisplay';
import { getPreferredDesignConvertTarget } from '@/data/libraryPage';
import { startLibraryFormatConversion } from '@/api/librarySourceApi';
import styles from './DesignPostDownloadBanner.module.css';

function buildFilename(title, fileType) {
  const ext = String(fileType || 'step').replace(/^\./, '').toLowerCase();
  const base = String(title || 'model')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `${base || 'model'}.${ext}`;
}

function bannerHint(fileType, targetLabel) {
  const from = String(fileType || 'step').toLowerCase();
  const to = String(targetLabel || 'STL').toUpperCase();
  if (from === 'step' || from === 'stp' || from === 'iges' || from === 'igs') {
    return `Slicers and printers need a mesh — convert to ${to} in about 20 seconds.`;
  }
  if (from === 'stl') {
    return `Need editable CAD? Convert to ${to} in about 20 seconds.`;
  }
  if (from === 'dwg' || from === 'dxf') {
    return `Need the other 2D CAD format? Convert to ${to} in seconds.`;
  }
  return `Convert to ${to} in about 20 seconds — no install required.`;
}

/**
 * Green follow-up banner after a successful free native download (mock section 5).
 */
export default function DesignPostDownloadBanner({
  designTitle,
  fileType,
  designId,
  onDismiss,
}) {
  const router = useRouter();
  const preferred = getPreferredDesignConvertTarget(fileType, designId);
  const { priceLabel } = useConverterPriceDisplay('$2.99');
  const price = priceLabel || '$2.99';
  const targetLabel = preferred?.label || 'STL';
  const outputFormat = String(targetLabel).toLowerCase().replace(/^\./, '');
  const filename = buildFilename(designTitle, fileType);
  const [starting, setStarting] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  if (!preferred || !designId) return null;

  const handleConvert = async () => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem('is_verified')) {
      setShowLogin(true);
      return;
    }
    setStarting(true);
    try {
      const result = await startLibraryFormatConversion({
        designId,
        outputFormat,
      });
      router.push(result.statusPath);
    } catch (err) {
      if (err?.code === 'AUTH_REQUIRED') setShowLogin(true);
      else toast.error(err?.message || 'Could not start conversion.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <aside className={styles.banner} role="status" aria-live="polite">
      <div className={styles.iconWrap} aria-hidden>
        <Check size={18} strokeWidth={2.5} />
      </div>
      <div className={styles.copy}>
        <p className={styles.title}>{filename} downloaded</p>
        <p className={styles.subtitle}>{bannerHint(fileType, targetLabel)}</p>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cta}
          onClick={handleConvert}
          disabled={starting}
        >
          {starting ? 'Starting…' : `Convert to ${targetLabel} — ${price}`}
        </button>
        <button type="button" className={styles.later} onClick={onDismiss}>
          Not now
        </button>
      </div>
      {showLogin ? <UserLoginPupUp onClose={() => setShowLogin(false)} /> : null}
    </aside>
  );
}
