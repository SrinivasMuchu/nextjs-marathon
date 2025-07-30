import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import styles from './CommonStyles.module.css';
import { BASE_URL } from '@/config';
import { toast } from 'react-toastify';

function EmailOTP({ email, setIsEmailVerify, setError, type, saveDetails }) {
  const inputs = useMemo(() => Array(4).fill().map(() => React.createRef()), []);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const uuid = localStorage.getItem('uuid');

  const sendOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(
        `${BASE_URL}/v1/cad/request-otp`,
        { email },
        { headers: { 'user-uuid': uuid } }
      );

      if (response.data.meta.success) {
        toast.success('OTP sent to your email.');
      } else {
        if (type) {
          setError({ email: response.data.meta.message });
        } else {
          setError(response.data.meta.message);
        }
        setIsEmailVerify(false);
      }
    } catch (err) {
      toast.error('Failed to send OTP.');
    }
    setLoading(false);
  };

  useEffect(() => {
    sendOtp();
  }, [email]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (value) {
      newOtp[idx] = value[0]; // Only first digit
      setOtp(newOtp);
      if (idx < inputs.length - 1) {
        inputs[idx + 1].current?.focus();
      }
    } else {
      newOtp[idx] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];

      if (otp[idx]) {
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        inputs[idx - 1].current?.focus();
        newOtp[idx - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setMessage('');
    try {
      const enteredOtp = otp.join('');
      const res = await axios.post(
        `${BASE_URL}/v1/cad/verify-otp`,
        { email, otp: enteredOtp },
        { headers: { 'user-uuid': uuid } }
      );

      if (res.data.meta.success) {
        toast.success('OTP verified successfully!');
        localStorage.setItem('is_verified', true);
        saveDetails();
      } else {
        setOtp(['', '', '', '']);
        toast.error(res.data.meta.message);
      }
    } catch (err) {
      toast.error('Verification failed.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.popUpMain}>
      <div className={styles.cadNotifyPopup} style={{
        maxWidth: 400,
        textAlign: 'center',
        position: 'relative',
        borderRadius: 16,
        background: '#fff'
      }}>
        {/* Optional SVG Icon */}
        <div style={{ marginBottom: 24 }}>
          {/* ... Insert SVG if needed ... */}
        </div>

        {/* OTP Input Fields */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
          {inputs.map((ref, idx) => (
            <input
              key={idx}
              ref={ref}
              type="text"
              maxLength={1}
              value={otp[idx]}
              onChange={e => handleChange(e, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              disabled={loading}
              style={{
                width: 40,
                height: 48,
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                background: '#F5F7FA',
                fontSize: 24,
                textAlign: 'center'
              }}
            />
          ))}
        </div>

        {/* Title and Info */}
        <h3 style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>Verification Code</h3>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>
          Please enter the 4-digit code sent to your email address to verify your account.
        </p>
        {message && (
          <div style={{ color: message.includes('success') ? '#38a169' : '#e53e3e', marginBottom: 12 }}>
            {message}
          </div>
        )}

        {/* Buttons */}
        {otp.every(val => val) ? (
          <button
            onClick={handleVerify}
            disabled={loading}
            style={{
              width: '100%',
              background: '#38a169',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: 8
            }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        ) : (
          <button
            onClick={sendOtp}
            disabled={loading}
            style={{
              width: '100%',
              background: '#610bee',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: 8
            }}
          >
            {loading ? 'Sending...' : 'Resend'}
          </button>
        )}
      </div>
    </div>
  );
}

export default EmailOTP;
