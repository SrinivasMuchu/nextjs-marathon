'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/config';
import axios from 'axios';
import Link from 'next/link';
function CheckHistory() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false); // Avoid flash

  useEffect(() => {
    const uuid = localStorage.getItem('uuid');
    const localHistory = localStorage.getItem('history');

    if (localHistory === 'true') {
      setIsAllowed(true);
      setChecked(true);
      return;
    }

    if (!uuid) {
      setChecked(true);
      return;
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
          localStorage.setItem('history', 'true');
        }
      } catch (error) {
        console.error('Error checking history:', error);
      } finally {
        setChecked(true); // Mark check as completed
      }
    };

    checkPermission();
  }, []);

  if (!checked || !isAllowed) return null;

  return (
    <Link href="/dashboard?cad_type=CAD_VIEWER">
      Dashboard
    </Link>
  );
}

export default CheckHistory;
