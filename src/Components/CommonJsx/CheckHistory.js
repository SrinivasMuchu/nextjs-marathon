'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/config';
import axios from 'axios';

function CheckHistory() {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const uuid = localStorage.getItem('uuid');
    if (!uuid) return;

    const checkPermission = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/v1/cad/history`, {
          params: { uuid },
          headers: {
            "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security

          }
        });

        if (response.data.data?.history === true) {
          setIsAllowed(true);
        }
      } catch (error) {
        console.error('Error checking history:', error);
      }
    };

    checkPermission();
  }, []);

  if (!isAllowed) return null;

  return (
    <>
      History
    </>
  );
}

export default CheckHistory;
