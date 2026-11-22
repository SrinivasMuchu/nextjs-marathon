'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import PopupWrapper from '../CommonJsx/PopupWrapper';
import { sendGAtagEvent } from '@/common.helper';
import { CAD_CONVERTER_EVENT } from '@/config';
import { getFeaturedConverterPack } from '@/lib/converterPricing';
import { getFeedbackContext, recordFeedbackJobEvent, submitFeedback } from '@/api/feedbackApi';
import styles from './ConverterCreditPlansPopup.module.css';
import feedbackStyles from '../Feedback/Feedback.module.css';

function planGaParams(option) {
  if (!option) return {};
  if (option.kind === 'single') {
    return {
      payment_type: 'converter_single_download',
      pack_id: 'single',
      pack_name: option.name || 'One-time download',
      price_label: option.totalLabel || '',
      credits: '1',
    };
  }
  const pack = option.pack || {};
  return {
    payment_type: 'converter_pack',
    pack_id: pack.id || option.id || '',
    pack_name: option.name || pack.name || '',
    price_label: option.totalLabel || pack.price_label || '',
    credits: pack.credits != null ? String(pack.credits) : '',
  };
}

function packBadge(pack) {
  if (pack.featured) return { label: 'RECOMMENDED', tone: 'purple' };
  if (pack.save_best) return { label: 'BEST VALUE', tone: 'green' };
  const credits = Number(pack.credits) || 0;
  if (credits > 0 && credits <= 5) return { label: 'SMALL PROJECTS', tone: 'purple' };
  return { label: 'CREDIT PACK', tone: 'purple' };
}

function packMetaLine(pack) {
  const credits = Number(pack.credits) || 0;
  if (pack.featured) return `${credits} credits · what most people pick`;
  if (pack.save_best) return `${credits} credits · lowest price per file`;
  if (credits > 0 && credits <= 5) return `${credits} credits · small projects`;
  return `${credits} credits`;
}

function formatSavedBadge(fileType) {
  if (!fileType) return null;
  const label = String(fileType).replace(/^\./, '').toUpperCase();
  return `${label} FILE SAVED`;
}

/**
 * Converter credit pricing popup — radio-list layout (one-time + packs).
 */
function ConverterCreditPlansPopup({
  packs = [],
  singlePriceLabel = '',
  fileType = '',
  title = 'Need this model in another format?',
  subtitle = 'Convert the file you just downloaded to STL, OBJ, DWG or a 2D drawing set. No install, up to 300 MB, ready in seconds.',
  onClose,
  onSelectPack,
  onSelectSingle,
  onDontShowAgain,
  /** { jobId, jobType } of the file behind this paywall: enables flow 11b's one-tap "why not?" on close. */
  feedbackJob = null,
}) {
  const [askReasons, setAskReasons] = useState(null); // paywall_close_reasons when this user may be asked
  const [asking, setAsking] = useState(false);
  const closedRef = useRef(false);
  const jobId = feedbackJob?.jobId ? String(feedbackJob.jobId) : '';
  const jobType = feedbackJob?.jobType || 'converter';

  useEffect(() => {
    if (!jobId) return undefined;
    let alive = true;
    recordFeedbackJobEvent({ jobId, jobType, event: 'paywall_shown' });
    sendGAtagEvent({ event_name: 'converter_paywall_shown', event_category: 'FEEDBACK' });
    getFeedbackContext(jobId, jobType)
      .then((ctx) => {
        // At most once per user per 30 days, never for samples or already-answered files (server decides).
        if (alive && ctx?.paywall_ask && ctx?.content?.paywall_close_reasons?.length) {
          setAskReasons(ctx.content.paywall_close_reasons);
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [jobId, jobType]);

  const finishClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (jobId) {
      recordFeedbackJobEvent({ jobId, jobType, event: 'paywall_closed' });
      sendGAtagEvent({ event_name: 'converter_paywall_closed', event_category: 'FEEDBACK' });
    }
    onClose?.();
  }, [jobId, jobType, onClose]);

  /** Closing without paying: one tap, then it closes (11b). */
  const requestClose = useCallback(() => {
    if (askReasons && !asking) {
      setAsking(true);
      return;
    }
    finishClose();
  }, [askReasons, asking, finishClose]);

  const answerClose = (reasonId) => {
    submitFeedback({
      job_id: jobId,
      job_type: jobType,
      kind: 'abandoned',
      source: 'paywall_close',
      abandon_reason: reasonId,
    }).catch(() => {});
    sendGAtagEvent({ event_name: 'converter_abandon_reason', event_category: 'FEEDBACK', event_label: `paywall_close:${reasonId}` });
    finishClose();
  };

  const featured = useMemo(() => getFeaturedConverterPack(packs), [packs]);
  const [selectedId, setSelectedId] = useState(() => featured?.id || 'single');

  useEffect(() => {
    if (featured?.id) setSelectedId(featured.id);
  }, [featured?.id]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestClose]);

  const options = useMemo(() => {
    const singleLabel = singlePriceLabel || '$2.99';
    const list = [];
    if (singlePriceLabel || onSelectSingle) {
      list.push({
        id: 'single',
        kind: 'single',
        name: 'One-time download',
        meta: '1 credit · just this file',
        badge: { label: 'DOWNLOAD NOW', tone: 'purple' },
        perCreditLabel: `${singleLabel} each`,
        totalLabel: singleLabel,
        saveLabel: '',
        saveTone: 'purple',
      });
    }
    packs.forEach((pack) => {
      const badge = packBadge(pack);
      const savePercent = Number(pack.save_percent) || 0;
      list.push({
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
      });
    });
    return list;
  }, [packs, singlePriceLabel, onSelectSingle]);

  const selected =
    options.find((option) => option.id === selectedId) || options[0] || null;

  const ctaLabel = (() => {
    if (!selected) return 'Continue';
    if (selected.kind === 'single') return `Convert now @ ${selected.totalLabel}`;
    return `Get ${selected.name} @ ${selected.totalLabel}`;
  })();

  const savedBadge = formatSavedBadge(fileType);

  const trackPlanSelected = (option) => {
    sendGAtagEvent({
      event_name: 'converter_plan_selected',
      event_category: CAD_CONVERTER_EVENT,
      ...planGaParams(option),
    });
  };

  const handlePrimary = () => {
    if (!selected) return;
    sendGAtagEvent({
      event_name: 'converter_plan_checkout_clicked',
      event_category: CAD_CONVERTER_EVENT,
      ...planGaParams(selected),
    });
    if (selected.kind === 'single') {
      onSelectSingle?.();
      return;
    }
    onSelectPack?.(selected.pack);
  };

  const handleDontShow = () => {
    onDontShowAgain?.();
    finishClose();
  };

  return (
    <PopupWrapper>
      <div className={styles.backdrop} onClick={requestClose} role="presentation">
        <section
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="converter-plans-popup-heading"
          onClick={(event) => event.stopPropagation()}
        >
          <header className={styles.header}>
            <div className={styles.headerTop}>
              {savedBadge ? (
                <span className={styles.savedBadge}>
                  <span aria-hidden>✓</span> {savedBadge}
                </span>
              ) : (
                <span className={styles.savedBadge}>Pricing</span>
              )}
              <button
                type="button"
                className={styles.closeBtn}
                onClick={requestClose}
                aria-label="Close plans"
              >
                <X size={16} strokeWidth={2.25} />
              </button>
            </div>
            <h2 id="converter-plans-popup-heading" className={styles.title}>
              {title}
            </h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </header>

          <div className={styles.body}>
            {asking ? (
              <div className={feedbackStyles.form} aria-live="polite">
                <p className={feedbackStyles.label}>Before you go — what stopped you?</p>
                <div className={feedbackStyles.reasonList}>
                  {askReasons.map((r) => (
                    <button key={r.id} type="button" className={feedbackStyles.reason} onClick={() => answerClose(r.id)}>
                      {r.label}
                    </button>
                  ))}
                </div>
                <div className={feedbackStyles.actionsRow}>
                  <button type="button" className={feedbackStyles.secondaryBtn} onClick={finishClose}>Skip</button>
                </div>
              </div>
            ) : null}
            {asking ? null : options.length ? (
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
                        name="converter-credit-plan"
                        value={option.id}
                        checked={checked}
                        onChange={() => {
                          setSelectedId(option.id);
                          trackPlanSelected(option);
                        }}
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
            ) : (
              <p className={styles.loading}>Loading plans…</p>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                onClick={handlePrimary}
                disabled={!selected}
              >
                {ctaLabel}
              </button>
              <button type="button" className={styles.later} onClick={requestClose}>
                Maybe later
              </button>
            </div>

            <div className={styles.footer}>
              <p className={styles.footerNote}>
                Credits never expire · invoice on every purchase · secure checkout
              </p>
              {onDontShowAgain ? (
                <button
                  type="button"
                  className={styles.dontShow}
                  onClick={handleDontShow}
                >
                  Don&apos;t show this again
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </PopupWrapper>
  );
}

export default ConverterCreditPlansPopup;
