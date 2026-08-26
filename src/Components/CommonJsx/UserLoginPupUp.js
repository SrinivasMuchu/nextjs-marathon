"use client"
import React, { useState, useEffect, useContext, useRef } from 'react'
import PopupWrapper from './PopupWrapper';
import styles from './CommonStyles.module.css';
import { BASE_URL, GOOGLE_CLIENT_ID, IMAGEURLS } from '@/config';
import { FaLock } from "react-icons/fa";
import EmailOTP from './EmailOTP';
import axios from 'axios';
import { contextState } from './ContextProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import usePushNotifications from './usePushNotifications';
import { persistVerifiedSession } from '@/lib/authSession';

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

// Helper to get push subscription
async function getPushSubscription() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported.');
        return null;
    }
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission not granted.');
            return null;
        }
        const reg = await navigator.serviceWorker.register('/sw.js');
        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
        });
        return sub.toJSON();
    } catch (err) {
        console.error('❌ Push registration failed:', err);
        return null;
    }
}

function UserLoginPupUp({ onClose, type }) {
    const { user, setUser, setUpdatedDetails } = useContext(contextState);
    console.log('Google Client ID:', user.email);
    const route = useRouter();
    const [email, setEmail] = useState(user?.email || "");
    const [browserNotify, setBrowserNotify] = useState(true);
    const [accessKey, setAccessKey] = useState(null); // <-- Add this state

    // Sync email when user context updates
    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user?.email]);
     const handleNotificationToggle = () => {
    setBrowserNotify(!browserNotify);
  };
    const [agreed, setAgreed] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isSSO, setIsSSO] = useState(false); // Track if user used SSO login
    const [loginMethod, setLoginMethod] = useState(null); // Track login method: 'google' or 'email'
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [needsFullname, setNeedsFullname] = useState(false);
    const [fullname, setFullname] = useState('');
    const [otpAlreadySent, setOtpAlreadySent] = useState(false);
    const registerPush = usePushNotifications();
    const googleBtnRef = useRef(null);
    const googleCallbackRef = useRef(null);
    const googleInitializedRef = useRef(false);
    const [googleReady, setGoogleReady] = useState(false);

    const renderGoogleButton = () => {
        const container = googleBtnRef.current;
        if (!container || !window.google?.accounts?.id) return;

        container.innerHTML = '';
        const width = Math.floor(container.parentElement?.getBoundingClientRect().width || 320);
        window.google.accounts.id.renderButton(container, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            width: Math.min(Math.max(width, 200), 400),
        });

        const stretchIframe = () => {
            const iframe = container.querySelector('iframe');
            if (!iframe) return false;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.minWidth = '100%';
            iframe.style.minHeight = '100%';
            return true;
        };
        if (!stretchIframe()) {
            const observer = new MutationObserver(() => {
                if (stretchIframe()) observer.disconnect();
            });
            observer.observe(container, { childList: true, subtree: true });
            setTimeout(() => observer.disconnect(), 3000);
        }
        setGoogleReady(true);
    };

    useEffect(() => {
        if (verifyEmail) {
            setGoogleReady(false);
            return;
        }

        let cancelled = false;
        const scriptSrc = 'https://accounts.google.com/gsi/client';

        const initializeGoogleSignIn = () => {
            if (cancelled || !window.google?.accounts?.id) return;
            if (!googleInitializedRef.current) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (response) => googleCallbackRef.current?.(response),
                    auto_select: false,
                    ux_mode: 'popup',
                    use_fedcm_for_prompt: false,
                });
                googleInitializedRef.current = true;
            }
            renderGoogleButton();
        };

        if (window.google?.accounts?.id) {
            initializeGoogleSignIn();
            return () => { cancelled = true; };
        }

        const existing = document.querySelector(`script[src="${scriptSrc}"]`);
        if (existing) {
            existing.addEventListener('load', initializeGoogleSignIn);
            return () => {
                cancelled = true;
                existing.removeEventListener('load', initializeGoogleSignIn);
            };
        }

        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.head.appendChild(script);

        return () => { cancelled = true; };
    }, [verifyEmail]);

    const handleGoogleCallback = async (response) => {
        try {
            setIsGoogleLoading(true);
            setErrorMessage('');
            const responsePayload = decodeJwtResponse(response.credential);
            const googleEmail = responsePayload.email;
            const userName = responsePayload.name;
            setEmail(googleEmail);
            setIsSSO(true);
            setLoginMethod('google');

            const result = await axios.post(`${BASE_URL}/v1/cad/verify-otp`, {
                email: googleEmail,
                fullname: userName,
                sso: true,
            }, {
                headers: {
                    "user-uuid": localStorage.getItem("uuid"),
                }
            });

            console.log('Google SSO API Response:', result.data);

            if (result.data.meta.success) {
                console.log('✅ Google SSO login successful!');

                persistVerifiedSession(result.data.data.uuid);
                setUser({ ...user, email: googleEmail, name: userName })

                handleRegisterNotifications(googleEmail);

                if (type === "comments") {
                    setUpdatedDetails(user)
                    onClose()
                } else if (type === "profile") {
                    setUpdatedDetails(user)
                    onClose()
                    route.push('/dashboard')
                } else if (type === 'creator'||type === 'dashboard') {
                   
                    window.location.reload()
                } else {
                    setUpdatedDetails(user)
                    onClose()
                }



            } else {
                console.log('❌ Google SSO login failed:', result.data.meta.message || 'Unknown error');
                setErrorMessage(result.data.meta.message || 'Google SSO login failed. Please try again.');
                setIsSSO(false);
                setLoginMethod(null);
                setEmail(''); // Clear email on failure
            }

        } catch (error) {
            console.error('Google login error:', error);

            let errorMsg = 'Google login failed. Please try again.';

            if (error.response) {
                // Server responded with error status
                console.error('Server error:', error.response.data);
                errorMsg = error.response.data?.meta?.message || 'Server error occurred during Google login.';
            } else if (error.request) {
                // Network error
                console.error('Network error:', error.request);
                errorMsg = 'Network error. Please check your connection and try again.';
            }

            setErrorMessage(errorMsg);
            setIsSSO(false);
            setLoginMethod(null);
            setEmail(''); // Clear email on error

        } finally {
            setIsGoogleLoading(false);
        }
    };

    const decodeJwtResponse = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    const handleSendOTP = async () => {
        setErrorMessage('');
    if (!agreed) {
        setErrorMessage('Please accept the Terms & Conditions and Privacy Policy to continue.');
        return;
    }
    if (!email) {
        setErrorMessage('Please enter your email address.');
        return;
    }
    if (needsFullname && !fullname.trim()) {
        setErrorMessage('Please enter your full name to continue.');
        return;
    }
    try {
        if (!localStorage.getItem('is_verified')) {
            // Call request-otp first to check if fullname is required (new signup)
            setIsSSO(false);
            setLoginMethod('email');
            const result = await axios.post(`${BASE_URL}/v1/cad/request-otp`, 
                { email, ...(fullname.trim() && { full_name: fullname.trim() }) },
                { headers: { 'user-uuid': localStorage.getItem('uuid') } }
            );

            if (result.data.meta.fullname_required) {
                setNeedsFullname(true);
                setErrorMessage(result.data.meta.message || 'Please enter your full name to continue.');
                return;
            }

            if (result.data.meta.success) {
                setOtpAlreadySent(true);
                setVerifyEmail(true);
                setNeedsFullname(false);
            } else {
                setErrorMessage(result.data.meta.message || 'Failed to send OTP.');
            }
            return;
        }
        setIsSSO(false);
        setLoginMethod('email');

        // Register for push notifications and get subscription
        let pushSubscription = null;
        if (browserNotify) {
            pushSubscription = await getPushSubscription();
        }

        // Handle email login API call, include pushSubscription if available
        const result = await axios.post(`${BASE_URL}/v1/cad/user-access`, {
            email,
           accessKey: pushSubscription ? pushSubscription : null, // Spread operator used here
        }, {
            headers: {
                "user-uuid": localStorage.getItem("uuid"),
            }
        });

        if (result.data.meta.success) {
            console.log('✅ Email login successful!');
            setUser({ ...user, email })

            // Register for push notifications after login
            await handleRegisterNotifications(email);

            if (type === "comments") {
                setUpdatedDetails(user)
                onClose()
            } else if (type === "profile") {
                setUpdatedDetails(user)
                onClose()
                route.push('/dashboard')
            } else if (type === 'creator' || type === 'dashboard') {
              window.location.reload()
            } else {
                setUpdatedDetails(user)
                onClose()
            }




        } else {
            setErrorMessage(result.data.meta.message || 'Login failed. Please try again.');
        }

    } catch (error) {
        console.error('Error sending OTP:', error);
        let errorMsg = 'Failed to send OTP. Please try again.';

        if (error.response?.data?.meta?.message) {
            errorMsg = error.response.data.meta.message;
        }

        setErrorMessage(errorMsg);
    }
    };

    const handleGoogleFallbackClick = () => {
        if (isGoogleLoading || loginMethod === 'email' || isSSO) return;
        if (!agreed) {
            setErrorMessage('Please accept the Terms & Conditions and Privacy Policy.');
            return;
        }
        if (!googleReady) {
            setErrorMessage('Google Sign-In is still loading. Please try again.');
        }
    };

    googleCallbackRef.current = handleGoogleCallback;

    const handleCheckboxChange = (e) => {
        setAgreed(e.target.checked);
        if (e.target.checked && errorMessage) {
            setErrorMessage(''); // Clear error when terms are accepted
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (e.target.value && errorMessage.includes('email')) {
            setErrorMessage(''); // Clear email error when user starts typing
        }
    };


    // Function to get current login status
    const getLoginStatus = () => {
        return {
            email,
            isSSO,
            loginMethod,
            isLoggedIn: !!(email && (isSSO || loginMethod))
        };
    };

    // Log current status when state changes
    useEffect(() => {
        if (email && loginMethod) {
            console.log('Current Login Status:', getLoginStatus());
        }
    }, [email, isSSO, loginMethod]);

    // Call this after successful login (Google or Email)
    const handleRegisterNotifications = async (userEmail) => {
        try {
            if (browserNotify) {
                await registerPush(userEmail, true);
            }
        } catch (err) {
            console.error('Failed to register push notifications:', err);
        }
    };

    useEffect(() => {
        if (!verifyEmail || !browserNotify) return;
        let cancelled = false;
        getPushSubscription().then((sub) => {
            if (!cancelled) setAccessKey(sub);
        });
        return () => { cancelled = true; };
    }, [verifyEmail, browserNotify]);

    return (
        <PopupWrapper>
            {verifyEmail ? 
                <EmailOTP 
                    email={email} 
                    fullname={fullname}
                    setIsEmailVerify={setVerifyEmail} 
                    setError={setErrorMessage}
                    setNeedsFullname={setNeedsFullname}
                    saveDetails={handleSendOTP}
                    accessKey={accessKey}
                    skipInitialSend={otpAlreadySent}
                /> 
                :
                <div className={styles.loginPopup}>
                    {type !== 'creator' && <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>}
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        width: '100%', justifyContent: 'center'
                    }}>
                        <Image src={IMAGEURLS.marathonLogo} alt="marathon Logo" width={40} height={40} />
                        {/* <div style={{ background: '#610bee', color: 'white', borderRadius: '50%', padding: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaLock />
                    </div> */}
                    </div>

                    <div className={styles.header}>
                        <h2>Log in to your account</h2>
                        <p>Choose your preferred login method</p>
                        {/* Show current login status for debugging */}
                       
                    </div>

                    <div className={styles.formSection}>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Id</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={handleEmailChange}
                                className={styles.emailInput}
                                disabled={isSSO} // Disable input if logged in via SSO
                            />
                        </div>

                        {needsFullname && (
                            <div className={styles.inputGroup}>
                                <label htmlFor="fullname">Full Name</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    placeholder="Enter your full name"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    className={styles.emailInput}
                                    disabled={isSSO}
                                />
                            </div>
                        )}

                        {errorMessage && (
                            <div className={
                                errorMessage.includes('Welcome') || errorMessage.includes('Successfully') ? styles.successMessage
                                : (needsFullname && errorMessage.includes('full name')) ? styles.infoMessage
                                : styles.errorMessage
                            }>
                                {errorMessage}
                            </div>
                        )}

                        <button
                            style={{ background: '#610bee' }}
                            className={styles.sendOtpButton}
                            onClick={handleSendOTP}
                            disabled={isSSO} // Disable OTP button if logged in via SSO
                        >
                            {isSSO ? 'Logged in via Google' : 'Send OTP'}
                        </button>

                        <div className={styles.divider}>
                            <div className={styles.dividerLine}></div>
                            <span>or</span>
                            <div className={styles.dividerLine}></div>
                        </div>

                        <div className={styles.googleButtonWrap}>
                            <button
                                type="button"
                                className={styles.googleButton}
                                disabled={isGoogleLoading || (loginMethod === 'email')}
                                tabIndex={-1}
                            >
                                <Image src={IMAGEURLS.googleLogo} alt='google' width={25} height={25} />
                                {isGoogleLoading ? 'Signing in...' :
                                    isSSO ? 'Logged in with Google' :
                                        googleReady ? 'Continue with Google' :
                                            'Loading Google...'}
                            </button>
                            <div ref={googleBtnRef} className={styles.googleGsiOverlay} />
                            {(!googleReady || !agreed || isGoogleLoading || loginMethod === 'email' || isSSO) && (
                                <button
                                    type="button"
                                    className={styles.googleButtonCatcher}
                                    onClick={handleGoogleFallbackClick}
                                    aria-label="Continue with Google"
                                />
                            )}
                        </div>
                         <div className="flex items-center gap-3 mb-6">
          <span className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.07-1.64-5.64-5-6.32V4a1 1 0 10-2 0v.68c-3.36.68-5 3.25-5 6.32v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </span>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-gray-700">Enable Browser Notifications</span>
            <input
              type="checkbox"
              className="sr-only"
              checked={browserNotify}
              onChange={handleNotificationToggle}
            />
            <div className={`w-10 h-5 rounded-full ${browserNotify ? 'bg-blue-600' : 'bg-gray-300'} relative`}>
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${browserNotify ? 'translate-x-5' : ''}`}
              />
            </div>
          </label>
        </div>
                        <div className={styles.notificationsSection}>
                            <label className={styles.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={handleCheckboxChange}
                                />
                                <span className={styles.checkmark}></span>
                                I agree to the <a href="/terms-and-conditions" target='_blank' className={styles.link}>Terms & Conditions</a>
                                and <a href="/privacy-policy" target='_blank' className={styles.link}>Privacy Policy</a>
                            </label>
                        </div>
                    </div>
                </div>
            }
        </PopupWrapper>
    )
}

export default UserLoginPupUp