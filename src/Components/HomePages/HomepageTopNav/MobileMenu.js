"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "./HomeTopNav.module.css";
import NameProfile from "@/Components/CommonJsx/NameProfile";
import DemoPopUp from "@/Components/HomePages/RequestDemo/DemoPopUp";
import UserLoginPupUp from "@/Components/CommonJsx/UserLoginPupUp";
import { contextState } from "@/Components/CommonJsx/ContextProvider";
import {
  BLOGS_MENU,
  LIBRARY_MENU,
  MOBILE_MAIN_NAV,
  TOOLS_MENU,
} from "./navConfig";

function NavRow({ href, onClick, Icon, label, chevron, badge, highlight }) {
  const className = `${styles.mobileNavRow} ${highlight ? styles.mobileNavRowHighlight : ""}`;
  const content = (
    <>
      <span className={styles.mobileNavIcon} aria-hidden>
        {highlight ? <span className={styles.topCtaDot} /> : Icon ? <Icon size={18} strokeWidth={2.2} /> : null}
      </span>
      <span className={styles.mobileNavLabel}>{label}</span>
      {badge ? <span className={styles.toolsMegaBadge}>{badge}</span> : null}
      {highlight ? (
        <ArrowRight size={16} className={styles.mobileNavChevron} />
      ) : chevron ? (
        <ChevronRight size={18} className={styles.mobileNavChevron} />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}

function MobileMenu({ onClose, creditsButton }) {
  const [panelStack, setPanelStack] = useState([]);
  const [authModal, setAuthModal] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useContext(contextState);
  const loggedIn = Boolean(user?._id);
  const currentPanel = panelStack[panelStack.length - 1] || null;

  useEffect(() => {
    document.body.classList.add("mobile-nav-open");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("mobile-nav-open");
      document.body.style.overflow = prev;
    };
  }, []);

  const pushPanel = (panel) => setPanelStack((stack) => [...stack, panel]);
  const popPanel = () => setPanelStack((stack) => stack.slice(0, -1));

  const handleClose = () => {
    document.body.classList.remove("mobile-nav-open");
    document.body.style.overflow = "";
    onClose();
  };

  const handleAnchorClick = (event, sectionId) => {
    event.preventDefault();
    if (pathname !== "/") router.push(`/#${sectionId}`);
    else document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    handleClose();
  };

  const openSubmenu = (item) => {
    if (item.id === "library") pushPanel({ type: "library", title: "Library" });
    else if (item.id === "tools") pushPanel({ type: "tools", title: "Tools" });
    else if (item.id === "blogs") pushPanel({ type: "blogs", title: "Blogs" });
  };

  const renderMainNav = () => (
    <ul className={styles.mobileNavList}>
      {MOBILE_MAIN_NAV.map((item) => (
        <li key={item.id}>
          {item.type === "anchor" ? (
            <NavRow Icon={item.Icon} label={item.label} onClick={(e) => handleAnchorClick(e, item.anchor)} />
          ) : item.type === "link" ? (
            <NavRow
              href={item.href}
              Icon={item.Icon}
              label={item.label}
              highlight={item.highlight}
              onClick={item.id === "dashboard" ? () => { handleClose(); router.refresh(); } : handleClose}
            />
          ) : (
            <NavRow Icon={item.Icon} label={item.label} chevron onClick={() => openSubmenu(item)} />
          )}
        </li>
      ))}
    </ul>
  );

  const renderLibraryPanel = () => (
    <ul className={styles.mobileNavList}>
      {LIBRARY_MENU.map(({ href, title, Icon }) => (
        <li key={href}>
          <NavRow href={href} Icon={Icon} label={title} onClick={handleClose} />
        </li>
      ))}
    </ul>
  );

  const renderBlogsPanel = () => (
    <ul className={styles.mobileNavList}>
      {BLOGS_MENU.map(({ href, title, Icon }) => (
        <li key={href}>
          <NavRow href={href} Icon={Icon} label={title} onClick={handleClose} />
        </li>
      ))}
    </ul>
  );

  const renderToolsPanel = () => (
    <ul className={styles.mobileNavList}>
      {TOOLS_MENU.map(({ href, title, Icon }) => (
        <li key={href}>
          <NavRow href={href} Icon={Icon} label={title} chevron onClick={handleClose} />
        </li>
      ))}
    </ul>
  );

  let panelContent = renderMainNav();
  let panelTitle = "Menu";
  let onBack = null;

  if (currentPanel?.type === "library") {
    panelContent = renderLibraryPanel();
    panelTitle = "Library";
    onBack = popPanel;
  } else if (currentPanel?.type === "blogs") {
    panelContent = renderBlogsPanel();
    panelTitle = "Blogs";
    onBack = popPanel;
  } else if (currentPanel?.type === "tools") {
    panelContent = renderToolsPanel();
    panelTitle = "Tools";
    onBack = popPanel;
  }

  return (
    <div className={styles.mobileMenuOverlay} onClick={handleClose}>
      <div className={styles.mobileMenuSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.mobileMenuHeader}>
          {onBack ? (
            <button type="button" className={styles.mobileMenuBack} onClick={onBack}>
              <ChevronLeft size={22} />
              {panelTitle}
            </button>
          ) : (
            <span className={styles.mobileMenuTitle}>{panelTitle}</span>
          )}
          <button type="button" className={styles.mobileMenuClose} onClick={handleClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className={styles.mobileMenuBody}>{panelContent}</div>

        <div className={styles.mobileMenuFoot}>
          {creditsButton}
          {loggedIn ? (
            <Link href="/dashboard" className={styles.mobileProfileRow} onClick={handleClose}>
              <NameProfile
                userName={user?.name || user?.email || "User"}
                memberPhoto={user?.photo}
                width={40}
                height={40}
                border
              />
              <span>
                <strong>{user?.name || "Account"}</strong>
                <small>Open dashboard</small>
              </span>
              <ChevronRight size={18} />
            </Link>
          ) : (
            <>
              <button type="button" className={styles.mobileDemoBtn} onClick={() => setAuthModal("demo")}>
                Request demo
              </button>
              <button type="button" className={styles.mobileLoginBtn} onClick={() => setAuthModal("login")}>
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {authModal === "login" ? (
        <UserLoginPupUp onClose={() => setAuthModal(null)} type="login" />
      ) : null}
      {authModal === "demo" ? (
        <DemoPopUp
          onclose={() => setAuthModal(null)}
          openPopUp={authModal}
          setOpenDemoForm={setAuthModal}
        />
      ) : null}
    </div>
  );
}

export default MobileMenu;
