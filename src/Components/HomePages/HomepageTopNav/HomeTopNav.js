"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IMAGEURLS } from "@/config";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import styles from "./HomeTopNav.module.css";
import TopNavProfileButton from "../../CommonJsx/TopNavProfileButton";
import { isCadPartnerPageRoute } from "@/Components/CadServicePages/CadFormContext";
import MenuButton from "@/Components/CommonJsx/MenuButton";
import ConverterCreditPlansPopup from "@/Components/History/ConverterCreditPlansPopup";
import ConverterDownloadFlow from "@/Components/History/ConverterDownloadFlow";
import { ensureConverterPackPurchase } from "@/Components/History/converterPayment";
import { formatConverterCreditsLabel } from "@/lib/converterCredits";
import {
  fetchConverterPricingInfo,
  getConverterPacksFromInfo,
  getSinglePriceLabelFromInfo,
} from "@/lib/converterPricing";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import { toast } from "react-toastify";
import {
  BLOGS_MENU,
  LIBRARY_MENU,
  TOOLS_MENU,
} from "./navConfig";

function renderNavDropdownMenu(items, label, onClose) {
  return (
    <div className={styles.toolsDropdownMenu} role="menu" aria-label={label}>
      {items.map(({ href, title, subtitle, Icon }) => (
        <Link
          key={href}
          href={href}
          role="menuitem"
          className={styles.toolsDropdownCard}
          onClick={onClose}
        >
          <span className={styles.toolsDropdownIcon} aria-hidden="true">
            <Icon size={20} strokeWidth={2} />
          </span>
          <span className={styles.toolsDropdownText}>
            <span className={styles.toolsDropdownTitle}>{title}</span>
            <span className={styles.toolsDropdownSubtitle}>{subtitle}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function HomeTopNav() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showCreditPlans, setShowCreditPlans] = useState(false);
  const [packs, setPacks] = useState([]);
  const [singlePriceLabel, setSinglePriceLabel] = useState("");
  const [pendingPack, setPendingPack] = useState(null);
  const topNavRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, setUpdatedDetails } = useContext(contextState);
  const creditsLabel = formatConverterCreditsLabel(user?.converter_credits);

  useEffect(() => {
    let cancelled = false;
    fetchConverterPricingInfo()
      .then((info) => {
        if (cancelled) return;
        setPacks(getConverterPacksFromInfo(info));
        setSinglePriceLabel(getSinglePriceLabelFromInfo(info));
      })
      .catch(() => {
        if (!cancelled) {
          setPacks([]);
          setSinglePriceLabel("");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (!openDropdown) return undefined;

    const handleClickOutside = (event) => {
      if (topNavRef.current && !topNavRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const handleAnchorClick = (event, sectionId) => {
    event.preventDefault();
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleDropdown = (e, dropdownName) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleNavHover = (dropdownName = null) => {
    setOpenDropdown(dropdownName);
  };

  const handleDashboardClick = () => {
    setOpenDropdown(null);
    router.refresh();
  };

  const creditsButton = (
    <button
      type="button"
      className={styles.creditsPill}
      onClick={() => setShowCreditPlans(true)}
      aria-label={`${creditsLabel}. Buy credits`}
    >
      <span className={styles.creditsPillIcon} aria-hidden>
        ◆
      </span>
      <span>
        {creditsLabel} <span className={styles.creditsPillSep}>·</span> Buy
      </span>
    </button>
  );

  if (isCadPartnerPageRoute(pathname)) {
    return null;
  }

  return (
    <div className={styles.navShell} ref={topNavRef}>
      <div className={styles["home-page-top"]}>
        <div className={styles.mobileMenuSlot}>
          <MenuButton
            creditsButton={creditsButton}
            onOpenCreditPlans={() => setShowCreditPlans(true)}
            creditsLabel={creditsLabel}
          />
        </div>

        <Link href="/" className={styles.logoLink}>
          <Image
            src={IMAGEURLS.logo}
            alt="Marathon Logo"
            width={500}
            height={500}
            className={styles["home-page-top-logo"]}
            priority
          />
        </Link>

        <div className={styles["home-page-navs"]}>
          <Link
            href="#why-us"
            className={`${styles.navLink} ${styles.navWhyUs}`}
            onMouseEnter={() => handleNavHover(null)}
            onClick={(e) => handleAnchorClick(e, "why-us")}
          >
            Why us?
          </Link>

          <Link
            href="/dashboard"
            rel="nofollow"
            className={styles.navLink}
            onMouseEnter={() => handleNavHover(null)}
            onClick={handleDashboardClick}
          >
            Dashboard
          </Link>

          <div
            className={styles.navDropdownWrap}
            onMouseEnter={() => handleNavHover("library")}
            onMouseLeave={() => setOpenDropdown((open) => (open === "library" ? null : open))}
          >
            <Link
              href="/library"
              className={`${styles["nav-dropdown-trigger"]} ${openDropdown === "library" ? styles.navTriggerOpen : ""}`}
            >
              Library <ChevronDown size={14} className={styles.navChevron} />
            </Link>
            {openDropdown === "library" &&
              renderNavDropdownMenu(LIBRARY_MENU, "Library", () => setOpenDropdown(null))}
          </div>

          <Link
            href="/cad-services"
            className={styles.topCta}
            aria-label="Hire Designers"
            onMouseEnter={() => handleNavHover(null)}
          >
            <span className={styles.topCtaDot} />
            Hire Designers <ArrowRight size={16} strokeWidth={2.5} />
          </Link>

          <div
            className={styles.navDropdownWrap}
            onMouseEnter={() => handleNavHover("tools")}
            onMouseLeave={() => setOpenDropdown((open) => (open === "tools" ? null : open))}
          >
            <Link
              href="/tools"
              className={`${styles["nav-dropdown-trigger"]} ${openDropdown === "tools" ? styles.navTriggerOpen : ""}`}
            >
              Tools <ChevronDown size={14} className={styles.navChevron} />
            </Link>
            {openDropdown === "tools" &&
              renderNavDropdownMenu(TOOLS_MENU, "Tools", () => setOpenDropdown(null))}
          </div>

          <Link href="/resources" className={styles.navLink} onMouseEnter={() => handleNavHover(null)}>
            Resources
          </Link>

          <div
            className={styles.navDropdownWrap}
            onMouseEnter={() => handleNavHover("blogs")}
            onMouseLeave={() => setOpenDropdown((open) => (open === "blogs" ? null : open))}
          >
            <button
              type="button"
              className={`${styles["nav-dropdown-trigger"]} ${styles.navTriggerBtn} ${openDropdown === "blogs" ? styles.navTriggerOpen : ""}`}
              onClick={(e) => toggleDropdown(e, "blogs")}
              aria-expanded={openDropdown === "blogs"}
            >
              Blogs <ChevronDown size={14} className={styles.navChevron} />
            </button>
            {openDropdown === "blogs" &&
              renderNavDropdownMenu(BLOGS_MENU, "Blogs", () => setOpenDropdown(null))}
          </div>
        </div>

        <div className={styles["home-pg-btns"]}>
          {creditsButton}
          <TopNavProfileButton />
        </div>

        <div className={styles.mobileProfileSlot}>
          <TopNavProfileButton mobileHeader />
        </div>
      </div>

      {showCreditPlans ? (
        <ConverterCreditPlansPopup
          packs={packs}
          singlePriceLabel={singlePriceLabel}
          onClose={() => setShowCreditPlans(false)}
          onSelectPack={(pack) => {
            if (!user?._id) {
              toast.info("Log in to buy credits.");
              return;
            }
            setShowCreditPlans(false);
            setPendingPack(pack);
          }}
          onSelectSingle={() => setShowCreditPlans(false)}
        />
      ) : null}
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
              setUser((prev) => ({ ...prev, converter_credits: Number(result.credits) || 0 }));
              setUpdatedDetails((value) => !value);
            }
            return result;
          }}
        />
      ) : null}
    </div>
  );
}

export default HomeTopNav;
