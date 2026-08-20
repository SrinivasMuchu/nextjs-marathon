"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Camera,
  ChevronDown,
  LayoutGrid,
  MoreHorizontal,
  RefreshCw,
  Scan,
  User,
} from "lucide-react";
import { contextState } from "../CommonJsx/ContextProvider";
import NameProfile from "../CommonJsx/NameProfile";
import { BASE_URL } from "@/config";
import axios from "axios";
import styles from "./DashboardMobile.module.css";

const NAV = [
  { id: "USER_CADS", label: "Projects", icon: LayoutGrid },
  { id: "CAD_VIEWER", label: "CAD Viewer", icon: Box },
  { id: "CAD_CONVERTER", label: "CAD Converter", icon: RefreshCw },
  { id: "CAD_TECHDRAW", label: "2D Drawings", icon: Scan },
];

const MORE_LINKS = [
  { id: "USER_DOWNLOADS", label: "Downloads" },
  { id: "ANALYTICS", label: "Analytics" },
  { id: "USER_KYC", label: "KYC" },
  { id: "EARNINGS", label: "Earnings" },
  { id: "USER_PROFILE", label: "Profile" },
];

function DashboardMobileChrome() {
  const { user, setUser, setUpdatedDetails } = useContext(contextState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cadType = searchParams.get("cad_type") || "USER_CADS";
  const photoInputRef = useRef(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);

  const active = NAV.some((item) => item.id === cadType) ? cadType : "MORE";

  useEffect(() => {
    document.body.classList.add("dashboard-mobile-app");
    return () => document.body.classList.remove("dashboard-mobile-app");
  }, []);

  const go = (id) => {
    setMoreOpen(false);
    setNameOpen(false);
    router.push(`/dashboard?cad_type=${id}`, { scroll: false });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Photo = reader.result;
      setUser((prev) => ({ ...prev, photo: base64Photo }));
      try {
        await axios.post(
          `${BASE_URL}/v1/cad/create-user-details`,
          {
            user_email: user.email,
            full_name: user.name,
            photo: base64Photo,
          },
          { headers: { "user-uuid": localStorage.getItem("uuid") } }
        );
        setUpdatedDetails(user);
      } catch (err) {
        console.error("Error uploading photo:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const displayName = user?.name?.trim() || "Enter your name";

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.avatarBtn}
            onClick={() => photoInputRef.current?.click()}
            aria-label="Change profile photo"
          >
            {user?.photo ? (
              user.photo.startsWith("data") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photo} alt="" className={styles.avatarImg} />
              ) : (
                <NameProfile
                  userName={user.name || user.email || "U"}
                  memberPhoto={user.photo}
                  width="52px"
                  fontSize="20px"
                />
              )
            ) : (
              <span className={styles.avatarFallback}>
                <User size={26} strokeWidth={1.8} />
              </span>
            )}
            <span className={styles.cameraBadge}>
              <Camera size={11} strokeWidth={2.4} />
            </span>
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={handleFileUpload}
          />

          <div className={styles.hello}>
            <span>Hello,</span>
            <button
              type="button"
              className={styles.nameBtn}
              onClick={() => setNameOpen((open) => !open)}
            >
              {displayName}
              <ChevronDown size={16} />
            </button>
            {nameOpen ? (
              <div className={styles.nameMenu}>
                <button type="button" onClick={() => go("USER_PROFILE")}>
                  Profile
                </button>
                <button type="button" onClick={() => go("USER_KYC")}>
                  KYC
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <nav className={styles.bottomNav} aria-label="Dashboard">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={() => go(item.id)}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          className={`${styles.navItem} ${active === "MORE" ? styles.navItemActive : ""}`}
          onClick={() => setMoreOpen((open) => !open)}
        >
          <MoreHorizontal size={22} />
          <span>More</span>
        </button>
      </nav>

      {moreOpen ? (
        <div className={styles.moreScrim} onClick={() => setMoreOpen(false)}>
          <div className={styles.moreSheet} onClick={(e) => e.stopPropagation()}>
            {MORE_LINKS.map((item) => (
              <button key={item.id} type="button" onClick={() => go(item.id)}>
                {item.label}
              </button>
            ))}
            <Link href="/" onClick={() => setMoreOpen(false)}>
              Home
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default DashboardMobileChrome;
