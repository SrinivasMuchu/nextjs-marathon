'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/config';
import axios from 'axios';

function CheckHistory() {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const uuid = localStorage.getItem('uuid');
    if (!uuid) return;

    const localHistory = localStorage.getItem('history');

    if (localHistory === 'true') {
      setIsAllowed(true);
      return; // Skip API call
    }

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
  }, []);

  if (!isAllowed) return null;

  return (
    <a href="/dashboard">
     Dashboard
    </a>
  );
}

export default CheckHistory;
