"use client";
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { setCookie, getCookie } from 'cookies-next';

function InitUserUUID() {
  useEffect(() => {
    // 1. First try to get UUID from localStorage
    let uuid = localStorage.getItem('uuid');

    // 2. If not in localStorage, check cookies
    if (!uuid) {
      uuid = getCookie('uuid');
    }

    // 3. Generate new UUID if none exists
    if (!uuid) {
      uuid = uuidv4();
      
      // Set in both storage mechanisms
      setCookie('uuid', uuid, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      
      localStorage.setItem('uuid', uuid);
    }
    // 4. If UUID exists in cookie but not localStorage, sync it
    else if (!localStorage.getItem('uuid')) {
      localStorage.setItem('uuid', uuid);
    }

  }, []);

  return null;
}

export default InitUserUUID;