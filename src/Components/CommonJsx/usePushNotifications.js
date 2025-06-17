'use client';

import { useCallback } from 'react';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function usePushNotifications() {
    const registerPush = useCallback(async (email = '', isBrowserNotificationRequested = false) => {
        if (!email && !isBrowserNotificationRequested) {
            console.warn('Neither email nor browser notification requested.');
            return;
        }
        let accessKey = null;

        // Handle browser notifications first (if requested)
        if (isBrowserNotificationRequested) {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                console.warn('Push notifications not supported.');
            } else {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission !== 'granted') {
                        console.warn('Notification permission not granted.');
                    } else {
                        const reg = await navigator.serviceWorker.register('/sw.js');
                        const sub = await reg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(
                                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                            ),
                        });
                        accessKey = sub;
                        localStorage.setItem('user_access_key', sub.endpoint);
                    }
                } catch (err) {
                    console.error('❌ Push registration failed:', err);
                    // Don't throw here - we might still want to register email
                }
            }
        }

        // Make a single API call with all collected data
        try {
            const payload = {
                ...(email && { email }),
                ...(accessKey && { accessKey })
            };

            // Only make API call if we have something to send
            if (email || accessKey) {
                const result = await axios.post(`${BASE_URL}/v1/cad/user-access`, payload, {
                    headers: {
                        "user-uuid": localStorage.getItem("uuid"), // Moved UUID to headers for security

                    }
                });

                if (result.data.meta.success) {
                    if (email) localStorage.setItem('user_email', email);
                    console.log('✅ Notification preferences saved successfully');
                } else {
                    toast.error(result.data.meta.message);
                    throw new Error(result.data.meta.message);
                }
            }
        } catch (err) {
            console.error('Notification setup failed:', err);
            throw err;
        }
    }, []);

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
    }

    return registerPush;
}