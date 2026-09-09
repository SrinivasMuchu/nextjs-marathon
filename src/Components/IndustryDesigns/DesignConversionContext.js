'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import DesignConversionStickyBar from './DesignConversionStickyBar';
import ConverterCreditPlansPopup from '@/Components/History/ConverterCreditPlansPopup';
import ConverterDownloadFlow from '@/Components/History/ConverterDownloadFlow';
import { ensureConverterPackPurchase } from '@/Components/History/converterPayment';
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
} from '@/lib/converterPricing';
import { getPreferredDesignConvertTarget, isLibraryDesignFree } from '@/data/libraryPage';
import { startLibraryFormatConversion } from '@/api/librarySourceApi';
import { contextState } from '@/Components/CommonJsx/ContextProvider';

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
  const router = useRouter();
  const { user, setUser, setUpdatedDetails } = useContext(contextState);
  const [packs, setPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState('$2.99');
  const [pendingPack, setPendingPack] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!ctx?.showPricingPopup) return undefined;
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        setPacks(getConverterPacksFromInfo(info));
        setSinglePriceLabel(getSinglePriceLabelFromInfo(info) || '$2.99');
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

  const preferred = getPreferredDesignConvertTarget(
    ctx.designData.file_type,
    ctx.designData._id,
  );
  const outputFormat = String(preferred?.label || 'STL')
    .toLowerCase()
    .replace(/^\./, '');

  const startConvert = async () => {
    if (!ctx.designData?._id) {
      router.push(preferred?.href || '/tools/3d-cad-file-converter');
      ctx.dismissPricingPopup();
      return;
    }
    if (starting) return;
    setStarting(true);
    try {
      const result = await startLibraryFormatConversion({
        designId: ctx.designData._id,
        outputFormat,
      });
      ctx.dismissPricingPopup();
      router.push(result.statusPath);
    } catch (err) {
      toast.error(err?.message || 'Could not start conversion.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <>
      <ConverterCreditPlansPopup
        packs={packs}
        singlePriceLabel={singlePriceLabel}
        fileType={ctx.designData.file_type}
        onClose={ctx.dismissPricingPopup}
        onDontShowAgain={dismissLibraryConversionPopupPermanently}
        onSelectSingle={startConvert}
        onSelectPack={(pack) => {
          if (!user?._id && typeof window !== 'undefined' && !localStorage.getItem('is_verified')) {
            toast.info('Log in to buy credits.');
            return;
          }
          setPendingPack(pack);
        }}
      />
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
