"use client"
import React, { useState, useEffect, useContext } from 'react'
import PopupWrapper from './PopupWrapper';
import styles from './CommonStyles.module.css';
import { BASE_URL, GOOGLE_CLIENT_ID, IMAGEURLS } from '@/config';
import { FaLock } from "react-icons/fa";
import EmailOTP from './EmailOTP';
import axios from 'axios';
import { contextState } from './ContextProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function UserLoginPupUp({ onClose, type }) {
console.log(type)
    const { user, setUser, setUpdatedDetails } = useContext(contextState);
    console.log('Google Client ID:', user.email);
    const route = useRouter();
    const [email, setEmail] = useState(user?.email || "");
    const [browserNotify, setBrowserNotify] = useState(true);
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

    useEffect(() => {
        // Load Google Sign-In script
        const loadGoogleScript = () => {
            if (window.google) return;

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.head.appendChild(script);
        };

        const initializeGoogleSignIn = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                    auto_select: false,
                    use_fedcm_for_prompt: false, // Disable FedCM to avoid CORS issues
                });
            }
        };

        loadGoogleScript();
    }, []);

    const handleGoogleCallback = async (response) => {
        try {
            setIsGoogleLoading(true);
            setErrorMessage(''); // Clear any previous errors

            // Decode the JWT token to get user info
            const responsePayload = decodeJwtResponse(response.credential);

            console.log('Google user info:', responsePayload);

            // Get email from Google response
            const googleEmail = responsePayload.email;
            const userName = responsePayload.name;
            const userPicture = responsePayload.picture;

            // Set email in the form
            setEmail(googleEmail);

            // Set SSO flags
            setIsSSO(true);
            setLoginMethod('google');

            console.log('Google SSO login attempt...');
            console.log('Email:', googleEmail);
            console.log('Name:', userName);
            console.log('Picture URL:', userPicture);
            console.log('Login Method: SSO (Google)');
            console.log('Is SSO:', true);

            // Call verify-otp API for Google SSO
            const result = await axios.post(`${BASE_URL}/v1/cad/verify-otp`, {
                email: googleEmail,
                fullname: userName,
                sso: true
            }, {
                headers: {
                    "user-uuid": localStorage.getItem("uuid"),
                }
            });

            console.log('Google SSO API Response:', result.data);

            if (result.data.meta.success) {
                console.log('✅ Google SSO login successful!');

                // Save user email if needed


                localStorage.clear();
                // toast.success('OTP verified successfully!');
                localStorage.setItem('is_verified', true);
                console.log("OTP verified successfully");
                localStorage.setItem('uuid', result.data.data.uuid);
                // onClose()
                setUser({ ...user, email: googleEmail, name: userName })

                if (type === "profile") {
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
        setErrorMessage(''); // Clear previous errors

        if (!agreed) {
            setErrorMessage('Please accept the Terms & Conditions and Privacy Policy to continue.');
            return;
        }

        if (!email) {
            setErrorMessage('Please enter your email address.');
            return;
        }



        try {
            if (!localStorage.getItem('is_verified')) {
                setVerifyEmail(true);
                return; // Stop here and wait for OTP verification
            }

            // Set non-SSO flags for email login
            setIsSSO(false);
            setLoginMethod('email');

            // Handle email login API call
            const result = await axios.post(`${BASE_URL}/v1/cad/user-access`, { email }, {
                headers: {
                    "user-uuid": localStorage.getItem("uuid"),
                }
            });

            if (result.data.meta.success) {
                console.log('✅ Email login successful!');
                setUser({ ...user, email })

                if (type === "profile") {
                    setUpdatedDetails(user)
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

    const handleGoogleLogin = () => {
        setErrorMessage(''); // Clear previous errors

        if (!agreed) {
            setErrorMessage('Please accept the Terms & Conditions and Privacy Policy.');
            return;
        }

        if (isGoogleLoading) return;

        try {
            setIsGoogleLoading(true);

            // Create a hidden div for Google Sign-In button
            const googleButtonDiv = document.createElement('div');
            googleButtonDiv.id = 'g_id_signin';
            googleButtonDiv.style.display = 'none';
            document.body.appendChild(googleButtonDiv);

            // Render Google Sign-In button and auto-click it
            if (window.google && window.google.accounts) {
                window.google.accounts.id.renderButton(
                    googleButtonDiv,
                    {
                        theme: 'outline',
                        size: 'large',
                        width: 250
                    }
                );

                // Auto-trigger the button click
                setTimeout(() => {
                    const button = googleButtonDiv.querySelector('[role="button"]');
                    if (button) {
                        button.click();
                    } else {
                        // Fallback to prompt method
                        window.google.accounts.id.prompt((notification) => {
                            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                                setErrorMessage('Google Sign-In was blocked. Please try again.');
                                setIsGoogleLoading(false);
                            }
                        });
                    }
                    document.body.removeChild(googleButtonDiv);
                }, 100);
            } else {
                setErrorMessage('Google Sign-In not loaded. Please refresh and try again.');
                setIsGoogleLoading(false);
            }
        } catch (error) {
            console.error('Google login trigger error:', error);
            setErrorMessage('Google login failed. Please try again.');
            setIsGoogleLoading(false);
        }
    };

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

    return (
        <PopupWrapper>
            {verifyEmail ? <EmailOTP email={email} setIsEmailVerify={setVerifyEmail} saveDetails={handleSendOTP} /> :
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

                        {errorMessage && (
                            <div className={errorMessage.includes('Welcome') || errorMessage.includes('Successfully') ? styles.successMessage : styles.errorMessage}>
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

                        <button
                            className={styles.googleButton}
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading || (loginMethod === 'email')}
                        >
                            {/* <svg className={styles.googleIcon} viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg> */}
                            <Image src={IMAGEURLS.googleLogo} alt='google' width={25} height={25} />
                            {isGoogleLoading ? 'Signing in...' :
                                isSSO ? 'Logged in with Google' :
                                    'Continue with Google'}
                        </button>
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