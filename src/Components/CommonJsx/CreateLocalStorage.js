"use client";

import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCookie } from "cookies-next";
import {
  persistAnonymousSession,
  persistVerifiedSession,
  readVerifiedFromStorage,
} from "@/lib/authSession";

function CreateLocalStorage() {
  useEffect(() => {
    const { uuid: verifiedUuid, isVerified } = readVerifiedFromStorage();
    if (isVerified && verifiedUuid) {
      persistVerifiedSession(verifiedUuid);
      return;
    }

    const cookieUuid = getCookie("uuid");
    const localStorageUuid = localStorage.getItem("uuid");

    if (cookieUuid) {
      if (!localStorageUuid || localStorageUuid !== cookieUuid) {
        localStorage.setItem("uuid", cookieUuid);
      }
      return;
    }

    if (localStorageUuid) {
      persistAnonymousSession(localStorageUuid);
      return;
    }

    persistAnonymousSession(uuidv4());
  }, []);

  return null;
}

export default CreateLocalStorage;
