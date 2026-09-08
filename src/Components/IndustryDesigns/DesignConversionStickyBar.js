'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import UserLoginPupUp from '@/Components/CommonJsx/UserLoginPupUp';
import useConverterPriceDisplay from '@/Components/HomePages/shared/useConverterPriceDisplay';
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
} from '@/lib/converterPricing';
import {
  getPreferredDesignConvertTarget,
} from '@/data/libraryPage';
import { startLibraryFormatConversion } from '@/api/librarySourceApi';
import { cleanLibraryProductName } from '@/lib/seo/libraryProductDetail';
import styles from './DesignConversionStickyBar.module.css';

const DISMISS_KEY = 'marathon_design_convert_sticky_dismissed_until';
const DISMISS_HOURS = 24;

function readPackPerCreditLabel(packs) {
  const ten = packs.find((pack) => Number(pack.credits) === 10);
  const featured = packs.find((pack) => pack.featured);
  const pick = ten || featured || packs[0];
  if (!pick) return '';
  const match = String(pick.per_credit_label || '').match(/\$[\d.]+/);
  return match ? match[0] : pick.per_credit_label || '';
}

/**
 * Slim sticky convert bar for library 3D design pages (mock section 7).
 */
export default function DesignConversionStickyBar({
  designData,
  preferredFormat = null,
}) {
  const [visible, setVisible] = useState(false);
  const [packPerCredit, setPackPerCredit] = useState('$1.80');
  const [starting, setStarting] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const { priceLabel } = useConverterPriceDisplay('$2.99');
  const singlePrice = priceLabel || '$2.99';

  const fallback = getPreferredDesignConvertTarget(
    designData?.file_type,
    designData?._id,
  );
  const targetLabel =
    preferredFormat?.toLabel ||
    preferredFormat?.label ||
    fallback?.label ||
    'STL';
  const outputFormat = String(targetLabel).toLowerCase().replace(/^\./, '');
  const nativeLabel = String(designData?.file_type || 'STEP')
    .replace(/^\./, '')
    .toUpperCase();
  const title = cleanLibraryProductName(
    designData?.page_title || designData?.part_name || 'This model',
  );

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        const packs = getConverterPacksFromInfo(info);
        const label = readPackPerCreditLabel(packs);
        if (label) setPackPerCredit(label);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleScroll = () => {
      const stored = window.localStorage.getItem(DISMISS_KEY);
      if (stored) {
        const until = parseInt(stored, 10);
        if (!Number.isNaN(until) && until > Date.now()) return;
      }
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      if (docHeight > 0 && scrolled / docHeight >= 0.4) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (typeof window !== 'undefined') {
      const until = Date.now() + DISMISS_HOURS * 60 * 60 * 1000;
      window.localStorage.setItem(DISMISS_KEY, String(until));
    }
  };

  const shortTitle = useMemo(() => {
    if (title.length <= 42) return title;
    return `${title.slice(0, 40)}…`;
  }, [title]);

  if (!visible || !designData?._id || !outputFormat) return null;

  const handleConvert = async () => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem('is_verified')) {
      setShowLogin(true);
      return;
    }
    setStarting(true);
    try {
      const result = await startLibraryFormatConversion({
        designId: designData._id,
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
    <div className={styles.wrapper} role="region" aria-label="Convert this model">
      <div className={styles.bar}>
        <span className={styles.formatBadge} aria-hidden>
          {nativeLabel}
        </span>
        <div className={styles.copy}>
          <p className={styles.title}>
            {shortTitle} — need it as {targetLabel}?
          </p>
          <p className={styles.subtitle}>
            Convert and download in one step — {singlePrice}, or {packPerCredit}{' '}
            with a 10-credit pack.
          </p>
        </div>
        <button
          type="button"
          className={styles.cta}
          onClick={handleConvert}
          disabled={starting}
        >
          {starting ? 'Starting…' : 'Convert this model'}
        </button>
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label="Dismiss convert bar"
        >
          <X size={16} strokeWidth={2.25} aria-hidden />
        </button>
      </div>
      {showLogin ? <UserLoginPupUp onClose={() => setShowLogin(false)} /> : null}
    </div>
  );
}
