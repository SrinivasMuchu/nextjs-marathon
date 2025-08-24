"use client"
import React, { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CreatorsDashboard.module.css";
import { useRouter } from "next/navigation";
import UserLoginPupUp from "../CommonJsx/UserLoginPupUp";

function CreatorDashboardButton({buttonName}) {
  const [emailVerify, setEmailVerify] = useState(false);
  const route = useRouter();

  const handleDashboard = () => {
    if (!localStorage.getItem("is_verified")) {
      setEmailVerify(true);
    } else {
      route.push("/creator");
    }
  };

  return (
    <>
      <div className={styles.creatorDashboardButtonContainer}>
        <button
          className={styles.creatorDashboardButtonCreate}
          onClick={handleDashboard}
        >
         {buttonName}
        </button>
        {/* <button className={styles.creatorDashboardButton}>
          Already have files? Start Uploading
        </button> */}
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
              zIndex: 9999, // maximum priority
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserLoginPupUp type="profile" onClose={()=>setEmailVerify(false)}/>
          </div>,
          document.body
        )}
    </>
  );
}

export default CreatorDashboardButton;
