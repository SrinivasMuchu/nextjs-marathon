'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/config';
import axios from 'axios';

function CheckHistory() {
  const [isAllowed, setIsAllowed] = useState(() => {
    // Initialize from localStorage to prevent flash
    return localStorage.getItem('history') === 'true';
  });

  useEffect(() => {
    // If already allowed, no need to check again
    if (isAllowed) return;

    const uuid = localStorage.getItem('uuid');
    if (!uuid) return;

    const checkPermission = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/cad/history`, {
          params: { uuid },
          headers: {
            'user-uuid': uuid,
          },
        });

        if (response.data.data?.history === true) {
          setIsAllowed(true);
          localStorage.setItem('history', 'true'); // Cache result
        }
      } catch (error) {
        console.error('Error checking history:', error);
      }
    };

    checkPermission();
  }, [isAllowed]);

  if (!isAllowed) return null;

  return (
    <a href="/dashboard">
      History
    </a>
  );
}

export default CheckHistory;
