"use client";
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCookie, setCookie } from 'cookies-next';

function CreateLocalStorage() {
  useEffect(() => {
    // Get UUID from cookie and localStorage
    const cookieUuid = getCookie('uuid');
    const localStorageUuid = localStorage.getItem('uuid');

    // Case 1: UUID exists in cookie
    if (cookieUuid) {
      // Sync to localStorage if not present or different
      if (!localStorageUuid || localStorageUuid !== cookieUuid) {
        localStorage.setItem('uuid', cookieUuid);
      }
    }
    // Case 2: UUID exists in localStorage but not in cookie (migration for existing users)
    else if (localStorageUuid) {
      // Migrate localStorage UUID to cookie
      setCookie('uuid', localStorageUuid, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
      });
    }
    // Case 3: No UUID exists in either storage (new user)
    else {
      const newUuid = uuidv4();
      // Set in both cookie and localStorage
      setCookie('uuid', newUuid, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        sameSite: 'lax'
      });
      localStorage.setItem('uuid', newUuid);
    }
  }, []);
  // Return null to render nothing
  return null;
}


export default CreateLocalStorage;
