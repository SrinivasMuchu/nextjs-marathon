"use client";
import { sendGAtagEvent } from '@/common.helper';
import { CAD_FLOATING_BUTTON_EVENT } from '@/config';
import { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye, ArrowLeftRight, Download, Box, ShieldCheck, ChevronUp } from 'lucide-react';
import { contextState } from './ContextProvider';
import { useCadForm } from '../CadServicePages/CadFormContext';
import styles from './FloatingButton.module.css';

const ACTIONS = [
  {
    href: '/tools/3d-cad-viewer',
    title: 'View CAD',
    subtitle: 'Open the online model viewer',
    Icon: Eye,
    eventName: 'floating_button_view_click',
  },
  {
    href: '/tools/3d-cad-file-converter',
    title: 'Convert CAD',
    subtitle: 'STEP ⇄ STL ⇄ IGES ⇄ DXF',
    Icon: ArrowLeftRight,
    eventName: 'floating_button_convert_click',
  },
  {
    href: '/publish-cad',
    title: 'Publish CAD',
    subtitle: 'Upload & share your model',
    Icon: Download,
    eventName: 'floating_button_publish_click',
  },
  {
    href: '/library',
    title: 'My Library',
    subtitle: 'Manage your saved models',
    Icon: Box,
    eventName: 'floating_button_library_click',
  },
];

function FloatingButton() {
  const pathname = usePathname();
  const { anchorAds } = useContext(contextState);
  const { showPopup } = useCadForm();
  const [showOptions, setShowOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStickyStripVisible, setIsStickyStripVisible] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(max-width: 1399px)');
    const updateIsMobile = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStickyStripVisibility = (event) => {
      setIsStickyStripVisible(Boolean(event?.detail?.visible));
    };

    window.addEventListener('sticky-cad-strip-visibility-change', handleStickyStripVisibility);

    return () => {
      window.removeEventListener('sticky-cad-strip-visibility-change', handleStickyStripVisibility);
    };
  }, []);

  useEffect(() => {
    setIsStickyStripVisible(false);
    setShowOptions(false);
  }, [pathname]);

  useEffect(() => {
    if (!showOptions) return;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setShowOptions(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showOptions]);

  if (showPopup) return null;
  if (pathname?.replace(/\/$/, '') === '/cad-services') return null;
  if (isMobile && isStickyStripVisible) return null;

  const bottom = anchorAds
    ? 'max(95px, calc(20px + env(safe-area-inset-bottom, 0px)))'
    : 'max(20px, env(safe-area-inset-bottom, 0px))';

  return (
    <div className={styles.wrap} style={{ bottom }} ref={rootRef}>
      {showOptions && (
        <div className={styles.menu} role="menu" aria-label="CAD actions">
          {ACTIONS.map(({ href, title, subtitle, Icon, eventName }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              className={styles.card}
              onClick={() => {
                sendGAtagEvent({
                  event_name: eventName,
                  event_category: CAD_FLOATING_BUTTON_EVENT,
                });
                setShowOptions(false);
              }}
            >
              <span className={styles.iconBox} aria-hidden="true">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className={styles.cardText}>
                <span className={styles.title}>{title}</span>
                <span className={styles.subtitle}>{subtitle}</span>
              </span>
            </Link>
          ))}
        </div>
      )}

      <button
        type="button"
        className={`${styles.trigger}${showOptions ? ` ${styles.triggerOpen}` : ''}`}
        aria-expanded={showOptions}
        aria-haspopup="menu"
        onClick={() => setShowOptions((open) => !open)}
      >
        <span className={styles.dot} aria-hidden="true" />
        <ShieldCheck
          size={17}
          strokeWidth={2.25}
          aria-hidden="true"
          className={styles.triggerIcon}
        />
        <span className={styles.triggerLabel}>CAD Actions</span>
        <ChevronUp
          size={16}
          strokeWidth={2.5}
          aria-hidden="true"
          className={`${styles.chevron}${showOptions ? ` ${styles.chevronOpen}` : ''}`}
        />
      </button>
    </div>
  );
}

export default FloatingButton;
