'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import UserLoginPupUp from '@/Components/CommonJsx/UserLoginPupUp';
import useConverterPriceDisplay from '@/Components/HomePages/shared/useConverterPriceDisplay';
import useTechDrawPriceDisplay from '@/Components/CadDrawingPipeline/useTechDrawPriceDisplay';
import { fetchLibraryConversionStats } from '@/api/libraryConversionStatsApi';
import { startLibraryFormatConversion } from '@/api/librarySourceApi';
import {
  getDesignConversionSocialProofRows,
  getLibraryCardConvertTargets,
  withLibrarySource,
} from '@/data/libraryPage';
import styles from './DesignConversionSocialProof.module.css';

function normalizeToLabel(value) {
  return String(value || '')
    .toUpperCase()
    .trim()
    .replace(/^\./, '');
}

/**
 * Prefer API chart_routes (top 2 converts + STEP → 2D PDF on any design page).
 * Headline total = all converter jobs + all techdraw jobs (last 30 days).
 */
function buildChartFromStats({ fileType, designId, stats }) {
  const fromKey = String(fileType || 'step').toLowerCase().replace(/^\./, '');
  const fromLabel = String(stats?.from_format || fromKey || 'STEP')
    .replace(/^\./, '')
    .toUpperCase();

  const totalConversions = Math.max(
    0,
    Number(stats?.total_conversions) ||
      (Number(stats?.converter_conversions) || 0) +
        (Number(stats?.drawing_conversions) || 0),
  );

  const chartFromApi = Array.isArray(stats?.chart_routes) ? stats.chart_routes : [];
  if (chartFromApi.length) {
    const rows = chartFromApi.map((route) => {
      const toLabel = normalizeToLabel(route.to);
      const kind = route.kind === 'drawing' || toLabel === '2D PDF' ? 'drawing' : 'convert';
      const href =
        kind === 'drawing'
          ? withLibrarySource(
              route.href || '/tools/cad-drawing-pipeline',
              designId,
            )
          : route.href ||
            `/tools/convert-${fromKey}-to-${toLabel.toLowerCase()}`;
      return {
        id: `${kind}-${toLabel.toLowerCase().replace(/\s+/g, '-')}`,
        fromLabel:
          kind === 'drawing'
            ? 'STEP'
            : normalizeToLabel(route.from) || fromLabel,
        toLabel,
        href,
        kind,
        count: Number(route.count) || 0,
        percent: Math.max(1, Number(route.percent) || 1),
      };
    });
    return { rows, totalConversions };
  }

  // Fallback: top 2 library convert targets + STEP → 2D PDF.
  const convertTargets = getLibraryCardConvertTargets(fileType, designId).slice(0, 2);
  const routes = Array.isArray(stats?.routes) ? stats.routes : [];
  const countByTo = new Map();
  routes.forEach((route) => {
    const to = normalizeToLabel(route.to);
    if (!to) return;
    countByTo.set(to, Math.max(countByTo.get(to) || 0, Number(route.count) || 0));
  });

  const chartSeed = convertTargets.map((target) => {
    const toLabel = normalizeToLabel(target.label);
    return {
      id: `convert-${toLabel.toLowerCase()}`,
      fromLabel,
      toLabel,
      href: target.href,
      kind: 'convert',
      count: countByTo.get(toLabel) || 0,
    };
  });

  chartSeed.push({
    id: 'drawing-pdf',
    fromLabel: 'STEP',
    toLabel: '2D PDF',
    href: withLibrarySource('/tools/cad-drawing-pipeline', designId),
    kind: 'drawing',
    count:
      countByTo.get('2D PDF') || Number(stats?.drawing_conversions) || 0,
  });

  if (!chartSeed.length) return { rows: [], totalConversions };

  const denom = chartSeed.reduce((sum, row) => sum + row.count, 0);
  const rows = chartSeed.map((row) => ({
    ...row,
    percent:
      denom > 0
        ? Math.max(1, Math.round((row.count / denom) * 100))
        : Math.round(100 / chartSeed.length),
  }));

  if (rows.length && denom > 0) {
    const sum = rows.reduce((acc, row) => acc + row.percent, 0);
    const drift = 100 - sum;
    if (drift !== 0) {
      rows[0].percent = Math.max(1, rows[0].percent + drift);
    }
  }

  return { rows, totalConversions };
}

/**
 * Social-proof / promotion route picker.
 * Total = all format conversions + all TechDraw jobs (last 30 days, all users).
 * Graph = highest 2 convert routes + STEP → 2D PDF (ok on any format design page).
 */
export default function DesignConversionSocialProof({ designData }) {
  const router = useRouter();
  const fileType = designData?.file_type || 'step';
  const designId = designData?._id;
  const [stats, setStats] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [apiOk, setApiOk] = useState(false);
  const [startingId, setStartingId] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setApiOk(false);
    fetchLibraryConversionStats({ fileType, include2dPdf: true })
      .then((data) => {
        if (!cancelled) {
          setStats(data);
          setApiOk(true);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStats(null);
          setApiOk(false);
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fileType]);

  const fallback = useMemo(
    () =>
      getDesignConversionSocialProofRows({
        fileType,
        designId,
        downloads: designData?.total_design_downloads,
        include2dPdf: true,
        maxConvertRows: 2,
      }),
    [fileType, designId, designData?.total_design_downloads],
  );

  const { rows, totalConversions } = useMemo(() => {
    if (!loaded) return { rows: [], totalConversions: 0 };
    if (apiOk && stats) {
      const built = buildChartFromStats({ fileType, designId, stats });
      if (built.rows.length) return built;
    }
    return fallback;
  }, [loaded, apiOk, stats, fileType, designId, fallback]);

  const { priceLabel: converterPrice } = useConverterPriceDisplay('$2.99');
  const { totalLabel: drawingPrice } = useTechDrawPriceDisplay();
  const converterLabel = converterPrice || '$2.99';
  const drawingLabel = drawingPrice || '$4.99';

  const handleConvertRow = async (row) => {
    if (row.kind === 'drawing') {
      if (row.href) router.push(row.href);
      return;
    }
    if (!designId) return;
    if (typeof window !== 'undefined' && !window.localStorage.getItem('is_verified')) {
      setShowLogin(true);
      return;
    }
    const outputFormat = String(row.toLabel || '')
      .toLowerCase()
      .replace(/^\./, '');
    setStartingId(row.id);
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
      setStartingId('');
    }
  };

  if (!loaded) {
    return (
      <section className={styles.section} aria-busy="true">
        <div className={styles.header}>
          <h2 className={styles.title}>What people convert this model to</h2>
          <p className={styles.meta}>Loading conversion stats…</p>
        </div>
      </section>
    );
  }

  if (!rows.length) return null;

  const totalLabel = Number(totalConversions).toLocaleString('en-US');

  return (
    <section className={styles.section} aria-labelledby="design-conversion-social-heading">
      <div className={styles.header}>
        <h2 id="design-conversion-social-heading" className={styles.title}>
          What people convert this model to
        </h2>
        <p className={styles.meta}>Last 30 days · {totalLabel} conversions</p>
      </div>

      <ul className={styles.list}>
        {rows.map((row) => {
          const price = row.kind === 'drawing' ? drawingLabel : converterLabel;
          const busy = startingId === row.id;
          return (
            <li key={row.id} className={styles.row}>
              <span className={styles.route}>
                {row.fromLabel} → {row.toLabel}
              </span>
              <div className={styles.barTrack} aria-hidden>
                <span
                  className={styles.barFill}
                  style={{ width: `${Math.max(4, row.percent)}%` }}
                />
              </div>
              <span className={styles.percent}>{row.percent}%</span>
              {row.kind === 'drawing' ? (
                <Link
                  href={row.href || '/tools/cad-drawing-pipeline'}
                  className={styles.priceLink}
                >
                  {price} →
                </Link>
              ) : (
                <button
                  type="button"
                  className={styles.priceLink}
                  onClick={() => handleConvertRow(row)}
                  disabled={Boolean(startingId)}
                >
                  {busy ? 'Starting…' : `${price} →`}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {showLogin ? <UserLoginPupUp onClose={() => setShowLogin(false)} /> : null}
    </section>
  );
}
