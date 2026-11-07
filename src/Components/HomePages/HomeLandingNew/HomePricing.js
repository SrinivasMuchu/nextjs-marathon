"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import ConverterDownloadFlow from "@/Components/History/ConverterDownloadFlow";
import { ensureConverterPackPurchase } from "@/Components/History/converterPayment";
import { sendGAtagEvent } from "@/common.helper";
import { CAD_CONVERTER_EVENT } from "@/config";
import { isLoggedInClient } from "@/lib/authSession";
import {
  fetchConverterPricingInfo,
  formatConverterPrice,
  getConverterPacksFromInfo,
  getFreeConversionsPerUser,
  getSinglePriceLabelFromInfo,
} from "@/lib/converterPricing";
import hero from "./HomeHero.module.css";
import styles from "./HomePricing.module.css";

function singleTotalFromInfo(info) {
  const total = Number(info?.single_price_with_gst ?? info?.pricing?.total ?? info?.pricing?.price_with_gst);
  return Number.isFinite(total) && total > 0 ? total : 0;
}

function cheapestMix(count, packs, singlePrice) {
  const opts = [
    ...packs.map((pack) => ({
      name: pack.name,
      credits: Number(pack.credits) || 0,
      price: Number(pack.price_with_gst),
    })),
    { name: "Single", credits: 1, price: singlePrice },
  ].filter((opt) => opt.credits > 0 && Number.isFinite(opt.price) && opt.price >= 0);

  const cost = [0];
  const pick = [null];
  for (let files = 1; files <= count; files += 1) {
    cost[files] = Infinity;
    opts.forEach((opt, index) => {
      const prev = cost[Math.max(0, files - opt.credits)];
      if (!Number.isFinite(prev)) return;
      const next = prev + opt.price;
      if (next < cost[files] - 1e-9) {
        cost[files] = next;
        pick[files] = index;
      }
    });
  }

  const counts = {};
  let left = count;
  let credits = 0;
  let guard = 0;
  while (left > 0 && pick[left] != null && guard < count + 5) {
    const opt = opts[pick[left]];
    counts[opt.name] = (counts[opt.name] || 0) + 1;
    credits += opt.credits;
    left = Math.max(0, left - opt.credits);
    guard += 1;
  }

  return { cost: Number.isFinite(cost[count]) ? cost[count] : 0, counts, credits };
}

function HomePricing({ initialInfo, drawingLabel }) {
  const { user, setUser, setUpdatedDetails } = useContext(contextState);
  const [info, setInfo] = useState(initialInfo || null);
  const [pendingPack, setPendingPack] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [need, setNeed] = useState(10);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetchConverterPricingInfo()
        .then((next) => {
          if (!cancelled && next) setInfo(next);
        })
        .catch(() => {});
    };
    load();
    const timer = setTimeout(load, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const packs = useMemo(() => (info ? getConverterPacksFromInfo(info) : []), [info]);
  const singleTotal = info ? singleTotalFromInfo(info) : 0;
  const singleLabel = info ? getSinglePriceLabelFromInfo(info) : "";
  const currency = info?.pricing?.currency || "USD";
  const freeCount = info ? getFreeConversionsPerUser(info) : 0;
  const quote = useMemo(
    () => (packs.length && singleTotal > 0 ? cheapestMix(need, packs, singleTotal) : null),
    [need, packs, singleTotal],
  );

  const usedNames = new Set(Object.keys(quote?.counts || {}));
  const mix = quote
    ? [...packs].reverse().concat([{ name: "Single" }]).flatMap((pack) => {
      const count = quote.counts[pack.name] || 0;
      if (!count) return [];
      const label = pack.name === "Single" ? "single file" : pack.name;
      return `${count}× ${label}`;
    }).join(" + ")
    : "";

  const save = quote ? need * singleTotal - quote.cost : 0;
  const spare = quote ? quote.credits - need : 0;
  const note = quote
    ? [
      `${formatConverterPrice(quote.cost / need, currency)} per file`,
      save > 0.005 ? `save ${formatConverterPrice(save, currency)}` : "",
      spare > 0 ? `${spare} spare credit${spare > 1 ? "s" : ""}` : "",
    ].filter(Boolean).join(" · ")
    : "";

  const lede = singleLabel
    ? `First ${freeCount} file${freeCount === 1 ? "" : "s"} free, any size up to 300 MB. After that, ${singleLabel} or 1 credit per file. Credits never expire.`
    : "Credits never expire. You pay only when you download.";

  function choosePack(pack) {
    if (!pack) return;
    sendGAtagEvent({
      event_name: "converter_plan_checkout_clicked",
      event_category: CAD_CONVERTER_EVENT,
      payment_type: "converter_pack",
      pack_id: pack.id || "",
      pack_name: pack.name || "",
      price_label: pack.price_label || "",
      credits: pack.credits != null ? String(pack.credits) : "",
    });
    setPendingPack(pack);
    if (!isLoggedInClient()) setShowLogin(true);
  }

  function closeLogin() {
    setShowLogin(false);
    if (!isLoggedInClient()) setPendingPack(null);
  }

  return (
    <section className={styles.band} id="pricing" aria-labelledby="price-title">
      <div className={hero.wrap}>
        <div className={hero.sh}>
          <p className={hero.eyebrow}>Pricing</p>
          <h2 className={hero.platformTitle} id="price-title">Start free. <span className={hero.grad}>Pay per file.</span></h2>
          <p>{lede}</p>
        </div>

        {packs.length ? (
          <div className={styles.packs}>
            {packs.map((pack) => {
              const best = Boolean(pack.save_best);
              return (
                <article
                  key={pack.id || pack.name}
                  className={[styles.pack, best ? styles.packPop : "", usedNames.has(pack.name) ? styles.packHl : ""].filter(Boolean).join(" ")}
                  data-pack={pack.name}
                >
                  {best ? <span className={styles.badge}>Best value</span> : null}
                  <div className={styles.name}>{pack.name}</div>
                  <div className={styles.credits}>{pack.credits}<small>credits</small></div>
                  <div className={styles.price}>{pack.price_label}<small>{pack.per_credit_label}</small></div>
                  {Number(pack.save_percent) > 0 ? (
                    <span className={`${styles.save} ${best ? styles.saveBest : ""}`}>Save {pack.save_percent}%</span>
                  ) : null}
                  <button
                    type="button"
                    className={`${styles.btn} ${best ? styles.btnPrimary : styles.btnGhost}`}
                    onClick={() => choosePack(pack)}
                  >
                    {pack.cta || `Choose ${pack.name}`}
                  </button>
                </article>
              );
            })}
          </div>
        ) : null}

        <p className={styles.taxNote}>All prices include tax. <Link href="/refund-policy">Refund Policy</Link></p>

        <div className={styles.strip}>
          <div className={styles.free}>
            <span className={styles.ic}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6" /></svg></span>
            <div><b>{freeCount ? `${freeCount} file${freeCount === 1 ? "" : "s"} free` : "Files free"}</b><span>any size up to 300 MB</span></div>
          </div>
          <div>
            <span className={styles.ic}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg></span>
            <div><b>{singleLabel ? `${singleLabel} or 1 credit` : "1 credit"}</b><span>per file, incl. tax</span></div>
          </div>
          <div>
            <span className={styles.ic}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M7 15h4v-4H7zM14 8h3M14 12h3M14 16h3" /></svg></span>
            <div><b>{drawingLabel ? `${drawingLabel} a drawing set` : "A drawing set"}</b><span>every format included</span></div>
          </div>
          <div>
            <span className={styles.ic}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" /><path d="M9 8h6M9 12h6" /></svg></span>
            <div><b>No subscription</b><span>invoice on every purchase</span></div>
          </div>
        </div>

        {quote ? (
          <div className={styles.calc}>
            <div>
              <h3>Find your cheapest pack</h3>
              <p>How many paid downloads do you need?</p>
              <div className={styles.ctl}>
                <label className={hero.srOnly} htmlFor="need">Paid downloads needed</label>
                <input id="need" type="range" min="1" max="60" step="1" value={need} onChange={(event) => setNeed(Number(event.target.value))} />
                <output htmlFor="need">{need}</output>
              </div>
            </div>
            <div className={styles.res} aria-live="polite">
              <b className={styles.big}>{formatConverterPrice(quote.cost, currency)}</b>
              <div><span>{mix}</span><small>{note}</small></div>
            </div>
          </div>
        ) : null}
      </div>

      {showLogin ? <UserLoginPupUp onClose={closeLogin} type="login" /> : null}

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
              setUser((prev) => ({ ...prev, converter_credits: Number(result.credits) || 0 }));
              setUpdatedDetails((value) => !value);
            }
            return result;
          }}
        />
      ) : null}
    </section>
  );
}

export default HomePricing;
