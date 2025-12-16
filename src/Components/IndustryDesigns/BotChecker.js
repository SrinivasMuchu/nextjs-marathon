'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { BASE_URL } from '@/config';

const Turnstile = dynamic(() => import('react-turnstile'), { ssr: false });
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // e.g., https://testing.marathon-os.com/api

export default function BotChecker() {
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);
  const [show, setShow] = useState(false);


  useEffect(() => {
    // Always ask backend if CAPTCHA is needed
    axios.post(`${BASE_URL}/v1/cad/bot-identification`)
      .then(res => {
        const meta = res.data?.meta;
        if (meta && (meta.bot || meta.captcha_required)) {
          setShow(true);
        } else {
          setVerified(true);
          setShow(false);
        }
      })
      .catch(() => {
        // On error, be safe and show CAPTCHA
        setShow(true);
      });
  }, []);

  const handleCaptchaSuccess = async (token) => {
    if (!token) {
      setError('CAPTCHA verification failed. Try again.');
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/v1/cad/bot-identification`, {
        turnstile_token: token
      });
      const data = res.data;
      if (data.meta && data.meta.success) {
        setVerified(true);
        setError(null);
        setShow(false);
      } else if (data.data && data.data.captcha_required) {
        setShow(true);
        setError('Please complete the CAPTCHA.');
      } else {
        setError('Verification failed. Try again.');
      }
    } catch (err) {
      setError('Server error. Try again.');
      console.error('Bot verification error:', err);
    }
  };

  if (verified || !show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 9999
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#555' }}>
          We detected unusual activity. Please verify to continue.
        </p>
        <Turnstile
          sitekey={TURNSTILE_SITE_KEY}
          onSuccess={handleCaptchaSuccess}
          onError={() => setError('CAPTCHA error. Please try again.')}
          style={{ margin: '0 auto' }}
        />
        {error && (
          <p style={{ color: 'red', marginTop: '16px', fontSize: '13px' }}>{error}</p>
        )}
      </div>
    </div>
  );
}
