"use client"
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./CreatorsDashboard.module.css";
import { useRouter } from "next/navigation";
import UserLoginPupUp from "../CommonJsx/UserLoginPupUp";
import Link from "next/link";

function CreatorDashboardButton({ buttonName }) {
  const [emailVerify, setEmailVerify] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const route = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsVerified(!!localStorage.getItem("is_verified"));
    }
  }, []);

  const handleDashboard = () => {
    if (!localStorage.getItem("is_verified")) {
      setEmailVerify(true);
    } else {
      route.push("/dashboard");
    }
  };

  return (
    <>
      <div className={styles.creatorDashboardButtonContainer}>
        {buttonName === "Explore Designs" ? (
          <Link className={styles.creatorDashboardButtonCreate} href="/library">
            {buttonName}
          </Link>
        ) : isVerified ? (
          <Link className={styles.creatorDashboardButtonCreate} href="/dashboard">
            Go to Dashboard
          </Link>
        ) : (
          <button
            className={styles.creatorDashboardButtonCreate}
            onClick={handleDashboard}
          >
            {buttonName}
          </button>
        )}
      </div>

      {emailVerify &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserLoginPupUp type="profile" onClose={() => setEmailVerify(false)} />
          </div>,
          document.body
        )}
    </>
  );
}

export default CreatorDashboardButton;
