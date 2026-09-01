"use client";

import React, { useContext, useEffect, useState } from "react";
import { fetchTechDrawPriceDisplay } from "@/api/cadDrawingPipelineApi";
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
} from "@/lib/converterPricing";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import ConverterDownloadFlow from "@/Components/History/ConverterDownloadFlow";
import { ensureConverterPackPurchase } from "@/Components/History/converterPayment";
import ConversionPricingPanel from "./ConversionPricingPanel";

function ConversionPricing({ variant = "home" }) {
  const { user, setUser, setUpdatedDetails } = useContext(contextState);
  const [packs, setPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState("$2.99");
  const [drawingPriceLabel, setDrawingPriceLabel] = useState("$5.99");
  const [loaded, setLoaded] = useState(false);
  const [pendingPack, setPendingPack] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([fetchConverterPricingInfo(), fetchTechDrawPriceDisplay()]).then(
      ([converterResult, drawingResult]) => {
        if (cancelled) return;

        if (converterResult.status === "fulfilled") {
          const info = converterResult.value;
          setPacks(getConverterPacksFromInfo(info));
          const single = getSinglePriceLabelFromInfo(info);
          if (single) setSinglePriceLabel(single);
        } else {
          setPacks([]);
        }

        if (drawingResult.status === "fulfilled" && drawingResult.value?.totalLabel) {
          setDrawingPriceLabel(drawingResult.value.totalLabel);
        }

        setLoaded(true);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user?._id && showLogin) {
      setShowLogin(false);
    }
  }, [user?._id, showLogin]);

  const handleChoosePack = (pack) => {
    if (!pack) return;
    if (!user?._id) {
      setPendingPack(pack);
      setShowLogin(true);
      return;
    }
    setPendingPack(pack);
  };

  const closeLogin = () => {
    setShowLogin(false);
    if (typeof window !== "undefined" && !localStorage.getItem("uuid")) {
      setPendingPack(null);
    }
  };

  if (!loaded || !packs.length) {
    return null;
  }

  return (
    <>
      <ConversionPricingPanel
        variant={variant}
        packs={packs}
        singlePriceLabel={singlePriceLabel}
        drawingPriceLabel={drawingPriceLabel}
        onChoosePack={handleChoosePack}
      />

      {showLogin ? <UserLoginPupUp onClose={closeLogin} type="login" /> : null}

      {pendingPack && user?._id && !showLogin ? (
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
              setUser((prev) => ({ ...prev, converter_credits: Number(result.credits) || 0 }));
              setUpdatedDetails((value) => !value);
            }
            return result;
          }}
        />
      ) : null}
    </>
  );
}

export default ConversionPricing;
