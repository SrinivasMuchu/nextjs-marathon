"use client";
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { setCookie, getCookie } from 'cookies-next'; // Install: `npm install cookies-next`

function InitUserUUID() {
  useEffect(() => {
    // 1. Check if UUID exists in cookies
    const existingUUID = getCookie('uuid');

    // 2. Generate and set UUID only if it doesn't exist
    if (!existingUUID) {
      const newUUID = uuidv4();
      setCookie('uuid', newUUID, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',                  // Accessible across all routes
        secure: process.env.NODE_ENV === 'production', // HTTPS-only in prod
        sameSite: 'lax',            // Balances security and usability
      });
    }
  }, []);

  return null; // Renders nothing
}

export default InitUserUUID;