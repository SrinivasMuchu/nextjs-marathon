"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { contextState } from "./ContextProvider";
import {
  useCadForm,
  isCadServicesRoute,
  isCadPartnerPageRoute,
} from "../CadServicePages/CadFormContext";
import styles from "./ScrollToTopButton.module.css";

const SHOW_AFTER_PX = 320;
/** Space to clear CAD Actions / Sticky CTA pill below this button */
const FAB_STACK_OFFSET = "68px";

function ScrollToTopButton() {
  const pathname = usePathname();
  const { anchorAds } = useContext(contextState);
  const { showPopup } = useCadForm();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStickyStripVisible, setIsStickyStripVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 1399px)");
    const updateIsMobile = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStickyStripVisibility = (event) => {
      setIsStickyStripVisible(Boolean(event?.detail?.visible));
    };

    window.addEventListener(
      "sticky-cad-strip-visibility-change",
      handleStickyStripVisibility
    );

    return () => {
      window.removeEventListener(
        "sticky-cad-strip-visibility-change",
        handleStickyStripVisibility
      );
    };
  }, []);

  useEffect(() => {
    setIsStickyStripVisible(false);
    setVisible(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (showPopup) return null;
  if (isCadPartnerPageRoute(pathname)) return null;
  if (isMobile && isStickyStripVisible) return null;

  const floatingCadVisible =
    !isCadServicesRoute(pathname) &&
    !(isMobile && isStickyStripVisible);

  const baseBottom = anchorAds
    ? "max(95px, calc(20px + env(safe-area-inset-bottom, 0px)))"
    : "max(20px, env(safe-area-inset-bottom, 0px))";

  // Stack above CAD Actions, or above Sticky CTA on /cad-services
  const bottom =
    floatingCadVisible || isCadServicesRoute(pathname)
      ? `calc(${baseBottom} + ${FAB_STACK_OFFSET})`
      : baseBottom;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`${styles.wrap} ${visible ? styles.wrapVisible : styles.wrapHidden}`}
      style={{ bottom }}
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={scrollToTop}
        aria-label="Move to top"
        title="Move to top"
      >
        <ChevronUp
          size={17}
          strokeWidth={2.5}
          aria-hidden="true"
          className={styles.triggerIcon}
        />
        <span className={styles.triggerLabel}>Move to top</span>
      </button>
    </div>
  );
}

export default ScrollToTopButton;
