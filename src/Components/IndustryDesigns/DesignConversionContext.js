'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import DesignConversionStickyBar from './DesignConversionStickyBar';
import ConverterCreditPlansPopup from '@/Components/History/ConverterCreditPlansPopup';
import ConverterDownloadFlow from '@/Components/History/ConverterDownloadFlow';
import { ensureConverterPackPurchase } from '@/Components/History/converterPayment';
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
  buildSingleCreditPack,
} from '@/lib/converterPricing';
import { isLibraryDesignFree } from '@/data/libraryPage';
import { contextState } from '@/Components/CommonJsx/ContextProvider';
import UserLoginPupUp from '@/Components/CommonJsx/UserLoginPupUp';
import { isLoggedInClient } from '@/lib/authSession';

const LIBRARY_CONVERSION_POPUP_DISMISS_KEY =
  'marathon_library_conversion_popup_dismissed';

function shouldShowLibraryConversionPopup() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(LIBRARY_CONVERSION_POPUP_DISMISS_KEY) !== '1';
}

function dismissLibraryConversionPopupPermanently() {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LIBRARY_CONVERSION_POPUP_DISMISS_KEY, '1');
}

const DesignConversionContext = createContext(null);

export function DesignConversionProvider({ designData, children }) {
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [preferredFormat, setPreferredFormat] = useState(null);

  const onDownloadSuccess = useCallback(() => {
    if (shouldShowLibraryConversionPopup()) {
      setShowPricingPopup(true);
    }
  }, []);

  const onPreferredFormatChange = useCallback((format) => {
    setPreferredFormat(format);
  }, []);

  const value = useMemo(
    () => ({
      designData,
      showPricingPopup,
      preferredFormat,
      onDownloadSuccess,
      onPreferredFormatChange,
      dismissPricingPopup: () => setShowPricingPopup(false),
    }),
    [
      designData,
      showPricingPopup,
      preferredFormat,
      onDownloadSuccess,
      onPreferredFormatChange,
    ],
  );

  return (
    <DesignConversionContext.Provider value={value}>
      {children}
    </DesignConversionContext.Provider>
  );
}

export function useDesignConversion() {
  return useContext(DesignConversionContext);
}

/** After-download conversion pricing popup — same ConverterCreditPlansPopup UI. */
export function DesignPostDownloadBannerHost() {
  const ctx = useDesignConversion();
  const { user, setUser, setUpdatedDetails } = useContext(contextState);
  const [packs, setPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState('$2.99');
  const [singlePricing, setSinglePricing] = useState(null);
  const [pendingPack, setPendingPack] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!ctx?.showPricingPopup) return undefined;
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        setPacks(getConverterPacksFromInfo(info));
        setSinglePriceLabel(getSinglePriceLabelFromInfo(info) || '$2.99');
        setSinglePricing(info?.pricing || null);
      })
      .catch(() => {
        if (!cancelled) {
          setPacks([]);
          setSinglePriceLabel('$2.99');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [ctx?.showPricingPopup]);

  if (!ctx?.showPricingPopup || !ctx.designData) return null;
  if (!isLibraryDesignFree(ctx.designData)) return null;

  return (
    <>
      <ConverterCreditPlansPopup
        packs={packs}
        singlePriceLabel={singlePriceLabel}
        fileType={ctx.designData.file_type}
        onClose={ctx.dismissPricingPopup}
        onDontShowAgain={dismissLibraryConversionPopupPermanently}
        onSelectSingle={() => {
          setPendingPack(buildSingleCreditPack(singlePricing, singlePriceLabel));
          if (!isLoggedInClient()) setShowLogin(true);
        }}
        onSelectPack={(pack) => {
          setPendingPack(pack);
          if (!isLoggedInClient()) {
            setShowLogin(true);
          }
        }}
      />
      {showLogin ? (
        <UserLoginPupUp
          type="login"
          onClose={() => {
            setShowLogin(false);
            if (!isLoggedInClient()) setPendingPack(null);
          }}
        />
      ) : null}
      {pendingPack && !showLogin && isLoggedInClient() ? (
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
              setUser?.((prev) => ({
                ...prev,
                converter_credits: Number(result.credits) || 0,
              }));
              setUpdatedDetails?.((value) => !value);
            }
            setPendingPack(null);
            ctx.dismissPricingPopup();
            return result;
          }}
        />
      ) : null}
    </>
  );
}

export function DesignConversionStickyBarHost() {
  const ctx = useDesignConversion();
  if (!ctx?.designData) return null;
  if (!isLibraryDesignFree(ctx.designData)) return null;
  return (
    <DesignConversionStickyBar
      designData={ctx.designData}
      preferredFormat={ctx.preferredFormat}
    />
  );
}
